import React, { createContext, useContext, useState, FC } from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2 } from "lucide-react"
interface ToastMessage {
  type: string;
  content: string;
}
interface ToastContextProps {
  showToast: (message: ToastMessage) => void;
  hideToast: () => void;
  message: { content: string, type: string } | null;
}
interface Props {
  children: React.ReactNode;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: FC<Props> = ({ children }) => {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showToast = (message: ToastMessage) => {
    setMessage(message);
    setIsVisible(true);

    // Hide the toast after 3000 milliseconds (3 seconds)
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, message }}>
      {children}
      {isVisible &&
        <motion.div
          initial={{ top: 0, left: '50%', opacity: 0, translateX: '-50%' }}
          animate={{ top: '10%', opacity: 1 }}
          className="backdrop-blur absolute z-50 border rounded-lg px-3 py-2">
          <div className='flex items-center gap-1'>
            {
              message?.type === 'error' ?
                <XCircle className='w-4 h-4 text-red-500' /> :
                <CheckCircle2 className='w-4 h-4 text-blue-500' />
            }
            {message?.content}
          </div>
        </motion.div>}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
