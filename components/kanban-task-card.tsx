'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/kanban';
import { GripVertical } from 'lucide-react';

interface KanbanTaskCardProps {
  task: Task;
}

export function KanbanTaskCard({ task }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Efeito "Ghost" ao arrastar
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 rounded-lg border-2 border-dashed border-primary/40 bg-muted/5 opacity-40 min-h-[80px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative p-4 rounded-xl border border-border bg-background/50 backdrop-blur-md shadow-sm transition-all hover:border-muted-foreground/30 hover:shadow-md flex flex-col gap-1.5"
    >
      {/* Cabeçalho da Task com Ícone de Arrastar */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm text-foreground leading-snug tracking-tight">
          {task.title}
        </h3>
        
        {/* Grip para arrastar a tarefa */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground/30 hover:text-foreground rounded transition-colors opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Descrição Opcional */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
    </div>
  );
}