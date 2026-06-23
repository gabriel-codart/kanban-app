'use client';

import React, { useState } from 'react';
import { Column, ColumnId, Task } from '@/types/kanban';
import { PlusCircle } from 'lucide-react'; // Ícones do preset Nova

const INITIAL_COLUMNS: Column[] = [
  { id: 'todo', title: 'A Fazer', color: 'border-amber-500 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20', tasks: [] },
  { id: 'doing', title: 'Fazendo', color: 'border-sky-500 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20', tasks: [] },
  { id: 'done', title: 'Feito', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20', tasks: [] },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => (
        <div 
          key={column.id} 
          className="flex flex-col border-2 border-dashed border-zinc-800/80 rounded-xl p-5 min-h-[500px] bg-zinc-900/20 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/50"
        >
          {/* Título da Coluna */}
          <h2 className="text-xl font-bold text-center text-zinc-200 mb-4 tracking-tight">
            {column.title}
          </h2>
          
          <hr className="border-zinc-800/80 mb-5" />

          {/* Botão de Adicionar customizado por coluna conforme seu desenho */}
          <button 
            className={`w-full py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 font-semibold text-xs tracking-wider uppercase transition-all duration-200 active:scale-[0.98] ${column.color}`}
          >
            <PlusCircle className="w-4 h-4" />
            Adicionar Tarefa
          </button>

          {/* Espaço para as Tasks futuramente */}
          <div className="flex-1 mt-4 space-y-3">
            {/* As tarefas renderizadas vão aqui */}
          </div>
        </div>
      ))}
    </div>
  );
}