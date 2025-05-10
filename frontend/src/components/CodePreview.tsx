import React, { useState, useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";
import { FileItem } from '../types';
import { Code2, Eye } from 'lucide-react';
import { WebContainer } from '@webcontainer/api';
import { PreviewFrame } from './PreviewFrame';

interface CodePreviewProps {
  file: FileItem | null;
  webContainer?: {
    instance: WebContainer | null;
    isReady: boolean;
  };
  projectPreviewUrl?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ projectPreviewUrl, file, webContainer }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [editorKey, setEditorKey] = useState<number>(0);
  const editorRef = useRef<any>(null);

  // Handle editor mounting
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Cleanup editor instance when unmounting or changing files
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [file]);

  // Update editorKey when file changes to force re-render of the Editor component
  useEffect(() => {
    if (file) {
      setEditorKey(prev => prev + 1);
    }
  }, [file]);

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg">
        <p className="text-gray-400">Select a file to preview</p>
      </div>
    );
  }

  const getLanguageId = (file: FileItem): string => {
    // Extract extension from file name
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown'
    };
    
    return languageMap[extension] || 'plaintext';
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
            disabled={!webContainer?.instance}
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
            {file.type}
          </span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        {activeTab === 'code' ? (
          <Editor
            key={editorKey}
            height="100%"
            language={getLanguageId(file)}
            value={file.content}
            theme="vs-dark"
            onMount={handleEditorDidMount}
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
            {!webContainer?.instance ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Preview not available. Web container not initialized.</p>
              </div>
            ) : (
              <PreviewFrame 
                files={[file]} 
                webContainer={webContainer.instance} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;