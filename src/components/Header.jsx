// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center tracking-wider text-cyan-400">
          Echo Buddy
        </h1>
      </div>
    </header>
  );
};

export default Header;