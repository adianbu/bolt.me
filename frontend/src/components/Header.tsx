import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Home } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition">
          <Code2 className="h-6 w-6" />
          <span className="font-bold text-xl">WebCraft</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link 
            to="/" 
            className={`flex items-center space-x-2 py-2 px-3 rounded-md transition ${
              location.pathname === '/' 
                ? 'text-blue-400 bg-gray-800' 
                : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="font-medium">Home</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;