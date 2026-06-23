export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
}

export type ColumnId = 'todo' | 'doing' | 'done';

export interface Column {
  id: ColumnId;
  title: string;
  color: string; // Ex: 'orange', 'blue', 'green'
  tasks: Task[];
}