import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutGrid,
  ClipboardList,
  Calendar,
  Plus,
  X,
  Trash2,
  LogOut,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  ChevronDown,
  Search,
  Briefcase,
  User,
  Menu,
  Inbox,
  PenSquare
} from 'lucide-react';

// TypeScript Interfaces (same as before)
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdBy: number;
  assignedTo: number;
  createdAt: string;
}

// Mock Data (same)
const MOCK_USERS: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW' }
];

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Design System Implementation',
    description: 'Create a comprehensive design system with reusable components and documentation.',
    status: 'In Progress',
    createdBy: 1,
    assignedTo: 2,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'API Integration',
    description: 'Integrate REST APIs for user authentication and data fetching.',
    status: 'Pending',
    createdBy: 2,
    assignedTo: 1,
    createdAt: '2024-01-16'
  },
  {
    id: 3,
    title: 'Performance Optimization',
    description: 'Optimize bundle size and implement code splitting for better performance.',
    status: 'Completed',
    createdBy: 1,
    assignedTo: 1,
    createdAt: '2024-01-14'
  },
  {
    id: 4,
    title: 'User Testing Feedback',
    description: 'Collect and implement feedback from user testing sessions.',
    status: 'Pending',
    createdBy: 3,
    assignedTo: 1,
    createdAt: '2024-01-17'
  },
  {
    id: 5,
    title: 'Mobile Responsiveness',
    description: 'Ensure all pages are fully responsive on mobile devices.',
    status: 'In Progress',
    createdBy: 1,
    assignedTo: 3,
    createdAt: '2024-01-13'
  }
];

type ViewMode = 'assigned' | 'created';
type ModalMode = 'create' | 'edit' | null;

interface ModalState {
  mode: ModalMode;
  task: Task | null;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [viewMode, setViewMode] = useState<ViewMode>('assigned');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [modalState, setModalState] = useState<ModalState>({
    mode: null,
    task: null
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'Pending' as Task['status']
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true); // For mobile toggle

  const currentUserId = currentUser?.id || 1;

  const filteredTasks = tasks.filter(task => {
    const matchesView = viewMode === 'assigned' 
      ? task.assignedTo === currentUserId
      : task.createdBy === currentUserId;
    
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesView && matchesSearch;
  });

  const getUserById = (id: number): User => {
    return MOCK_USERS.find(user => user.id === id) || MOCK_USERS[0];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status: Task['status']) => {
    const configs = {
      'Pending': {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Circle,
        iconColor: 'text-amber-500'
      },
      'In Progress': {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: Clock,
        iconColor: 'text-blue-500'
      },
      'Completed': {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
        iconColor: 'text-emerald-500'
      }
    };
    return configs[status];
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      status: 'Pending'
    });
    setFormError(null);
    setModalState({ mode: 'create', task: null });
  };

  const openEditModal = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo.toString(),
      status: task.status
    });
    setFormError(null);
    setModalState({ mode: 'edit', task });
  };

  const closeModal = () => {
    setModalState({ mode: null, task: null });
    setFormError(null);
  };

  const handleCreateTask = () => {
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Description is required');
      return;
    }
    if (!formData.assignedTo) {
      setFormError('Please select an assignee');
      return;
    }

    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status, // Use selected status
      createdBy: currentUserId,
      assignedTo: parseInt(formData.assignedTo),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => [...prev, newTask]);
    closeModal();
  };

  const handleUpdateTask = () => {
    if (!modalState.task) return;

    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Description is required');
      return;
    }
    if (!formData.assignedTo) {
      setFormError('Please select an assignee');
      return;
    }

    setTasks(prev => prev.map(task =>
      task.id === modalState.task!.id
        ? {
            ...task,
            title: formData.title.trim(),
            description: formData.description.trim(),
            assignedTo: parseInt(formData.assignedTo),
            status: formData.status
          }
        : task
    ));
    closeModal();
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formError) setFormError(null);
  };

  useEffect(() => {
    if (modalState.mode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalState.mode]);

  if (!currentUser) return null;

  const currentUserFull = getUserById(currentUserId);
  const stats = {
    total: filteredTasks.length,
    inProgress: filteredTasks.filter(t => t.status === 'In Progress').length,
    completed: filteredTasks.filter(t => t.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-30`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-semibold text-gray-900 whitespace-nowrap">TaskFlow</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          <button
            onClick={() => setViewMode('assigned')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'assigned'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Inbox className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Assigned to Me</span>}
            {!sidebarOpen && viewMode === 'assigned' && (
              <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setViewMode('created')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'created'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PenSquare className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Created by Me</span>}
            {!sidebarOpen && viewMode === 'created' && (
              <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </nav>

        {/* Sidebar Footer - User Info */}
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

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Right side - New Task & User Menu */}
              <div className="flex items-center gap-3">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Task</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-medium text-xs">{currentUserFull.avatar}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{currentUserFull.name}</p>
                          <p className="text-xs text-gray-500">{currentUserFull.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <LayoutGrid className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {viewMode === 'assigned' 
                  ? "You don't have any tasks assigned to you yet."
                  : "You haven't created any tasks yet."}
              </p>
              <button
                onClick={openCreateModal}
                className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTasks.map(task => {
                const assignee = getUserById(task.assignedTo);
                const canDelete = task.createdBy === currentUserId;
                const statusConfig = getStatusConfig(task.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div
                    key={task.id}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                    onClick={() => openEditModal(task)}
                  >
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
                            <User className="w-3 h-3 text-blue-600" />
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
                              handleDeleteTask(task.id);
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
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modal (same as before, but with status dropdown always visible) */}
      {modalState.mode && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  {modalState.mode === 'create' ? 'Create New Task' : 'Edit Task'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Assign To <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50"
                  >
                    <option value="">Select a team member</option>
                    {MOCK_USERS.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} {user.id === currentUserId ? '(You)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status dropdown always visible (create and edit) */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50"
                  >
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
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={modalState.mode === 'create' ? handleCreateTask : handleUpdateTask}
                  className="px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
                >
                  {modalState.mode === 'create' ? 'Create Task' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;