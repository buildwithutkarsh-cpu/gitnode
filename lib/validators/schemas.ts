// lib/validators/schemas.ts

import { z } from "zod";

// ─── Repository Schemas ───────────────────────────────────────────────────────

export const createRepositorySchema = z.object({
  name: z
    .string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must be 100 characters or fewer")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Repository name may only contain alphanumeric characters, hyphens, underscores, and dots"
    ),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional(),
  isPrivate: z.coerce.boolean().default(false),
  language: z.string().max(50).optional(),
});

export const updateRepositorySchema = z.object({
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional(),
  isPrivate: z.coerce.boolean().optional(),
  language: z.string().max(50).optional(),
});

export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>;
export type UpdateRepositoryInput = z.infer<typeof updateRepositorySchema>;

// ─── Issue Schemas ────────────────────────────────────────────────────────────

export const createIssueSchema = z.object({
  title: z
    .string()
    .min(1, "Issue title is required")
    .max(255, "Issue title must be 255 characters or fewer"),
  body: z.string().max(10_000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assigneeId: z.string().cuid().optional(),
});

export const updateIssueSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  body: z.string().max(10_000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  assigneeId: z.string().cuid().nullable().optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

// ─── Comment Schemas ──────────────────────────────────────────────────────────

export const createCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment body is required")
    .max(10_000, "Comment must be 10,000 characters or fewer"),
  targetType: z.enum(["ISSUE", "REPOSITORY"]),
  issueId: z.string().cuid().optional(),
  repositoryId: z.string().cuid().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;