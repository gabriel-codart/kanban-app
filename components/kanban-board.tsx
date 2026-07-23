'use client';

import React, { useState } from 'react';
import { Column, Task } from '@/types/kanban';
import { PlusCircle } from 'lucide-react';
import { KanbanColumn } from './kanban-column';
import { ActionModal, STAGE_COLOR_OPTIONS } from './ui/action-modal';
import { TaskDetailsModal } from './task-details-modal';

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent,
  DragOverEvent
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
  
  // Modais
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [targetColumnIdForTask, setTargetColumnIdForTask] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Criar Novo Estágio
  const handleCreateStage = (data: Record<string, string>) => {
    if (columns.length >= 4 || !data.title?.trim()) return;

    const newColumn: Column = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      color: data.color || STAGE_COLOR_OPTIONS[0].class,
      tasks: [],
    };

    setColumns([...columns, newColumn]);
  };

  // Variáveis de estados para Editar e Deletar Estágios
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [deletingColumnId, setDeletingColumnId] = useState<string | null>(null);

  // Submissão da Edição de Coluna
  const handleEditColumnSubmit = (data: Record<string, string>) => {
    if (!editingColumn || !data.title?.trim()) return;

    setColumns((prev) =>
      prev.map((col) =>
        col.id === editingColumn.id
          ? {
              ...col,
              title: data.title.trim(),
              color: data.color || col.color,
            }
          : col
      )
    );

    setEditingColumn(null);
  };

  // Confirmação de Exclusão da Coluna
  const handleConfirmDeleteColumn = () => {
    if (!deletingColumnId) return;

    setColumns((prev) => prev.filter((col) => col.id !== deletingColumnId));
    setDeletingColumnId(null);
  };

  // Criar Nova Tarefa
  const handleCreateTask = (data: Record<string, string>) => {
    if (!targetColumnIdForTask || !data.title?.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      createdAt: new Date(),
    };

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === targetColumnIdForTask) {
          return { ...col, tasks: [...col.tasks, newTask] };
        }
        return col;
      })
    );

    setTargetColumnIdForTask(null);
  };

  // Variáveis de estados para Editar e Deletar Tarefas
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Função para deletar tarefa
  const handleDeleteTask = (taskId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }))
    );
  };

  // Função para salvar a edição da tarefa
  const handleEditTaskSubmit = (data: Record<string, string>) => {
    if (!editingTask || !data.title?.trim()) return;

    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === editingTask.id
            ? { ...t, title: data.title.trim(), description: data.description?.trim() }
            : t
        ),
      }))
    );

    setEditingTask(null);
  };

  // Lógica do Drag and Drop (Colunas e Tarefas)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Encontra em qual coluna está o item arrastado e o item de destino
    const activeColumn = columns.find((col) => col.tasks.some((t) => t.id === activeId));
    const overColumn = columns.find((col) => col.id === overId || col.tasks.some((t) => t.id === overId));

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    // Move a tarefa de uma coluna para a outra durante o arrasto
    setColumns((prev) => {
      const activeTask = activeColumn.tasks.find((t) => t.id === activeId);
      if (!activeTask) return prev;

      return prev.map((col) => {
        if (col.id === activeColumn.id) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== activeId) };
        }
        if (col.id === overColumn.id) {
          return { ...col, tasks: [...col.tasks, activeTask] };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Se estiver reordenando colunas
    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    if (activeColumnIndex !== -1 && overColumnIndex !== -1 && activeColumnIndex !== overColumnIndex) {
      setColumns((items) => arrayMove(items, activeColumnIndex, overColumnIndex));
      return;
    }

    // Se estiver reordenando tarefas dentro da mesma coluna
    const column = columns.find((col) => col.tasks.some((t) => t.id === activeId));
    if (column) {
      const oldIndex = column.tasks.findIndex((t) => t.id === activeId);
      const newIndex = column.tasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id === column.id) {
              return { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) };
            }
            return col;
          })
        );
      }
    }
  };

  return (
    <>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          <SortableContext 
            items={columns.map(col => col.id)} 
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <KanbanColumn 
                key={column.id} 
                column={column} 
                onAddTask={(colId) => setTargetColumnIdForTask(colId)}
                onTaskClick={(task) => setSelectedTask(task)}
                onEditColumn={(col) => setEditingColumn(col)}
                onDeleteColumn={(colId) => setDeletingColumnId(colId)}
              />
            ))}
          </SortableContext>

          {/* Card de Adicionar Estágio */}
          {columns.length < 4 && (
            <button 
              onClick={() => setIsStageModalOpen(true)}
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

      {/* Modal para Criar Novo Estágio */}
      <ActionModal
        key={String(isStageModalOpen)}
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        onSubmit={handleCreateStage}
        title="Novo Estágio"
        description="Crie uma nova coluna e escolha a cor de destaque do botão."
        submitText="Criar Estágio"
        initialValues={{
          color: STAGE_COLOR_OPTIONS[0].class, // Laranja como padrão
        }}
        fields={[
          {
            name: 'title',
            label: 'Nome do Estágio',
            placeholder: 'Ex: Em Revisão, Backlog...',
            required: true,
          },
          {
            name: 'color',
            label: 'Cor de Destaque',
            type: 'color',
          },
        ]}
      />

      {/* Modal de Editar Estágio */}
      <ActionModal
        key={editingColumn?.id || 'edit-col-none'}
        isOpen={Boolean(editingColumn)}
        onClose={() => setEditingColumn(null)}
        onSubmit={handleEditColumnSubmit}
        title="Editar Estágio"
        description="Altere o nome e a cor desta coluna."
        submitText="Salvar Alterações"
        initialValues={{
          title: editingColumn?.title || '',
          color: editingColumn?.color || STAGE_COLOR_OPTIONS[0].class,
        }}
        fields={[
          {
            name: 'title',
            label: 'Nome do Estágio',
            placeholder: 'Ex: Em Revisão...',
            required: true,
          },
          {
            name: 'color',
            label: 'Cor de Destaque',
            type: 'color',
          },
        ]}
      />

      {/* Modal de Confirmação para Excluir Estágio */}
      <ActionModal
        key={deletingColumnId || 'delete-col-none'}
        isOpen={Boolean(deletingColumnId)}
        onClose={() => setDeletingColumnId(null)}
        onSubmit={handleConfirmDeleteColumn}
        title="Excluir Estágio?"
        description="Tem certeza que deseja excluir esta coluna? Todas as tarefas contidas nela serão removidas."
        submitText="Excluir Coluna"
        variant="danger"
        fields={[]}
      />

      {/* Modal para Criar Nova Tarefa */}
      <ActionModal
        key={targetColumnIdForTask || 'none'}
        isOpen={Boolean(targetColumnIdForTask)}
        onClose={() => setTargetColumnIdForTask(null)}
        onSubmit={handleCreateTask}
        title="Nova Tarefa"
        description="Adicione um novo card de tarefa nesta coluna."
        submitText="Criar Tarefa"
        fields={[
          {
            name: 'title',
            label: 'Título da Tarefa',
            placeholder: 'Ex: Criar tela de login...',
            required: true,
          },
          {
            name: 'description',
            label: 'Descrição',
            placeholder: 'Detalhes opcionais sobre a tarefa...',
            type: 'textarea',
          },
        ]}
      />

      {/* Modal de Visualização de Detalhes da Task */}
      <TaskDetailsModal
        isOpen={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onDelete={handleDeleteTask}
        onEdit={(task) => setEditingTask(task)}
      />

      {/* Modal de Edição com dados pré-carregados */}
      <ActionModal
        key={editingTask?.id || 'edit-none'}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTaskSubmit}
        title="Editar Tarefa"
        description="Atualize as informações da tarefa selecionada."
        submitText="Salvar Alterações"
        initialValues={{
          title: editingTask?.title || '',
          description: editingTask?.description || '',
        }}
        fields={[
          {
            name: 'title',
            label: 'Título da Tarefa',
            placeholder: 'Ex: Criar tela de login...',
            required: true,
          },
          {
            name: 'description',
            label: 'Descrição',
            placeholder: 'Detalhes da tarefa...',
            type: 'textarea',
          },
        ]}
      />
    </>
  );
}