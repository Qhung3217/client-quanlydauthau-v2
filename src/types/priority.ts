export type PriorityColor =
  | '#71717a'
  | '#ef4444'
  | '#f59e0b'
  | '#84cc16'
  | '#10b981'
  | '#0ea5e9'
  | '#3b82f6'
  | '#8b5cf6';

export type Priority = {
  id: string;
  name: string;
  color: PriorityColor;
  createdAt: string;
  updatedAt: string;
};
