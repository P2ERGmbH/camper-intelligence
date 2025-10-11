
import React from 'react';
import Overlay from './Overlay';
import Icon, { IconSizes } from './Icon';

interface SidebarProps {
  children: React.ReactNode;
  right?: boolean;
  headline?: React.ReactNode;
  onCloseRequest: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ children, right = true, headline, onCloseRequest, isOpen }) => {
  return (
    <Overlay onCloseRequest={onCloseRequest} isOpen={isOpen}>
      {() => (
        <div className={`fixed top-0 left-0 w-full h-full z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div
            className={`absolute top-0 left-0 w-full h-full cursor-pointer bg-black bg-opacity-30 transition-opacity duration-200 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onCloseRequest}
          ></div>
          <div
            className={`relative h-full w-[600px] max-w-[calc(100vw-40px)] bg-white transition-transform duration-200 ease-out overflow-auto ${right ? 'float-right' : 'float-left'} ${isOpen ? 'translate-x-0' : right ? 'translate-x-full' : '-translate-x-full'}`}
          >
            <div className="flex items-center justify-between gap-4 min-h-[var(--header-height)] p-4 md:p-6 lg:p-10 bg-gray-800 text-white">
              {headline && <div className="flex-auto text-lg md:text-xl font-bold">{headline}</div>}
              <div
                onClick={onCloseRequest}
                tabIndex={0}
                role="button"
                className="relative ml-auto cursor-pointer self-start p-2 -mr-2 -mt-2 rounded-full hover:bg-gray-700"
              >
                <Icon name="close" size={IconSizes.M} />
              </div>
            </div>
            <div className="p-4 md:p-10">{children}</div>
          </div>
        </div>
      )}
    </Overlay>
  );
};

export default Sidebar;
