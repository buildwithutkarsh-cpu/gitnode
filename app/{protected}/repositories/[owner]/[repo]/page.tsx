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