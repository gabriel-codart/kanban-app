'use client';

import React from 'react';
import { Task } from '@/types/kanban';
import { X, Calendar, Pencil, Trash2 } from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) {
  if (!isOpen || !task) return null;

  // Formatação simples e bonita da data de criação
  const formattedDate = new Date(task.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col gap-5">
        
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 pr-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground leading-snug">
            {task.title}
          </h2>
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Data de Criação */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>Criado em {formattedDate}</span>
        </div>

        <hr className="border-border/60" />

        {/* Corpo da Descrição */}
        <div className="space-y-2 min-h-[100px] max-h-[300px] overflow-y-auto pr-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Descrição
          </h4>
          {task.description ? (
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {task.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/60 italic">
              Nenhuma descrição informada para esta tarefa.
            </p>
          )}
        </div>

        <hr className="border-border/60" />

        {/* Ações (Editar / Excluir) */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              if (onDelete) onDelete(task.id);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onEdit) onEdit(task);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}