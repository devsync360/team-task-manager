import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, ClipboardList, Clock, CheckCircle2, Plus } from 'lucide-react';
import { api } from '../services/api';
import type { User, Task } from '../types';

// Import our new components!
import { Sidebar } from '../components/ui/Sidebar';
import { Header } from '../components/ui/Header';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';

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
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const [viewMode, setViewMode] = useState<ViewMode>('assigned');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [realTasks, realUsers] = await Promise.all([api.getTasks(), api.getUsers()]);
        setTasks(realTasks);
        setUsers(realUsers);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const [modalState, setModalState] = useState<ModalState>({ mode: null, task: null });
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: '', status: 'Pending' as Task['status'] });
  const [formError, setFormError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser) return null;

  const currentUserFull = {
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.name.substring(0, 2).toUpperCase()
  };

  const filteredTasks = tasks.filter(task => {
    const matchesView = viewMode === 'assigned' ? task.assignedTo === currentUser.id : task.createdBy === currentUser.id;
    const matchesSearch = searchTerm === '' || task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesView && matchesSearch;
  });

  const getUserById = (id: number): User => {
    const found = users.find(u => u.id === id);
    if (found) return found;
    // PERFECT FALLBACK: Resolves all Type errors and removes MOCK_USERS entirely
    return { id, name: 'Unknown User', email: '' }; 
  };

  const openCreateModal = () => {
    setFormData({ title: '', description: '', assignedTo: '', status: 'Pending' });
    setFormError(null);
    setModalState({ mode: 'create', task: null });
  };

  const openEditModal = (task: Task) => {
    setFormData({ title: task.title, description: task.description, assignedTo: task.assignedTo.toString(), status: task.status });
    setFormError(null);
    setModalState({ mode: 'edit', task });
  };

  const handleCreateTask = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.assignedTo) return setFormError('Please fill in all required fields');
    try {
      const newTask = await api.createTask({ title: formData.title.trim(), description: formData.description.trim(), status: formData.status, assignedTo: parseInt(formData.assignedTo), createdBy: currentUser.id });
      setTasks(prev => [...prev, newTask]);
      setModalState({ mode: null, task: null });
    } catch (err) { setFormError('Failed to create task'); }
  };

  const handleUpdateTask = async () => {
    if (!modalState.task || !formData.title.trim() || !formData.description.trim() || !formData.assignedTo) return setFormError('Please fill in all required fields');
    try {
      const updatedTask = await api.updateTask(modalState.task.id, { title: formData.title.trim(), description: formData.description.trim(), status: formData.status, assignedTo: parseInt(formData.assignedTo) });
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      setModalState({ mode: null, task: null });
    } catch (err) { setFormError('Failed to update task'); }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(taskId);
        setTasks(prev => prev.filter(task => task.id !== taskId));
      } catch (err) { alert('Failed to delete task'); }
    }
  };

  const stats = {
    total: filteredTasks.length,
    inProgress: filteredTasks.filter(t => t.status === 'In Progress').length,
    completed: filteredTasks.filter(t => t.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} viewMode={viewMode} setViewMode={setViewMode} currentUserFull={currentUserFull} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} openCreateModal={openCreateModal} showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} currentUserFull={currentUserFull} handleLogout={() => { logout(); navigate('/login'); }} />

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium text-gray-600">Total Tasks</p><LayoutGrid className="w-5 h-5 text-gray-400" /></div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium text-gray-600">In Progress</p><Clock className="w-5 h-5 text-blue-500" /></div>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium text-gray-600">Completed</p><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
              <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{viewMode === 'assigned' ? "You don't have any tasks assigned to you yet." : "You haven't created any tasks yet."}</p>
              <button onClick={openCreateModal} className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Your First Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} assignee={getUserById(task.assignedTo)} canDelete={task.createdBy === currentUser.id} onEdit={openEditModal} onDelete={handleDeleteTask} />
              ))}
            </div>
          )}
        </main>
      </div>

      <TaskModal modalState={modalState} closeModal={() => { setModalState({ mode: null, task: null }); setFormError(null); }} formData={formData} handleInputChange={(e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); setFormError(null); }} handleCreateTask={handleCreateTask} handleUpdateTask={handleUpdateTask} formError={formError} users={users} currentUserId={currentUser.id} />
    </div>
  );
};

export default Dashboard;