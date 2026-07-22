'use client';

import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column, Task } from '@/types/kanban';
import { PlusCircle, GripVertical } from 'lucide-react';
import { KanbanTaskCard } from './kanban-task-card';

interface KanbanColumnProps {
  column: Column;
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({ column, onAddTask, onTaskClick }: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
      {/* Topo da coluna */}
      <div className="flex items-center justify-between mb-4">
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
        onClick={() => onAddTask(column.id)}
        className={`w-full py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 font-semibold text-xs tracking-wider uppercase transition-all duration-200 active:scale-[0.98] cursor-pointer ${column.color}`}
      >
        <PlusCircle className="w-4 h-4" />
        Adicionar Tarefa
      </button>

      {/* Lista de Tarefas Arrastáveis */}
      <div className="flex-1 mt-4 space-y-3">
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <KanbanTaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}