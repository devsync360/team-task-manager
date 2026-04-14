import React from 'react';
import { User as UserIcon, Calendar, Trash2, Circle, Clock, CheckCircle2 } from 'lucide-react';
import type { Task, User } from '../../types';

interface TaskCardProps {
  task: Task;
  assignee: User;
  canDelete: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, canDelete, onEdit, onDelete }) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Today';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusConfig = (status: Task['status']) => {
    const configs = {
      'Pending': { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Circle, iconColor: 'text-amber-500' },
      'In Progress': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock, iconColor: 'text-blue-500' },
      'Completed': { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-500' }
    };
    return configs[status] || configs['Pending'];
  };

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer" onClick={() => onEdit(task)}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 leading-tight pr-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {task.title}
          </h3>
          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
            <StatusIcon className={`w-3 h-3 ${statusConfig.iconColor}`} />
            {task.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <UserIcon className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-gray-500">Assigned to:</span>
            <span className="ml-1.5 font-medium text-gray-900">{assignee.name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
              <Calendar className="w-3 h-3 text-gray-600" />
            </div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-1.5 font-medium text-gray-900">{formatDate(task.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-gray-100 pt-3">
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};