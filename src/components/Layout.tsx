import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useStore } from '../store/useStore';

export default function Layout() {
  const { sidebarOpen } = useStore();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'mr-72' : 'mr-0'
        }`}
      >
        <div className="min-h-screen p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

