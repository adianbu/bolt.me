import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Code2, LayoutGrid } from 'lucide-react';
import PromptInput from '../components/PromptInput';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Enable dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const handleSubmit = (prompt: string) => {
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      // Store the prompt in local storage to use on the results page
      localStorage.setItem('currentPrompt', prompt);
      navigate('/results');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12 px-4 container mx-auto flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform transition hover:scale-105">
              <Code2 className="h-10 w-10" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            Build websites with AI
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Describe the website you want to create and watch it come to life in seconds.
          </p>
        </div>
        
        <div className="w-full max-w-3xl mb-16">
          <PromptInput 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
            placeholder="Describe the website you want to build, e.g. 'Create a landing page for a coffee shop with a menu, about section, and contact form...'" 
          />
          
          <div className="mt-4 text-sm text-gray-400 text-center">
            Just describe what you want and we'll generate a complete website for you.
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 hover:shadow-md transition">
            <div className="rounded-full bg-blue-900 h-12 w-12 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Lightning Fast</h3>
            <p className="text-gray-300">
              Generate complete, working websites in seconds with just a text prompt.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 hover:shadow-md transition">
            <div className="rounded-full bg-purple-900 h-12 w-12 flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Clean Code</h3>
            <p className="text-gray-300">
              Get well-structured, maintainable code that you can easily customize.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 hover:shadow-md transition">
            <div className="rounded-full bg-emerald-900 h-12 w-12 flex items-center justify-center mb-4">
              <LayoutGrid className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Responsive Design</h3>
            <p className="text-gray-300">
              Every website is mobile-friendly and looks great on all devices.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 WebCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;