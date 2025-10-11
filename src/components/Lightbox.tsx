
import React from 'react';
import Overlay from './Overlay';
import Icon from './Icon';

interface LightboxProps {
  isOpen: boolean;
  onCloseRequest: () => void;
  children: React.ReactNode;
  additionalStyles?: React.CSSProperties;
}

const Lightbox: React.FC<LightboxProps> = ({ isOpen, onCloseRequest, children, additionalStyles }) => {
  return (
    <Overlay onCloseRequest={onCloseRequest} isOpen={isOpen}>
      {({ isOpen, onCloseRequest }) => (
        <div className={`fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div
            className={`absolute top-0 left-0 w-full h-full bg-black cursor-pointer transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onCloseRequest}
          ></div>
          <div className={`relative flex flex-col h-full w-full bg-black overflow-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="fixed top-0 left-0 w-full z-10 p-6">
              <div
                className="absolute top-6 right-6 flex items-center justify-center cursor-pointer w-8 h-8 p-2 rounded-full bg-gray-200"
                onClick={onCloseRequest}
              >
                <Icon name="close" />
              </div>
            </div>
            <div className="flex-grow flex justify-center items-center p-8" style={additionalStyles}>
              {children}
            </div>
          </div>
        </div>
      )}
    </Overlay>
  );
};

export default Lightbox;
