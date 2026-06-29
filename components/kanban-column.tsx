'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanColumnProps } from '@/types/kanban';
import { PlusCircle, GripVertical } from 'lucide-react';


export function KanbanColumn({ column }: KanbanColumnProps) {
  // O hook useSortable dará os listeners e estilos necessários para mover o elemento
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  // Se estiver arrastando, deixamos o card original semi-transparente (efeito ghost)
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col border-2 border-dashed border-primary/30 rounded-xl p-5 min-h-[500px] bg-muted/5 opacity-40 backdrop-blur-md"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col border-2 border-dashed border-border rounded-xl p-5 min-h-[500px] bg-muted/10 backdrop-blur-md transition-none hover:border-muted-foreground/30 relative group/column"
    >
      {/* Topo da coluna com o título e a área de arrastar */}
      <div className="flex items-center justify-between mb-4">
        {/* Ícone de arrastar sutil que aparece no hover */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground/40 hover:text-foreground rounded transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <h2 className="text-xl font-bold text-center text-foreground tracking-tight flex-1 pr-4">
          {column.title}
        </h2>
      </div>
      
      <hr className="border-border mb-5" />

      {/* Botão de Adicionar Tarefa */}
      <button 
        className={`w-full py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 font-semibold text-xs tracking-wider uppercase transition-all duration-200 active:scale-[0.98] cursor-pointer ${column.color}`}
      >
        <PlusCircle className="w-4 h-4" />
        Adicionar Tarefa
      </button>

      {/* Espaço para as Tasks */}
      <div className="flex-1 mt-4 space-y-3">
        {/* As tarefas renderizadas vão aqui */}
      </div>
    </div>
  );
}