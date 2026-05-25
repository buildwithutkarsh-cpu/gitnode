// lib/db/repositories/repository.repository.ts
import { db } from "@/lib/db";
import type { Prisma, Repository } from "@prisma/client";

export type RepositoryWithMeta = Prisma.RepositoryGetPayload<{
  include: {
    owner: { select: { id: true; username: true; name: true; image: true } };
    _count: { select: { stars: true; issues: true } };
  };
}>;

export type RepositoryWithStarStatus = RepositoryWithMeta & {
  isStarredByCurrentUser: boolean;
};

// ─── Finders ─────────────────────────────────────────────────────────────────

export async function findRepositoryById(
  id: string
): Promise<RepositoryWithMeta | null> {
  return db.repository.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { stars: true, issues: true } },
    },
  });
}

export async function findRepositoryByOwnerAndSlug(
  ownerUsername: string,
  slug: string
): Promise<RepositoryWithMeta | null> {
  return db.repository.findFirst({
    where: {
      slug,
      owner: { username: ownerUsername },
    },
    include: {
      owner: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { stars: true, issues: true } },
    },
  });
}

export async function findRepositoriesByOwner(
  ownerId: string
): Promise<RepositoryWithMeta[]> {
  return db.repository.findMany({
    where: { ownerId },
    include: {
      owner: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { stars: true, issues: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function findPublicRepositories(
  limit = 20,
  offset = 0
): Promise<RepositoryWithMeta[]> {
  return db.repository.findMany({
    where: { isPrivate: false },
    include: {
      owner: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { stars: true, issues: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function findTrendingRepositories(
  limit = 10
): Promise<RepositoryWithMeta[]> {
  return db.repository.findMany({
    where: { isPrivate: false },
    include: {
      owner: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { stars: true, issues: true } },
    },
    orderBy: { stars: { _count: "desc" } },
    take: limit,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createRepository(
  data: Prisma.RepositoryCreateInput
): Promise<Repository> {
  return db.repository.create({ data });
}

export async function updateRepositoryById(
  id: string,
  data: Prisma.RepositoryUpdateInput
): Promise<Repository> {
  return db.repository.update({ where: { id }, data });
}

export async function deleteRepositoryById(id: string): Promise<Repository> {
  return db.repository.delete({ where: { id } });
}

// ─── Star Primitives ──────────────────────────────────────────────────────────

export async function findStar(
  userId: string,
  repositoryId: string
): Promise<{ id: string } | null> {
  return db.star.findUnique({
    where: { userId_repositoryId: { userId, repositoryId } },
    select: { id: true },
  });
}

export async function createStar(
  userId: string,
  repositoryId: string
): Promise<void> {
  await db.star.create({ data: { userId, repositoryId } });
}

export async function deleteStar(
  userId: string,
  repositoryId: string
): Promise<void> {
  await db.star.delete({
    where: { userId_repositoryId: { userId, repositoryId } },
  });
}

// ─── Slug Uniqueness ──────────────────────────────────────────────────────────

export async function isSlugAvailableForOwner(
  ownerId: string,
  slug: string
): Promise<boolean> {
  const existing = await db.repository.findUnique({
    where: { ownerId_slug: { ownerId, slug } },
    select: { id: true },
  });
  return existing === null;
}