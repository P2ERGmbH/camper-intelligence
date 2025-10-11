import React from 'react';

interface LoadingProps {
  size?: string;
  height?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = '48px', height }) => {
  const keyframes = `
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes clipping {
      0% {
        clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0)
      }
      25% {
        clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0)
      }
      50% {
        clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%)
      }
      75% {
        clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%)
      }
      100% {
        clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0)
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        className="flex items-center justify-center"
        style={{ 
          height: height || 'calc(100vh - var(--header-height))',
          animation: 'fadeIn 0.2s ease-in forwards 0.2s'
        }}
      >
        <div
          className="relative animate-spin"
          style={{ width: size, height: size }}
        >
          <div
            className="box-border absolute inset-0 border-solid rounded-full"
            style={{
              borderWidth: `calc(${size} * 0.15)`,
              borderColor: 'currentColor',
              animation: 'clipping 2s linear infinite',
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Loading;