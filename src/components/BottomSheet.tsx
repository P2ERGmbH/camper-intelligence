
import React from 'react';
import Overlay from './Overlay';
import Icon, { IconSizes } from './Icon';
import Button from './Button';

interface BottomSheetProps {
  title?: string;
  isOpen: boolean;
  onCloseRequest: () => void;
  children: React.ReactNode;
  size?: 'L' | 'M';
  fitContent?: boolean;
  onBack?: () => void;
  buttons?: React.ReactNode;
  height?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  title,
  isOpen,
  onCloseRequest,
  children,
  size = 'M',
  fitContent = false,
  onBack,
  buttons,
  height = '100%',
}) => {
  return (
    <Overlay onCloseRequest={onCloseRequest} isOpen={isOpen}>
      {({ isOpen: overlayOpen, onCloseRequest: overlayCloseRequest }) => (
        <div
          className={`fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center transition-opacity duration-300 ${overlayOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div
            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 cursor-pointer"
            onClick={overlayCloseRequest}
          ></div>
          <div
            className={`relative bg-white w-full ${size === 'L' ? 'max-w-4xl' : 'max-w-2xl'} transition-transform duration-400 ${overlayOpen ? 'translate-y-0' : 'translate-y-full'} ${fitContent ? 'h-auto' : 'h-full'}`}
            style={{ maxHeight: 'calc(100dvh - 80px)', height }}
          >
            <div className="sticky top-0 left-0 w-full z-10 bg-white shadow-md p-4">
              {onBack && (
                <Button onClick={onBack} className="absolute top-1/2 -translate-y-1/2 left-4 p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100">
                  <Icon name="slide-left" size={IconSizes.S} />
                </Button>
              )}
              {title && (
                <div className="w-full text-center font-medium">{title}</div>
              )}
              <div
                className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer p-2 rounded-full hover:bg-gray-100"
                onClick={overlayCloseRequest}
              >
                <Icon name="close" />
              </div>
            </div>
            <div className="p-4 overflow-y-auto" style={{ flexGrow: 1 }}>
              {children}
            </div>
            {buttons && (
              <div className="sticky bottom-0 left-0 w-full bg-white shadow-lg p-4">
                {buttons}
              </div>
            )}
          </div>
        </div>
      )}
    </Overlay>
  );
};

export default BottomSheet;
