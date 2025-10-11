
import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface OverlayProps {
  children: (context: { isOpen: boolean; onCloseRequest: () => void }) => React.ReactNode;
  isOpen: boolean;
  onCloseRequest: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ children, isOpen, onCloseRequest }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = useCallback(() => {
    if (onCloseRequest) {
      onCloseRequest();
    }
  }, [onCloseRequest]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown]);

  const contextValue = { isOpen, onCloseRequest: handleClose };

  if (isBrowser) {
    const modalRoot = document.getElementById('app-modal');
    if (modalRoot) {
      return ReactDOM.createPortal(
        <div>{children(contextValue)}</div>,
        modalRoot
      );
    }
  }

  return null;
};

export default Overlay;
