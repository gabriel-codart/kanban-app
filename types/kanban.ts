export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  color: string; // Ex: 'orange', 'blue', 'green'
  tasks: Task[];
}

export interface KanbanColumnProps {
  column: Column;
}