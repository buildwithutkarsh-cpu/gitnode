// app-actions/issues.ts

"use server";

import { auth } from "@/lib/auth";
import { createIssueSchema, updateIssueSchema } from "@/lib/validators/schemas";
import {
  createIssueService,
  updateIssueService,
} from "@/lib/db/services/issue.service";
import { findRepositoryByOwnerAndSlug } from "@/lib/db/repositories/repository.repository";
import { redirect } from "next/navigation";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

// ─── Create Issue ─────────────────────────────────────────────────────────────

export async function createIssueAction(
  ownerUsername: string,
  repoSlug: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string; redirect?: string }> {
  const user = await requireAuth();

  const repo = await findRepositoryByOwnerAndSlug(ownerUsername, repoSlug);
  if (!repo) return { error: "Repository not found." };

  const raw = {
    title: formData.get("title"),
    body: formData.get("body"),
    priority: formData.get("priority"),
    assigneeId: formData.get("assigneeId") || undefined,
  };

  const parsed = createIssueSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const result = await createIssueService(
    user.id,
    repo.id,
    ownerUsername,
    repoSlug,
    parsed.data
  );

  if (!result.success) return { error: result.error };

  return {
    redirect: `/repositories/${ownerUsername}/${repoSlug}/issues`,
  };
}

// ─── Update Issue ─────────────────────────────────────────────────────────────

export async function updateIssueAction(
  issueId: string,
  repositoryId: string,
  ownerUsername: string,
  repoSlug: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const user = await requireAuth();

  const raw = {
    title: formData.get("title") || undefined,
    body: formData.get("body") || undefined,
    priority: formData.get("priority") || undefined,
    status: formData.get("status") || undefined,
    assigneeId:
      formData.get("assigneeId") === ""
        ? null
        : formData.get("assigneeId") || undefined,
  };

  const parsed = updateIssueSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const result = await updateIssueService(
    user.id,
    issueId,
    repositoryId,
    ownerUsername,
    repoSlug,
    parsed.data
  );

  if (!result.success) return { error: result.error };

  return { success: true };
}
