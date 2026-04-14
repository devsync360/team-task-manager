export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: number;
  assignedTo: number;
  createdAt: string;
}