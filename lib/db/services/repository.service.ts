// lib/db/services/repository.service.ts

import { revalidatePath } from "next/cache";
import {
  createRepository,
  deleteRepositoryById,
  findRepositoryById,
  findStar,
  createStar,
  deleteStar,
  isSlugAvailableForOwner,
  updateRepositoryById,
} from "@/lib/db/repositories/repository.repository";
import { createActivity } from "@/lib/db/repositories/activity.repository";
import type { CreateRepositoryInput, UpdateRepositoryInput } from "@/lib/validators/schemas";

// ─── Slug Generation ──────────────────────────────────────────────────────────

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_.]/g, "")
    .replace(/^[-_.]+|[-_.]+$/g, "")
    .slice(0, 100);
}

async function resolveUniqueSlug(ownerId: string, name: string): Promise<string> {
  const base = generateSlug(name);
  let slug = base;
  let counter = 1;

  while (!(await isSlugAvailableForOwner(ownerId, slug))) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}

// ─── Service Actions ──────────────────────────────────────────────────────────

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createRepositoryService(
  userId: string,
  username: string,
  input: CreateRepositoryInput
): Promise<ServiceResult<{ slug: string; ownerUsername: string }>> {
  try {
    const slug = await resolveUniqueSlug(userId, input.name);

    const repo = await createRepository({
      name: input.name,
      slug,
      description: input.description,
      isPrivate: input.isPrivate,
      language: input.language,
      owner: { connect: { id: userId } },
    });

    await createActivity({
      eventType: "CREATED_REPO",
      userId,
      repositoryId: repo.id,
      metadata: { repoName: repo.name },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/profile/${username}`);

    return { success: true, data: { slug: repo.slug, ownerUsername: username } };
  } catch (err) {
    console.error("[createRepositoryService]", err);
    return { success: false, error: "Failed to create repository." };
  }
}

export async function updateRepositoryService(
  userId: string,
  repoId: string,
  input: UpdateRepositoryInput
): Promise<ServiceResult<{ id: string }>> {
  try {
    const repo = await findRepositoryById(repoId);
    if (!repo) return { success: false, error: "Repository not found." };
    if (repo.ownerId !== userId) return { success: false, error: "Unauthorized." };

    const updated = await updateRepositoryById(repoId, {
      description: input.description,
      isPrivate: input.isPrivate,
      language: input.language,
    });

    revalidatePath(`/repositories/${repo.owner.username}/${repo.slug}`);

    return { success: true, data: { id: updated.id } };
  } catch (err) {
    console.error("[updateRepositoryService]", err);
    return { success: false, error: "Failed to update repository." };
  }
}

export async function deleteRepositoryService(
  userId: string,
  username: string,
  repoId: string
): Promise<ServiceResult<void>> {
  try {
    const repo = await findRepositoryById(repoId);
    if (!repo) return { success: false, error: "Repository not found." };
    if (repo.ownerId !== userId) return { success: false, error: "Unauthorized." };

    await deleteRepositoryById(repoId);

    revalidatePath("/dashboard");
    revalidatePath(`/profile/${username}`);

    return { success: true, data: undefined };
  } catch (err) {
    console.error("[deleteRepositoryService]", err);
    return { success: false, error: "Failed to delete repository." };
  }
}

export async function toggleStarService(
  userId: string,
  repositoryId: string,
  ownerUsername: string,
  repoSlug: string
): Promise<ServiceResult<{ starred: boolean }>> {
  try {
    const existing = await findStar(userId, repositoryId);

    if (existing) {
      await deleteStar(userId, repositoryId);
      await createActivity({
        eventType: "UNSTARRED_REPO",
        userId,
        repositoryId,
      });
      revalidatePath(`/repositories/${ownerUsername}/${repoSlug}`);
      return { success: true, data: { starred: false } };
    } else {
      await createStar(userId, repositoryId);
      await createActivity({
        eventType: "STARRED_REPO",
        userId,
        repositoryId,
      });
      revalidatePath(`/repositories/${ownerUsername}/${repoSlug}`);
      return { success: true, data: { starred: true } };
    }
  } catch (err) {
    console.error("[toggleStarService]", err);
    return { success: false, error: "Failed to toggle star." };
  }
}