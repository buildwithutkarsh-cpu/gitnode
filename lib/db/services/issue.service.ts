// lib/db/services/issue.service.ts

import { revalidatePath } from "next/cache";
import {
  createIssue,
  findIssueById,
  getNextIssueNumber,
  updateIssueById,
} from "@/lib/db/repositories/issue.repository";
import { createActivity } from "@/lib/db/repositories/activity.repository";
import type { CreateIssueInput, UpdateIssueInput } from "@/lib/validators/schemas";
import type { ServiceResult } from "@/lib/db/services/repository.service";

export async function createIssueService(
  userId: string,
  repositoryId: string,
  ownerUsername: string,
  repoSlug: string,
  input: CreateIssueInput
): Promise<ServiceResult<{ number: number }>> {
  try {
    const number = await getNextIssueNumber(repositoryId);

    const issue = await createIssue({
      number,
      title: input.title,
      body: input.body,
      priority: input.priority,
      repository: { connect: { id: repositoryId } },
      author: { connect: { id: userId } },
      ...(input.assigneeId
        ? { assignee: { connect: { id: input.assigneeId } } }
        : {}),
    });

    await createActivity({
      eventType: "OPENED_ISSUE",
      userId,
      repositoryId,
      metadata: { issueNumber: issue.number, title: issue.title },
    });

    revalidatePath(`/repositories/${ownerUsername}/${repoSlug}/issues`);

    return { success: true, data: { number: issue.number } };
  } catch (err) {
    console.error("[createIssueService]", err);
    return { success: false, error: "Failed to create issue." };
  }
}

export async function updateIssueService(
  userId: string,
  issueId: string,
  repositoryId: string,
  ownerUsername: string,
  repoSlug: string,
  input: UpdateIssueInput
): Promise<ServiceResult<void>> {
  try {
    const issue = await findIssueById(issueId);
    if (!issue) return { success: false, error: "Issue not found." };
    if (issue.repositoryId !== repositoryId) {
      return { success: false, error: "Issue does not belong to this repository." };
    }

    const wasOpen = issue.status === "OPEN";
    const isClosing = input.status === "CLOSED" && wasOpen;

    await updateIssueById(issueId, {
      ...(input.title ? { title: input.title } : {}),
      ...(input.body !== undefined ? { body: input.body } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.assigneeId !== undefined
        ? input.assigneeId === null
          ? { assignee: { disconnect: true } }
          : { assignee: { connect: { id: input.assigneeId } } }
        : {}),
    });

    if (isClosing) {
      await createActivity({
        eventType: "CLOSED_ISSUE",
        userId,
        repositoryId,
        metadata: { issueNumber: issue.number },
      });
    }

    revalidatePath(`/repositories/${ownerUsername}/${repoSlug}/issues`);

    return { success: true, data: undefined };
  } catch (err) {
    console.error("[updateIssueService]", err);
    return { success: false, error: "Failed to update issue." };
  }
}