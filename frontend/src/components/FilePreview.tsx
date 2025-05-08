import React from 'react';
import { ProjectFile } from '../types';

interface FilePreviewProps {
  file: ProjectFile | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg">
        <p className="text-gray-400">Select a file to preview</p>
      </div>
    );
  }

  const formatCode = (content: string, language: string) => {
    const keywords = ['function', 'return', 'const', 'let', 'var', 'import', 'export', 'from', 'class', 'if', 'else', 'for', 'while', 'switch', 'case'];
    const html = content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(\/\/.+?)(\n|$)/g, '<span class="text-green-400">$1</span>$2')
      .replace(/(['"`])(.*?)\1/g, '<span class="text-amber-400">$1$2$1</span>')
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span class="text-purple-400">$1</span>');
    
    return { __html: html };
  };

  return (
    <div className="h-full flex flex-col border border-gray-700 rounded-lg overflow-hidden shadow-sm bg-gray-800">
      <div className="border-b border-gray-700 p-3 bg-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium text-gray-200">{file.name}</span>
          <span className="ml-2 text-xs text-gray-400">{file.path}</span>
        </div>
        <div className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
          {file.language}
        </div>
      </div>
      <div className="flex-grow overflow-auto p-4 text-gray-200">
        <pre className="text-sm font-mono">
          <code dangerouslySetInnerHTML={formatCode(file.content, file.language)} />
        </pre>
      </div>
    </div>
  );
};

export default FilePreview;