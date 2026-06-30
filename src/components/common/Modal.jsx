import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 px-0 sm:px-4 backdrop-blur-sm">
      <div className={`relative w-full ${sizes[size]} bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">{title}</h3>
          <button onClick={onClose} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
