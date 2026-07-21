'use client';

import React, { useState } from 'react';
import { Column } from '@/types/kanban';
import { PlusCircle } from 'lucide-react';
import { KanbanColumn } from './kanban-column';
import { ActionModal } from './ui/action-modal'; // Importe o modal

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  horizontalListSortingStrategy 
} from '@dnd-kit/sortable';

const PRESET_COLORS = [
  'border-amber-500 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
  'border-sky-500 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20',
  'border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
  'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500 hover:bg-fuchsia-500/20',
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  
  // Estado para controlar o modal de novo estágio
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Submissão do formulário do Modal de Estágio
  const handleCreateStage = (data: Record<string, string>) => {
    if (columns.length >= 4 || !data.title?.trim()) return;

    const newColumn: Column = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      color: PRESET_COLORS[columns.length] || PRESET_COLORS[0],
      tasks: [],
    };

    setColumns([...columns, newColumn]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          <SortableContext 
            items={columns.map(col => col.id)} 
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </SortableContext>

          {/* Card de Adicionar Estágio */}
          {columns.length < 4 && (
            <button 
              onClick={() => setIsStageModalOpen(true)} // Abre o Modal
              className="w-full flex flex-col justify-center items-center border-2 border-dashed border-border rounded-xl p-5 min-h-[500px] bg-muted/5 backdrop-blur-md transition-all duration-300 hover:border-muted-foreground/40 hover:bg-muted/10 group cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <div className="flex flex-col items-center gap-3 transition-transform duration-200 group-hover:scale-105">
                <PlusCircle className="w-8 h-8 stroke-[1.5]" />
                <span className="text-base font-bold tracking-tight">
                  Adicionar Estágio
                </span>
              </div>
            </button>
          )}
        </div>
      </DndContext>

      {/* Modal Reutilizável configurado para Novo Estágio */}
      <ActionModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        onSubmit={handleCreateStage}
        title="Novo Estágio"
        description="Crie uma nova coluna para organizar o fluxo de trabalho."
        submitText="Criar Estágio"
        fields={[
          {
            name: 'title',
            label: 'Nome do Estágio',
            placeholder: 'Ex: Em Revisão, Backlog...',
            required: true,
          },
        ]}
      />
    </>
  );
}