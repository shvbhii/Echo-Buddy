// src/components/Footer.jsx
import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-center sm:text-left mb-4 sm:mb-0">
          Made by <span className="font-bold text-cyan-400">Shubhi Sharma</span>
        </p>
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/your-github-username" // <-- TODO: Add your GitHub link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-cyan-400 transition-colors duration-300"
          >
            <FaGithub size={24} />
            <span className="hidden sm:inline">View Source on Github</span>
          </a>
          <a
            href="https://linkedin.com/in/your-linkedin-username" // <-- TODO: Add your LinkedIn link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-cyan-400 transition-colors duration-300"
          >
            <FaLinkedin size={24} />
            <span className="hidden sm:inline">Connect via LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;