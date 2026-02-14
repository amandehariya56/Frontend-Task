import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { cn } from '@/lib/utils';

export default function MainLayout() {
  const { isOpen } = useSidebarStore();

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Sidebar />
      <div 
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "md:ml-64" : "md:ml-16"
        )}
      >
        <Header />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
