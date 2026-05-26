// lib/db/repositories/activity.repository.ts

import { db } from "@/lib/db";
import type { Prisma, Activity } from "@prisma/client";

export type ActivityWithRelations = Prisma.ActivityGetPayload<{
  include: {
    user: { select: { id: true; username: true; name: true; image: true } };
    repository: { select: { id: true; name: true; slug: true } } | null;
  };
}>;

export async function createActivity(
  data: Prisma.ActivityUncheckedCreateInput
): Promise<Activity> {
  return db.activity.create({ data });
}

export async function findGlobalActivities(
  limit = 30
): Promise<ActivityWithRelations[]> {
  return db.activity.findMany({
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
      repository: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function findActivitiesByUser(
  userId: string,
  limit = 20
): Promise<ActivityWithRelations[]> {
  return db.activity.findMany({
    where: { userId },
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
      repository: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
