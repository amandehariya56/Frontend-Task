import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className={cn(
            "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
            "flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-destructive text-destructive-foreground shadow-lg",
            "animate-in slide-in-from-bottom-2 fade-in duration-300"
        )}>
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">You are offline</span>
        </div>
    );
}
