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