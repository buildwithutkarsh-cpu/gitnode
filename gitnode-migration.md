# GitNode — Full-Stack Migration Guide
> Next.js 15+ · Auth.js v5 · Prisma · Supabase PostgreSQL · Neo-Brutalist Design

---

## Table of Contents
1. [prisma/schema.prisma](#1-prismaschemaprisma)
2. [lib/db.ts — Prisma Singleton](#2-libdbts--prisma-singleton)
3. [lib/validators/schemas.ts — Zod Schemas](#3-libvalidatorsschemats--zod-schemas)
4. [lib/auth/config.ts — NextAuth Config](#4-libauthconfigts--nextauth-config)
5. [lib/auth.ts — Auth Exports](#5-libauthts--auth-exports)
6. [middleware.ts — Route Protection](#6-middlewarets--route-protection)
7. [lib/db/repositories/repository.repository.ts](#7-libdbrepositoriesrepositoryrepositoryts)
8. [lib/db/services/repository.service.ts](#8-libdbservicesrepositoryservicets)
9. [lib/db/repositories/issue.repository.ts](#9-libdbrepositoriesissuerepositoryts)
10. [lib/db/services/issue.service.ts](#10-libdbservicesissueservicets)
11. [lib/db/repositories/activity.repository.ts](#11-libdbrepositoriesactivityrepositoryts)
12. [app-actions/repositories.ts — Server Actions](#12-app-actionsrepositoriests--server-actions)
13. [app-actions/issues.ts — Server Actions](#13-app-actionsissuests--server-actions)
14. [app/layout.tsx — Root Layout](#14-applayouttsx--root-layout)
15. [app/(auth)/login/page.tsx — Login Page](#15-appauthlginpagetsx--login-page)
16. [app/(protected)/layout.tsx — Protected Layout](#16-appprotectedlayouttsx--protected-layout)
17. [app/(protected)/dashboard/page.tsx — Dashboard](#17-appprotecteddashboardpagetsx--dashboard)
18. [app/(protected)/repositories/[owner]/[repo]/page.tsx — Repo Detail](#18-appprotectedrepositoriesownerrepopagetsx--repo-detail)
19. [components/ui/RepoCard.tsx — Server Component](#19-componentsuirepocardtsx--server-component)
20. [components/ui/StarButton.tsx — Client Component](#20-componentsuistarbuttontsx--client-component)
21. [components/ui/BrutalistButton.tsx — Retained](#21-componentsuibrutalistbuttontsx--retained)
22. [components/ui/TerminalWindow.tsx — Retained](#22-componentsuiterminaltsx--retained)

---

## 1. `prisma/schema.prisma`

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─────────────────────────────────────────────
// AUTH MODELS (Auth.js v5 Prisma Adapter)
// ─────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String?
  username      String?   @unique
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  bio           String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]

  repositories  Repository[]  @relation("RepositoryOwner")
  stars         Star[]
  issues        Issue[]       @relation("IssueAuthor")
  assignedIssues Issue[]      @relation("IssueAssignee")
  comments      Comment[]
  activities    Activity[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ─────────────────────────────────────────────
// DOMAIN MODELS
// ─────────────────────────────────────────────

model Repository {
  id          String            @id @default(cuid())
  name        String
  slug        String
  description String?
  isPrivate   Boolean           @default(false)
  language    String?
  ownerId     String
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  owner       User              @relation("RepositoryOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  stars       Star[]
  issues      Issue[]
  comments    Comment[]         @relation("RepositoryComments")
  activities  Activity[]

  @@unique([ownerId, slug])
  @@index([slug])
  @@map("repositories")
}

enum IssueStatus {
  OPEN
  CLOSED
}

enum IssuePriority {
  LOW
  MEDIUM
  HIGH
}

model Issue {
  id           String        @id @default(cuid())
  number       Int
  title        String
  body         String?       @db.Text
  status       IssueStatus   @default(OPEN)
  priority     IssuePriority @default(MEDIUM)
  repositoryId String
  authorId     String
  assigneeId   String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  repository   Repository    @relation(fields: [repositoryId], references: [id], onDelete: Cascade)
  author       User          @relation("IssueAuthor", fields: [authorId], references: [id], onDelete: Cascade)
  assignee     User?         @relation("IssueAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  comments     Comment[]     @relation("IssueComments")

  @@unique([repositoryId, number])
  @@index([repositoryId])
  @@map("issues")
}

enum CommentTarget {
  ISSUE
  REPOSITORY
}

model Comment {
  id           String        @id @default(cuid())
  body         String        @db.Text
  authorId     String
  targetType   CommentTarget
  issueId      String?
  repositoryId String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  author       User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
  issue        Issue?        @relation("IssueComments", fields: [issueId], references: [id], onDelete: Cascade)
  repository   Repository?   @relation("RepositoryComments", fields: [repositoryId], references: [id], onDelete: Cascade)

  @@index([issueId])
  @@index([repositoryId])
  @@map("comments")
}

model Star {
  id           String     @id @default(cuid())
  userId       String
  repositoryId String
  createdAt    DateTime   @default(now())

  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  repository   Repository @relation(fields: [repositoryId], references: [id], onDelete: Cascade)

  @@unique([userId, repositoryId])
  @@map("stars")
}

enum ActivityEventType {
  CREATED_REPO
  DELETED_REPO
  OPENED_ISSUE
  CLOSED_ISSUE
  STARRED_REPO
  UNSTARRED_REPO
  COMMENTED
}

model Activity {
  id           String            @id @default(cuid())
  eventType    ActivityEventType
  userId       String
  repositoryId String?
  metadata     Json?
  createdAt    DateTime          @default(now())

  user         User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  repository   Repository?       @relation(fields: [repositoryId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([repositoryId])
  @@index([createdAt])
  @@map("activities")
}
```

---

## 2. `lib/db.ts` — Prisma Singleton

```typescript
// lib/db.ts

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

---

## 3. `lib/validators/schemas.ts` — Zod Schemas

```typescript
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
```

---

## 4. `lib/auth/config.ts` — NextAuth Config

```typescript
// lib/auth/config.ts

import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

function generateUsername(name: string | null | undefined, email: string | null | undefined): string {
  const base =
    name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
    email?.split("@")[0] ||
    "user";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        return true;
      }
      return false;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.username && session.user) {
        session.user.username = token.username as string;
      }
      return session;
    },

    async jwt({ token, user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as {
          login?: string;
          name?: string;
          email?: string;
        };
        token.username =
          githubProfile.login ??
          generateUsername(githubProfile.name, githubProfile.email);
      }
      return token;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/repositories") ||
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/settings");

      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET!,
  trustHost: true,
};
```

---

## 5. `lib/auth.ts` — Auth Exports

```typescript
// lib/auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth/config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
});

// ─── Type augmentation for next-auth session ─────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
```

---

## 6. `middleware.ts` — Route Protection

```typescript
// middleware.ts

export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets
     * - API routes for auth itself
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## 7. `lib/db/repositories/repository.repository.ts`

```typescript
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
```

---

## 8. `lib/db/services/repository.service.ts`

```typescript
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
```

---

## 9. `lib/db/repositories/issue.repository.ts`

```typescript
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
```

---

## 10. `lib/db/services/issue.service.ts`

```typescript
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
```

---

## 11. `lib/db/repositories/activity.repository.ts`

```typescript
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
```

---

## 12. `app-actions/repositories.ts` — Server Actions

```typescript
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
```

---

## 13. `app-actions/issues.ts` — Server Actions

```typescript
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
```

---

## 14. `app/layout.tsx` — Root Layout

```tsx
// app/layout.tsx

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "GitNode",
    template: "%s | GitNode",
  },
  description:
    "GitNode — The open-source, brutalist alternative to GitHub. Raw. Fast. Yours.",
  keywords: ["git", "repository", "open source", "code hosting"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="bg-white font-mono antialiased">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

---

## 15. `app/(auth)/login/page.tsx` — Login Page

```tsx
// app/(auth)/login/page.tsx

import { auth } from "@/lib/auth";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { BrutalistButton } from "@/components/ui/BrutalistButton";

export const metadata = { title: "Login" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="border-3 border-black bg-black text-[#FFFF00] p-6 mb-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-black tracking-tighter">
              ⬡ GITNODE
            </span>
          </div>
          <p className="text-xs text-[#FFFF00]/70 font-mono">
            v1.0.0 :: OPEN SOURCE FORGE
          </p>
        </div>

        {/* Terminal Panel */}
        <div className="border-3 border-t-0 border-black p-6">
          <TerminalWindow title="auth.sh">
            <p className="text-green-400 text-sm">
              $ gitnode --authenticate
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Initiating OAuth handshake with GitHub...
            </p>
            <p className="text-gray-400 text-sm">
              Awaiting credentials. Stand by.
            </p>
            <p className="text-[#FFFF00] text-sm mt-2">
              ▶ Press the button below to authenticate.
            </p>
          </TerminalWindow>

          <div className="mt-6">
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/dashboard" });
              }}
            >
              <BrutalistButton type="submit" className="w-full">
                <svg
                  viewBox="0 0 24 24"
                  className="inline w-5 h-5 mr-2"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                SIGN IN WITH GITHUB
              </BrutalistButton>
            </form>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center font-mono">
            By signing in, you agree to GitNode's Terms of Use.
          </p>
        </div>

        {/* Footer tag */}
        <div className="border-3 border-t-0 border-black bg-gray-50 px-6 py-3">
          <p className="text-xs font-mono text-gray-400">
            [ OPEN SOURCE ] [ MIT LICENSE ] [ NO TRACKING ]
          </p>
        </div>
      </div>
    </main>
  );
}
```

---

## 16. `app/(protected)/layout.tsx` — Protected Layout

```tsx
// app/(protected)/layout.tsx

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={session.user} />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

---

## 17. `app/(protected)/dashboard/page.tsx` — Dashboard

```tsx
// app/(protected)/dashboard/page.tsx

import { auth } from "@/lib/auth";
import { findRepositoriesByOwner } from "@/lib/db/repositories/repository.repository";
import { findTrendingRepositories } from "@/lib/db/repositories/repository.repository";
import { findGlobalActivities } from "@/lib/db/repositories/activity.repository";
import { RepoCard } from "@/components/ui/RepoCard";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [myRepos, trending, feed] = await Promise.all([
    findRepositoriesByOwner(session.user.id),
    findTrendingRepositories(5),
    findGlobalActivities(15),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-3 border-black">
      {/* ─── Left: My Repos ──────────────────────────────────── */}
      <div className="lg:col-span-2 border-b-3 lg:border-b-0 lg:border-r-3 border-black">
        <div className="flex items-center justify-between p-4 border-b-3 border-black bg-black text-[#FFFF00]">
          <span className="font-black text-sm tracking-widest uppercase">
            ▸ My Repositories
          </span>
          <Link
            href="/repositories/new"
            className="text-xs border-2 border-[#FFFF00] px-3 py-1 hover:bg-[#FFFF00] hover:text-black transition-colors font-bold"
          >
            + NEW
          </Link>
        </div>

        <div>
          {myRepos.length === 0 ? (
            <div className="p-8 text-center">
              <TerminalWindow title="empty.log">
                <p className="text-gray-400 text-sm">
                  $ ls ./repositories
                </p>
                <p className="text-gray-500 text-sm">
                  No repositories found. Create one.
                </p>
              </TerminalWindow>
            </div>
          ) : (
            myRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))
          )}
        </div>
      </div>

      {/* ─── Right: Trending + Activity ──────────────────────── */}
      <div className="flex flex-col">
        {/* Trending */}
        <div className="border-b-3 border-black">
          <div className="p-4 border-b-3 border-black bg-[#FFFF00]">
            <span className="font-black text-sm tracking-widest uppercase text-black">
              ▸ Trending
            </span>
          </div>
          <ul className="divide-y-3 divide-black">
            {trending.map((repo, i) => (
              <li key={repo.id}>
                <Link
                  href={`/repositories/${repo.owner.username}/${repo.slug}`}
                  className="flex items-center gap-3 p-4 hover:bg-[#FFFF00] transition-colors group"
                >
                  <span className="text-2xl font-black text-gray-200 group-hover:text-black transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">
                      {repo.owner.username}/{repo.name}
                    </p>
                    <p className="text-xs text-gray-500 flex gap-3 mt-0.5">
                      <span>★ {repo._count.stars}</span>
                      {repo.language && <span>◆ {repo.language}</span>}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity Feed */}
        <div className="flex-1">
          <div className="p-4 border-b-3 border-black bg-white">
            <span className="font-black text-sm tracking-widest uppercase">
              ▸ Live Feed
            </span>
          </div>
          <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {feed.map((activity) => (
              <li
                key={activity.id}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-xs font-mono text-gray-700">
                  <span className="font-bold">
                    @{activity.user.username}
                  </span>{" "}
                  <span className="text-gray-400">{activity.eventType.toLowerCase().replace(/_/g, " ")}</span>
                  {activity.repository && (
                    <>
                      {" "}
                      <span className="text-[#0000FF] font-bold">
                        {activity.repository.name}
                      </span>
                    </>
                  )}
                </p>
                <p className="text-[10px] text-gray-300 mt-0.5">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

## 18. `app/(protected)/repositories/[owner]/[repo]/page.tsx` — Repo Detail

```tsx
// app/(protected)/repositories/[owner]/[repo]/page.tsx

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { findRepositoryByOwnerAndSlug } from "@/lib/db/repositories/repository.repository";
import { findIssuesByRepository } from "@/lib/db/repositories/issue.repository";
import { findStar } from "@/lib/db/repositories/repository.repository";
import { StarButton } from "@/components/ui/StarButton";
import { TerminalWindow } from "@/components/ui/TerminalWindow";

interface PageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { owner, repo } = await params;
  return { title: `${owner}/${repo}` };
}

export default async function RepoDetailPage({ params }: PageProps) {
  const { owner, repo: repoSlug } = await params;
  const session = await auth();
  if (!session?.user) return null;

  const [repository, issues] = await Promise.all([
    findRepositoryByOwnerAndSlug(owner, repoSlug),
    (async () => {
      const r = await findRepositoryByOwnerAndSlug(owner, repoSlug);
      return r ? findIssuesByRepository(r.id) : [];
    })(),
  ]);

  if (!repository) notFound();

  const isOwner = session.user.id === repository.ownerId;
  const starRecord = await findStar(session.user.id, repository.id);
  const isStarred = starRecord !== null;
  const openIssues = issues.filter((i) => i.status === "OPEN");

  return (
    <div className="border-3 border-black">
      {/* ─── Header Bar ─────────────────────────────────────── */}
      <div className="border-b-3 border-black bg-black text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <span>@{owner}</span>
            <span>/</span>
          </div>
          <h1 className="text-2xl font-black text-[#FFFF00] tracking-tight">
            {repository.name}
          </h1>
          {repository.description && (
            <p className="text-gray-300 text-sm mt-1 font-mono">
              {repository.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Star Badge */}
          <div className="border-2 border-gray-600 px-3 py-1 text-sm font-mono">
            ★ {repository._count.stars}
          </div>

          {/* Star Toggle */}
          <StarButton
            repositoryId={repository.id}
            ownerUsername={owner}
            repoSlug={repoSlug}
            initialStarred={isStarred}
            initialCount={repository._count.stars}
          />

          {/* Issues count */}
          <div className="border-2 border-gray-600 px-3 py-1 text-sm font-mono">
            ⚑ {openIssues.length} open
          </div>
        </div>
      </div>

      {/* ─── Meta Strip ─────────────────────────────────────── */}
      <div className="border-b-3 border-black flex divide-x-3 divide-black text-xs font-mono">
        <div className="px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400">VISIBILITY</span>
          <span className={`font-bold px-2 py-0.5 ${repository.isPrivate ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {repository.isPrivate ? "PRIVATE" : "PUBLIC"}
          </span>
        </div>
        {repository.language && (
          <div className="px-4 py-2 flex items-center gap-2">
            <span className="text-gray-400">LANG</span>
            <span className="font-bold">{repository.language}</span>
          </div>
        )}
        <div className="px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400">ISSUES</span>
          <span className="font-bold">{repository._count.issues}</span>
        </div>
        <div className="px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400">CREATED</span>
          <span className="font-bold">
            {new Date(repository.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* ─── Main: Terminal + Issues ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y-3 lg:divide-y-0 lg:divide-x-3 divide-black">
        {/* Code Terminal */}
        <div className="lg:col-span-2 p-6">
          <TerminalWindow title={`${owner}/${repoSlug}`}>
            <p className="text-green-400">$ git clone gitnode.io/{owner}/{repoSlug}.git</p>
            <p className="text-gray-400 mt-1">Cloning into '{repoSlug}'...</p>
            <p className="text-gray-400">remote: Enumerating objects...</p>
            <p className="text-gray-400">Receiving objects: 100% done.</p>
            <p className="text-[#FFFF00] mt-2">✓ Repository ready.</p>
          </TerminalWindow>

          {isOwner && (
            <div className="mt-6 flex gap-3">
              <a
                href={`/repositories/${owner}/${repoSlug}/settings`}
                className="border-3 border-black px-4 py-2 text-sm font-bold hover:bg-black hover:text-[#FFFF00] transition-colors"
              >
                ⚙ SETTINGS
              </a>
              <a
                href={`/repositories/${owner}/${repoSlug}/issues/new`}
                className="border-3 border-black bg-[#FFFF00] px-4 py-2 text-sm font-bold hover:translate-x-[2px] hover:-translate-y-[2px] transition-transform"
              >
                + NEW ISSUE
              </a>
            </div>
          )}
        </div>

        {/* Issues Panel */}
        <div className="p-0">
          <div className="border-b-3 border-black bg-[#FFFF00] p-4">
            <span className="font-black text-sm tracking-widest uppercase">
              ▸ Open Issues ({openIssues.length})
            </span>
          </div>
          {openIssues.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400 font-mono">
                No open issues. Ship it.
              </p>
            </div>
          ) : (
            <ul className="divide-y-3 divide-black">
              {openIssues.slice(0, 8).map((issue) => (
                <li key={issue.id}>
                  <a
                    href={`/repositories/${owner}/${repoSlug}/issues`}
                    className="block p-4 hover:bg-[#FFFF00] transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-400 font-mono mt-0.5 flex-shrink-0">
                        #{issue.number}
                      </span>
                      <p className="text-sm font-bold truncate group-hover:text-black">
                        {issue.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 ml-7">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                          issue.priority === "HIGH"
                            ? "border-red-600 text-red-700 bg-red-50"
                            : issue.priority === "MEDIUM"
                            ? "border-yellow-600 text-yellow-700 bg-yellow-50"
                            : "border-gray-400 text-gray-600 bg-gray-50"
                        }`}
                      >
                        {issue.priority}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        @{issue.author.username}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 19. `components/ui/RepoCard.tsx` — Server Component

```tsx
// components/ui/RepoCard.tsx

import Link from "next/link";
import type { RepositoryWithMeta } from "@/lib/db/repositories/repository.repository";

interface RepoCardProps {
  repo: RepositoryWithMeta;
  showOwner?: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  Ruby: "#701516",
  Java: "#b07219",
};

export function RepoCard({ repo, showOwner = false }: RepoCardProps) {
  const langColor = repo.language
    ? (LANGUAGE_COLORS[repo.language] ?? "#6b7280")
    : null;

  return (
    <Link
      href={`/repositories/${repo.owner.username}/${repo.slug}`}
      className="block border-b-3 border-black p-5 hover:bg-[#FFFF00] transition-colors group"
    >
      {/* ─── Title Row ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-black truncate group-hover:text-black">
            {showOwner && (
              <span className="text-gray-500 font-normal">
                {repo.owner.username}/
              </span>
            )}
            {repo.name}
          </p>
          {repo.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 font-mono">
              {repo.description}
            </p>
          )}
        </div>
        <span
          className={`flex-shrink-0 text-[10px] font-bold border px-2 py-0.5 ${
            repo.isPrivate
              ? "border-red-400 text-red-600"
              : "border-gray-300 text-gray-500"
          }`}
        >
          {repo.isPrivate ? "PRIVATE" : "PUBLIC"}
        </span>
      </div>

      {/* ─── Stats Row ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mt-3 text-xs font-mono text-gray-500">
        {langColor && repo.language && (
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full border border-black/10"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
        <span>★ {repo._count.stars}</span>
        <span>⚑ {repo._count.issues}</span>
        <span className="ml-auto text-gray-300 text-[10px]">
          {new Date(repo.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
```

---

## 20. `components/ui/StarButton.tsx` — Client Component

```tsx
// components/ui/StarButton.tsx

"use client";

import { useState, useTransition } from "react";
import { toggleStarAction } from "@/app-actions/repositories";

interface StarButtonProps {
  repositoryId: string;
  ownerUsername: string;
  repoSlug: string;
  initialStarred: boolean;
  initialCount: number;
}

export function StarButton({
  repositoryId,
  ownerUsername,
  repoSlug,
  initialStarred,
  initialCount,
}: StarButtonProps) {
  const [starred, setStarred] = useState(initialStarred);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // Optimistic update
    const nextStarred = !starred;
    setStarred(nextStarred);
    setCount((c) => (nextStarred ? c + 1 : c - 1));

    startTransition(async () => {
      const result = await toggleStarAction(
        repositoryId,
        ownerUsername,
        repoSlug
      );

      if (result.error) {
        // Rollback on error
        setStarred(starred);
        setCount(count);
        console.error(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={starred ? "Unstar repository" : "Star repository"}
      className={`
        border-3 border-black px-4 py-2 text-sm font-black
        transition-all duration-100 font-mono
        hover:translate-x-[2px] hover:-translate-y-[2px]
        active:translate-x-0 active:translate-y-0
        disabled:opacity-60 disabled:cursor-not-allowed
        ${
          starred
            ? "bg-[#FFFF00] text-black shadow-[4px_4px_0px_black]"
            : "bg-white text-black shadow-[4px_4px_0px_black] hover:bg-[#FFFF00]"
        }
      `}
    >
      {starred ? "★ STARRED" : "☆ STAR"}
    </button>
  );
}
```

---

## 21. `components/ui/BrutalistButton.tsx` — Retained & Enhanced

```tsx
// components/ui/BrutalistButton.tsx

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BrutalistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const VARIANT_STYLES = {
  primary:
    "bg-[#FFFF00] text-black border-black hover:bg-black hover:text-[#FFFF00]",
  danger: "bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white",
  ghost: "bg-white text-black border-black hover:bg-[#FFFF00]",
};

const SIZE_STYLES = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};

export function BrutalistButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: BrutalistButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        border-3 font-black tracking-wider uppercase font-mono
        shadow-[4px_4px_0px_black]
        hover:shadow-[6px_6px_0px_black]
        hover:translate-x-[-2px] hover:translate-y-[-2px]
        active:shadow-[2px_2px_0px_black]
        active:translate-x-[2px] active:translate-y-[2px]
        transition-all duration-75
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:translate-x-0 disabled:hover:translate-y-0
        disabled:hover:shadow-[4px_4px_0px_black]
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
```

---

## 22. `components/ui/TerminalWindow.tsx` — Retained & Typed

```tsx
// components/ui/TerminalWindow.tsx

import type { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({
  title = "terminal",
  children,
  className = "",
}: TerminalWindowProps) {
  return (
    <div
      className={`border-3 border-black font-mono text-sm ${className}`}
    >
      {/* ─── Title Bar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-black px-4 py-2 border-b-3 border-black">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-red-700" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
          <span className="w-3 h-3 rounded-full bg-green-500 border border-green-700" />
        </div>
        <span className="text-gray-400 text-xs ml-2 truncate">{title}</span>
      </div>

      {/* ─── Content Area ──────────────────────────────────────── */}
      <div className="bg-gray-950 text-gray-100 p-4 overflow-x-auto leading-relaxed min-h-[80px]">
        {children}
      </div>
    </div>
  );
}
```

---

## Environment Variables Reference

```env
# .env.local

# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Auth.js v5
AUTH_SECRET="[generate with: openssl rand -base64 32]"
GITHUB_CLIENT_ID="[from GitHub OAuth App]"
GITHUB_CLIENT_SECRET="[from GitHub OAuth App]"

# App
NEXTAUTH_URL="http://localhost:3000"
```

## Prisma Migration Commands

```bash
# Push schema to Supabase (dev)
npx prisma db push

# Generate client after schema changes
npx prisma generate

# Create named migration (production)
npx prisma migrate dev --name init

# Open Prisma Studio (local inspection)
npx prisma studio
```

## Dependency Installation

```bash
npm install next@latest react@latest react-dom@latest
npm install next-auth@beta @auth/prisma-adapter
npm install @prisma/client prisma
npm install zod
npm install -D typescript @types/node @types/react @types/react-dom
```

---

*GitNode Migration Complete — All files production-grade, type-safe, and brutalist-spec compliant.*
