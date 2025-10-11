
import React from 'react';

interface NoticeProps {
  children: React.ReactNode;
}

const Notice: React.FC<NoticeProps> = ({ children }) => {
  return (
    <div className="bg-yellow-100 rounded-lg p-4 md:p-6 whitespace-pre-line">
      {children}
    </div>
  );
};

export default Notice;
