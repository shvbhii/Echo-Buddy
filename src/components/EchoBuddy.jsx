// src/components/EchoBuddy.jsx
import React from 'react';

const EchoBuddy = ({ state = 'idle', mouthOpenness = 0, activeFilter = 'none' }) => {
  const mouthScale = Math.min(1, Math.max(0, mouthOpenness));

  const filterColors = {
    none: '#3b82f6', // Blue
    high: '#eab308', // Yellow
    low: '#8b5cf6', // Purple
    robot: '#6b7280', // Gray
  };
  const bodyColor = filterColors[activeFilter] || filterColors.none;

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80">
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-label="An animated character">
        <path
          d="M 50,10 C 20,10 10,40 10,60 C 10,90 30,100 50,100 C 70,100 90,90 90,60 C 90,40 80,10 50,10 Z"
          fill={bodyColor}
          className="transition-colors duration-300"
        />
        <g className={`transition-transform duration-200 ease-in-out ${state === 'listening' ? 'scale-110' : ''}`}>
          <circle cx="35" cy="45" r="8" fill="white" />
          <circle cx="65" cy="45" r="8" fill="white" />
          <circle cx="37" cy="47" r="3" fill="black" />
          <circle cx="63" cy="47" r="3" fill="black" />
        </g>
        <g transform="translate(50, 75)">
          {state === 'idle' && <path d="M -15,0 Q 0,5 15,0" stroke="white" strokeWidth="2" fill="none" />}
          {state === 'listening' && <circle cx="0" cy="2" r="4" fill="#1e293b" />}
          {state === 'talking' && (
             <path
              d="M -15,0 C -10,-5 10,-5 15,0 C 10,20 -10,20 -15,0 Z"
              fill="#1e293b"
              style={{
                transform: `scaleY(${mouthScale})`,
                transformOrigin: 'center top',
                transition: 'transform 0.1s linear'
              }}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

export default EchoBuddy;