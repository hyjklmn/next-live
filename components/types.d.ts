export type ToastType = 'default' | 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastContextProps {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
}