import { useState, useEffect, createContext, useContext, useCallback } from "react";

// Context
const ToastContext = createContext(null);

// Hook to use toast anywhere
export function useToast() {
    return useContext(ToastContext);
}

// Individual Toast item
function ToastItem({ id, message, type, onRemove }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slide in
        const t1 = setTimeout(() => setVisible(true), 10);
        // Slide out before remove
        const t2 = setTimeout(() => setVisible(false), 2700);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const styles = {
        success: { icon: "text-emerald-500", bar: "bg-emerald-500", bg: "bg-white border-emerald-100" },
        error: { icon: "text-rose-500", bar: "bg-rose-500", bg: "bg-white border-rose-100" },
        info: { icon: "text-blue-500", bar: "bg-blue-500", bg: "bg-white border-blue-100" },
    };
    const s = styles[type] || styles.info;

    const icons = {
        success: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div
            className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg min-w-[240px] max-w-xs overflow-hidden transition-all duration-300 ${s.bg} ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
        >
            {/* Progress bar */}
            <div
                className={`absolute bottom-0 left-0 h-0.5 ${s.bar} rounded-full`}
                style={{ animation: "shrink 3s linear forwards" }}
            />

            {/* Icon */}
            <div className={`shrink-0 ${s.icon}`}>{icons[type] || icons.info}</div>

            {/* Message */}
            <p className="text-sm text-gray-700 font-medium flex-1">{message}</p>

            {/* Close */}
            <button
                onClick={() => onRemove(id)}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

// Provider wraps the whole app
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message, type = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast container - bottom right */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
                {toasts.map((t) => (
                    <ToastItem key={t.id} {...t} onRemove={removeToast} />
                ))}
            </div>

            <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </ToastContext.Provider>
    );
}