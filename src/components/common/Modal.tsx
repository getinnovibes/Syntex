import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface-container-lowest p-6 md:p-8 shadow-2xl border border-outline-variant/50 flex flex-col gap-5">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
            {title}
          </h3>
          {description && (
            <p className="font-body-md text-body-md text-secondary mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {children && <div className="py-2">{children}</div>}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-full text-white font-label-md text-label-md font-semibold transition-all ${
              isDestructive
                ? 'bg-error hover:bg-error/90 shadow-md shadow-error/20'
                : 'bg-primary-container hover:bg-primary shadow-md shadow-primary-container/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
