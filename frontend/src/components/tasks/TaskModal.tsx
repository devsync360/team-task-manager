import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Task, User } from '../../types';

interface TaskModalProps {
  modalState: { mode: 'create' | 'edit' | null; task: Task | null };
  closeModal: () => void;
  formData: { title: string; description: string; assignedTo: string; status: Task['status'] };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCreateTask: () => void;
  handleUpdateTask: () => void;
  formError: string | null;
  users: User[];
  currentUserId: number;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  modalState, closeModal, formData, handleInputChange, handleCreateTask, handleUpdateTask, formError, users, currentUserId
}) => {
  if (!modalState.mode) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeModal} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {modalState.mode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input name="title" type="text" value={formData.title} onChange={handleInputChange} placeholder="Enter task title" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter task description" rows={3} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Assign To <span className="text-red-500">*</span></label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50">
                <option value="">Select a team member</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.id === currentUserId ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
            <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button onClick={modalState.mode === 'create' ? handleCreateTask : handleUpdateTask} className="px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all">
              {modalState.mode === 'create' ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};