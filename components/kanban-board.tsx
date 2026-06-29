'use client';

import React, { useEffect, useState } from 'react';
import { Column } from '@/types/kanban';
import { PlusCircle } from 'lucide-react';
import { KanbanColumn } from './kanban-column';

// Imports do dnd-kit
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
  sortableKeyboardCoordinates, 
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

  // Configuração de sensores para detectar o arrasto (mouse, touch e teclado)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Só ativa o drag se arrastar mais de 8 pixels, evitando cliques acidentais
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddStage = () => {
    if (columns.length >= 4) return;

    const stageName = prompt('Digite o nome do novo estágio:');
    if (!stageName?.trim()) return;

    const newColumn: Column = {
      id: crypto.randomUUID(),
      title: stageName,
      color: PRESET_COLORS[columns.length] || PRESET_COLORS[0],
      tasks: [],
    };

    setColumns([...columns, newColumn]);
  };

  // Função disparada assim que o usuário solta a coluna
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Função utilitária do dnd-kit que reorganiza a array mantendo a imutabilidade do React
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* O SortableContext precisa mapear apenas os IDs das colunas */}
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
            onClick={handleAddStage}
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
  );
}