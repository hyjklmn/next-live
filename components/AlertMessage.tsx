// import React from 'react'
// import { createPortal } from 'react-dom'
// import { AlertCircle, XCircle } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// export default function MessageAlert() {
//   const aletBox = React.useRef<HTMLDivElement>(null)
//   function hiddenAlert() {
//     aletBox.current?.classList.add('hidden')
//   }
//   return (
//     createPortal(
//       <div ref={aletBox} className='group w-[150px] z-50 absolute top-20 left-[50%] translate-x-[-50%]'>
//         <Alert variant="destructive">
//           <AlertDescription className='flex gap-2 items-center'>
//             <AlertCircle className="h-4 w-4" />
//             填写完整
//           </AlertDescription>
//         </Alert>
//         <XCircle className="h-4 w-4 hidden cursor-pointer absolute right-1 top-1 text-destructive group-hover:block" onClick={hiddenAlert} />
//       </div>,
//       document.body)
//   )
// }

import React, { createContext, useContext, FC, useState } from 'react';
import { ToastType, ToastMessage, ToastContextProps } from './types';

interface ToastProviderProps {
  children: React.ReactNode; // ReactNode 表示任何可以被渲染的内容，包括字符串、数字、React 组件等
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'default') => {
    setToasts(prevToasts => [...prevToasts, { message, type, id: Date.now() }]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="absolute top-20 left-[50%] z-10">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};