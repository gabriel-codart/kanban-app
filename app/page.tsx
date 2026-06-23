import { AuroraBackground } from "@/components/aurora-background";
import { KanbanBoard } from "@/components/kanban-board";
import { KanbanHeader } from "@/components/kanban-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-zinc-800 relative overflow-x-hidden">
      <AuroraBackground />
      <KanbanHeader />
      <main className="max-w-7xl mx-auto p-8 pt-12">
        <KanbanBoard />
      </main>
    </div>
  );
}
