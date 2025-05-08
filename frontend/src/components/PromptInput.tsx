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
          className="w-full h-32 p-4 pr-24 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition placeholder-gray-500"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <div className="absolute bottom-4 right-4">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={prompt.trim() === '' || isLoading}
            icon={<Sparkles className="h-4 w-4" />}
            className="shadow-sm"
          >
            Generate
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PromptInput