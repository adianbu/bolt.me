import React, { useState, useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";
import { loader } from '@monaco-editor/react';
import { FileItem } from '../types';
import { Code2 } from 'lucide-react';
import { WebContainer } from '@webcontainer/api';
import { PreviewFrame } from './PreviewFrame';

// Configure Monaco Editor loader with proper error handling
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
  }
});

// Add global error handling for Monaco initialization
loader.init().then(
  () => {
    console.log('Monaco initialization: success');
  },
  (error) => {
    console.log('Monaco initialization: error:', error);
  }
);

// Fallback text viewer component
const FallbackTextViewer: React.FC<{ content: string; language: string }> = ({ content, language }) => {
  return (
    <div className="h-full bg-gray-900 text-gray-300 font-mono text-sm overflow-auto">
      <div className="p-4">
        <div className="mb-2 text-xs text-gray-500 border-b border-gray-700 pb-2">
          File content (Monaco Editor unavailable - using fallback viewer)
        </div>
        <pre className="whitespace-pre-wrap break-words">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
};

interface CodePreviewProps {
  file: FileItem | null;
  webContainer?: {
    instance: WebContainer | null;
    isReady: boolean;
  };
  projectPreviewUrl?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ projectPreviewUrl, file, webContainer }) => {
  const [editorKey, setEditorKey] = useState<number>(0);
  const [isMonacoLoading, setIsMonacoLoading] = useState<boolean>(true);
  const [monacoError, setMonacoError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const editorRef = useRef<any>(null);
  const monacoTimeoutRef = useRef<number | null>(null);

  // Handle editor mounting
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setIsMonacoLoading(false);
    setMonacoError(null);
    setUseFallback(false);
    if (monacoTimeoutRef.current) {
      clearTimeout(monacoTimeoutRef.current);
    }
    console.log('Monaco Editor mounted successfully');
  };

  // Handle editor loading
  const handleEditorLoading = () => {
    setIsMonacoLoading(true);
    setMonacoError(null);
    setUseFallback(false);
    
    // Set timeout for Monaco loading
    monacoTimeoutRef.current = setTimeout(() => {
      console.warn('Monaco Editor loading timeout, switching to fallback viewer');
      setIsMonacoLoading(false);
      setUseFallback(true);
      setMonacoError('Monaco Editor loading timeout');
    }, 10000); // 10 second timeout
  };

  // Handle editor error
  const handleEditorValidationMarker = (markers: any) => {
    // Handle validation markers if needed
  };

  // Handle editor change for future editable mode
  const handleEditorChange = (value: string | undefined) => {
    // Handle editor content changes if needed
  };

  // Cleanup editor instance when unmounting or changing files
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
      if (monacoTimeoutRef.current) {
        clearTimeout(monacoTimeoutRef.current);
      }
    };
  }, [file]);

  // Update editorKey when file changes to force re-render of the Editor component
  useEffect(() => {
    if (file) {
      setEditorKey(prev => prev + 1);
      setUseFallback(false); // Reset fallback when switching files
      setMonacoError(null);
      setIsMonacoLoading(true);
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
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-gray-700 text-white`}
          >
            <Code2 className="h-4 w-4 mr-2" />
            Code
          </button>
        </div>
        <div className="ml-auto flex items-center">
          <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
            {file.type}
          </span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="relative h-full">
          {useFallback ? (
            <FallbackTextViewer content={file.content || ''} language={getLanguageId(file)} />
          ) : (
            <>
              {isMonacoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                  <div className="text-gray-400 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2 mx-auto"></div>
                    <p>Loading Monaco Editor...</p>
                    <p className="text-xs mt-1">Will fallback to simple viewer if this takes too long</p>
                  </div>
                </div>
              )}
              {monacoError && !useFallback && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                  <div className="text-red-400 text-center p-4">
                    <p className="mb-2">Failed to load code editor</p>
                    <p className="text-sm text-gray-500 mb-3">{monacoError}</p>
                    <div className="space-x-2">
                      <button 
                        onClick={() => {
                          setMonacoError(null);
                          setUseFallback(false);
                          setEditorKey(prev => prev + 1);
                          handleEditorLoading();
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Retry Monaco
                      </button>
                      <button 
                        onClick={() => {
                          setUseFallback(true);
                          setMonacoError(null);
                          setIsMonacoLoading(false);
                        }}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Use Simple Viewer
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <Editor
                key={editorKey}
                height="100%"
                language={getLanguageId(file)}
                value={file.content}
                theme="vs-dark"
                loading={<div className="text-gray-400">Loading...</div>}
                onMount={handleEditorDidMount}
                beforeMount={() => {
                  try {
                    handleEditorLoading();
                    // Configure Monaco before mounting
                    loader.config({
                      paths: {
                        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
                      }
                    });
                  } catch (error) {
                    console.error('Monaco config error:', error);
                    setMonacoError(error instanceof Error ? error.message : 'Configuration failed');
                  }
                }}
                onChange={handleEditorChange}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  theme: 'vs-dark',
                  contextmenu: false,
                  selectOnLineNumbers: false,
                  glyphMargin: false,
                  folding: false,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePreview;