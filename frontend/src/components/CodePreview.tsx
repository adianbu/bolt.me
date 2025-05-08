import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { ProjectFile } from '../types';
import { Code2, Eye } from 'lucide-react';

interface CodePreviewProps {
  file: ProjectFile | null;
}

const CodePreview: React.FC<CodePreviewProps> = ({ file }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg">
        <p className="text-gray-400">Select a file to preview</p>
      </div>
    );
  }

  const getLanguageId = (language: string): string => {
    const languageMap: { [key: string]: string } = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
    };
    return languageMap[language.toLowerCase()] || 'plaintext';
  };

  return (
    <div className="h-full flex flex-col border border-gray-700 rounded-lg overflow-hidden shadow-sm bg-gray-800">
      <div className="border-b border-gray-700 p-2 bg-gray-800 flex items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'code'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Code2 className="h-4 w-4 mr-2" />
            Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
        </div>
        <div className="ml-auto flex items-center">
          <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
            {file.language}
          </span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        {activeTab === 'code' ? (
          <Editor
            height="100%"
            defaultLanguage={getLanguageId(file.language)}
            defaultValue={file.content}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        ) : (
          <div className="h-full">
            {file.language === 'html' ? (
              <iframe
                srcDoc={file.content}
                className="w-full h-full bg-white"
                title="Preview"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Preview not available for this file type
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;