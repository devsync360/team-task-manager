import React from 'react';
import { Briefcase, Menu, Inbox, PenSquare } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  viewMode: 'assigned' | 'created';
  setViewMode: (mode: 'assigned' | 'created') => void;
  currentUserFull: { name: string; email: string; avatar: string };
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, setSidebarOpen, viewMode, setViewMode, currentUserFull 
}) => {
  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-30`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && <span className="font-semibold text-gray-900 whitespace-nowrap">TaskFlow</span>}
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        <button onClick={() => setViewMode('assigned')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'assigned' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Inbox className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Assigned to Me</span>}
          {!sidebarOpen && viewMode === 'assigned' && <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
        </button>
        <button onClick={() => setViewMode('created')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'created' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <PenSquare className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Created by Me</span>}
          {!sidebarOpen && viewMode === 'created' && <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
        </button>
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-xs">{currentUserFull.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUserFull.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUserFull.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};