import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Button from './ui/Button';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Describe the website you want to create...',
  className = '',
}) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative w-full">
        <textarea
          className="w-full h-40 sm:h-32 p-4 pr-32 sm:pr-24 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition placeholder-gray-500"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={prompt.trim() === '' || isLoading}
            icon={<Sparkles className="h-4 w-4" />}
            className="shadow-sm text-sm sm:text-base px-3 sm:px-4"
          >
            <span className="hidden sm:inline">Generate</span>
            <span className="sm:hidden">Go</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PromptInput