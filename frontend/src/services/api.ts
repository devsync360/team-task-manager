import type { Task, User } from '../types';

// --- MOCK DATA ---
const mockUsers: User[] = [
  { id: 'u1', name: 'Developer One', email: 'dev1@test.com' },
  { id: 'u2', name: 'Developer Two', email: 'dev2@test.com' },
];

let mockTasks: Task[] = [
  {
    id: 't1', title: 'Setup PostgreSQL', description: 'Create database schema',
    status: 'Completed', createdBy: 'u1', assignedTo: 'u1', createdAt: new Date().toISOString()
  },
  {
    id: 't2', title: 'Design Dashboard UI', description: 'Build responsive grid with Tailwind',
    status: 'In Progress', createdBy: 'u2', assignedTo: 'u1', createdAt: new Date().toISOString()
  },
];

// --- API SERVICE ---
export const api = {
  // Auth
  login: async (email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user) resolve(user);
        else reject(new Error("Invalid credentials"));
      }, 500);
    });
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockUsers), 300));
  },

  // Tasks
  getTasks: async (): Promise<Task[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockTasks), 300));
  },

  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    return new Promise(resolve => {
      const newTask = { ...task, id: `t${Date.now()}`, createdAt: new Date().toISOString() };
      mockTasks.push(newTask);
      setTimeout(() => resolve(newTask), 300);
    });
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    return new Promise(resolve => {
      const index = mockTasks.findIndex(t => t.id === id);
      mockTasks[index] = { ...mockTasks[index], ...updates };
      setTimeout(() => resolve(mockTasks[index]), 300);
    });
  },

  deleteTask: async (id: string): Promise<void> => {
    return new Promise(resolve => {
      mockTasks = mockTasks.filter(t => t.id !== id);
      setTimeout(() => resolve(), 300);
    });
  }
};