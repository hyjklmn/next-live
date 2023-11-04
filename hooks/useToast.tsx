import React, { createContext, useContext, FC, useState, useEffect } from 'react';
import { ToastType, ToastMessage, ToastContextProps } from './types';
import { XCircle, CheckCircle2, AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from 'framer-motion';
interface ToastProviderProps {
  children: React.ReactNode; // ReactNode 表示任何可以被渲染的内容，包括字符串、数字、React 组件等
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const aletBox = React.useRef<HTMLDivElement>(null)
  function hiddenAlert() {
    aletBox.current?.classList.add('hidden')
  }
  const addToast = (message: string, type: ToastType = 'default') => {
    aletBox.current?.classList.remove('hidden')
    setToasts(prevToasts => [{ message, type, id: Date.now() }]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      aletBox.current?.classList.add('hidden')
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        ref={aletBox}
        style={{ top: '10%', left: '50%' }}
        className='hidden backdrop-blur group z-50 absolute translate-x-[-50%]'>
        <Alert>
          <AlertDescription className='flex gap-2 items-center'>
            {
              toasts.map((toast, index) => {
                switch (toast.type) {
                  case 'warning':
                    return (
                      <AlertCircleIcon key={toast.id} className='h-4 w-4 text-yellow-500' />
                    )
                  case 'error':
                    return (
                      <XCircle key={toast.id} className="h-4 w-4 text-red-500" />
                    )
                  default:
                    return (
                      <CheckCircle2 key={toast.id} className="h-4 w-4 text-blue-500" />
                    )
                }
              })
            }
            {toasts.map(toast => (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={toast.id}>
                {toast.message}
              </motion.div>
            ))}
          </AlertDescription>
        </Alert>
      </div >
    </ToastContext.Provider >
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};