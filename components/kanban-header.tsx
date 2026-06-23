'use client';

import { Info } from "lucide-react";

export function KanbanHeader() {
  return(
    <header className="w-full h-14 bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-center gap-2 relative z-10">
      <span className="font-semibold tracking-wider text-sm uppercase text-zinc-400">
        KANBAN<span className="text-zinc-200 font-bold">app</span>
      </span>
      <Info className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors" />
  </header>
  )
}