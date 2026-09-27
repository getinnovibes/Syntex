import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgStyles =
    type === 'success'
      ? 'bg-primary-container text-white border-primary-container'
      : type === 'error'
      ? 'bg-error text-white border-error'
      : 'bg-surface-container-lowest text-on-surface border-outline-variant';

  const iconName =
    type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border ${bgStyles} backdrop-blur-md`}
      >
        <span className="material-symbols-outlined text-[20px]">{iconName}</span>
        <span className="font-body-sm text-body-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:opacity-75 transition-opacity"
          aria-label="Dismiss message"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
