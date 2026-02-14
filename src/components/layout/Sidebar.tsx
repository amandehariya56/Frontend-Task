import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    Menu,
    X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

const navItems = [
    {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        title: 'Products',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export function Sidebar() {
    const { isOpen, toggle } = useSidebarStore();
    const location = useLocation();

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 ease-in-out',
                isOpen ? 'w-64' : 'w-16',
                'hidden md:block'
            )}
        >
            <div className="flex h-14 items-center justify-between border-b px-4">
                <div className={cn("flex items-center gap-2 font-bold text-lg", !isOpen && "hidden")}>
                    <span className="text-primary">Admin</span>Panel
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className={cn("ml-auto", !isOpen && "mx-auto")}
                >
                    {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            <div className="py-4">
                <nav className="space-y-2 px-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                    isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'transparent',
                                    !isOpen && 'justify-center px-2'
                                )}
                                title={!isOpen ? item.title : undefined}
                            >
                                <item.icon className={cn("h-5 w-5", isOpen && "mr-2")} />
                                {isOpen && <span>{item.title}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
