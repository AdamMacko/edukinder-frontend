import { ReactNode } from "react";

type SmoothTransitionProps = {
    children: ReactNode;
    isLoading: boolean;
    className?: string; // Umožní nám pridať grid, flex alebo iné štýly z vonku
};

export function SmoothTransition({ 
    children, 
    isLoading, 
    className = "" 
}: SmoothTransitionProps) {
    return (
        <div
            className={`transition-all duration-300 ease-in-out ${
                isLoading ? "blur-sm opacity-60 pointer-events-none" : "blur-0 opacity-100"
            } ${className}`}
        >
            {children}
        </div>
    );
}