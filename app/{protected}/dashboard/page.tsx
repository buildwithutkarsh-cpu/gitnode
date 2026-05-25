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