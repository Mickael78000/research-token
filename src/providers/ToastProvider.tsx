"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '../types';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Context for toast management
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {}
});

// Hook to use toast context
export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

// Toast icons and colors by type
const toastTypeConfig = {
  success: { bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-500' },
  error: { bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-500' },
  warning: { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-500' },
  info: { bgColor: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-500' }
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 10);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss if set (default is true for success and info)
    if (toast.autoDismiss !== false && (toast.type === 'success' || toast.type === 'info')) {
      setTimeout(() => removeToast(id), 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    toasts,
    addToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => {
            const { bgColor, textColor, borderColor } = toastTypeConfig[toast.type];
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${bgColor} ${textColor} rounded-lg shadow-md p-4 border-l-4 ${borderColor} flex items-start`}
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{toast.title}</h4>
                  <p className="text-sm mt-1">{toast.message}</p>
                </div>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};