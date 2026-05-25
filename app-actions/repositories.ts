// app-actions/repositories.ts

"use server";

import { auth } from "@/lib/auth";
import {
  createRepositorySchema,
  updateRepositorySchema,
} from "@/lib/validators/schemas";
import {
  createRepositoryService,
  deleteRepositoryService,
  toggleStarService,
  updateRepositoryService,
} from "@/lib/db/services/repository.service";
import { redirect } from "next/navigation";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

// ─── Create Repository ────────────────────────────────────────────────────────

export async function createRepositoryAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string; redirect?: string }> {
  const user = await requireAuth();

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    isPrivate: formData.get("isPrivate"),
    language: formData.get("language"),
  };

  const parsed = createRepositorySchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input.";
    return { error: firstError };
  }

  const result = await createRepositoryService(
    user.id,
    user.username,
    parsed.data
  );

  if (!result.success) {
    return { error: result.error };
  }

  return {
    redirect: `/repositories/${result.data.ownerUsername}/${result.data.slug}`,
  };
}

// ─── Update Repository ────────────────────────────────────────────────────────

export async function updateRepositoryAction(
  repoId: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const user = await requireAuth();

  const raw = {
    description: formData.get("description"),
    isPrivate: formData.get("isPrivate"),
    language: formData.get("language"),
  };

  const parsed = updateRepositorySchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input.";
    return { error: firstError };
  }

  const result = await updateRepositoryService(user.id, repoId, parsed.data);

  if (!result.success) {
    return { error: result.error };
  }

  return { success: true };
}

// ─── Delete Repository ────────────────────────────────────────────────────────

export async function deleteRepositoryAction(
  repoId: string
): Promise<{ error?: string }> {
  const user = await requireAuth();

  const result = await deleteRepositoryService(user.id, user.username, repoId);

  if (!result.success) {
    return { error: result.error };
  }

  redirect("/dashboard");
}

// ─── Toggle Star ──────────────────────────────────────────────────────────────

export async function toggleStarAction(
  repositoryId: string,
  ownerUsername: string,
  repoSlug: string
): Promise<{ error?: string; starred?: boolean }> {
  const user = await requireAuth();

  const result = await toggleStarService(
    user.id,
    repositoryId,
    ownerUsername,
    repoSlug
  );

  if (!result.success) {
    return { error: result.error };
  }

  return { starred: result.data.starred };
}