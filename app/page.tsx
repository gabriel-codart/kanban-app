import { KanbanBoard } from "@/components/kanban-board";
import { KanbanHeader } from "@/components/kanban-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800">
      <KanbanHeader />
      <main className="max-w-7xl mx-auto p-8 pt-12">
        <KanbanBoard />
      </main>
    </div>
  );
}
