
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message = "An error occurred while loading data.", onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
            {onRetry && (
                <Button variant="outline" onClick={onRetry}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retry
                </Button>
            )}
        </div>
    );
}
