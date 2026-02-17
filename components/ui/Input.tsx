import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, type, id, rightElement, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-foreground mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            'w-full px-4 py-2.5 border rounded-lg transition-all duration-200',
                            'bg-background text-foreground placeholder-muted-foreground',
                            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                            error
                                ? 'border-destructive focus:ring-destructive'
                                : 'border-input hover:border-accent-foreground/30',
                            'disabled:bg-muted disabled:cursor-not-allowed',
                            rightElement && 'pr-12',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
