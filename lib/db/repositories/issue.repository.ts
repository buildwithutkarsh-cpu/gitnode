// lib/db/repositories/issue.repository.ts

import { db } from "@/lib/db";
import type { Prisma, Issue } from "@prisma/client";

export type IssueWithRelations = Prisma.IssueGetPayload<{
  include: {
    author: { select: { id: true; username: true; name: true; image: true } };
    assignee: { select: { id: true; username: true; name: true; image: true } } | null;
    _count: { select: { comments: true } };
  };
}>;

export async function findIssuesByRepository(
  repositoryId: string
): Promise<IssueWithRelations[]> {
  return db.issue.findMany({
    where: { repositoryId },
    include: {
      author: { select: { id: true, username: true, name: true, image: true } },
      assignee: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findIssueByRepoAndNumber(
  repositoryId: string,
  number: number
): Promise<IssueWithRelations | null> {
  return db.issue.findUnique({
    where: { repositoryId_number: { repositoryId, number } },
    include: {
      author: { select: { id: true, username: true, name: true, image: true } },
      assignee: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
  });
}

export async function getNextIssueNumber(repositoryId: string): Promise<number> {
  const result = await db.issue.aggregate({
    where: { repositoryId },
    _max: { number: true },
  });
  return (result._max.number ?? 0) + 1;
}

export async function createIssue(
  data: Prisma.IssueCreateInput
): Promise<Issue> {
  return db.issue.create({ data });
}

export async function updateIssueById(
  id: string,
  data: Prisma.IssueUpdateInput
): Promise<Issue> {
  return db.issue.update({ where: { id }, data });
}

export async function findIssueById(id: string): Promise<Issue | null> {
  return db.issue.findUnique({ where: { id } });
}