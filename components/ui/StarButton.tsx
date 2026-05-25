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