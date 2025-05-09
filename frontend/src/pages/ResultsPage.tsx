import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ExecutionSteps from '../components/ExecutionSteps';
import { FileExplorer } from '../components/FileExplorer';
import CodePreview from '../components/CodePreview';
import Button from '../components/ui/Button';
import { FileItem, Step, StepType } from '../types';
import axios from 'axios';
import { parseXml } from '../utils/parseXML';

const ResultsPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(true);

  /**
   * This useEffect handles the dynamic file generation based on pending steps.
   * Here's how it works:
   * 
   * 1. File Creation Process:
   *    - Filters steps with "pending" status
   *    - For CreateFile type steps, processes the file path
   *    - Builds folder structure recursively as needed
   * 
   * 2. Path Processing:
   *    - Splits path into segments (e.g., "src/components/App.tsx" → ["src", "components", "App.tsx"])
   *    - Iterates through segments to create folders/files
   *    - Maintains correct hierarchy using children arrays
   * 
   * 3. Structure Building:
   *    - For non-final segments: Creates folders if they don't exist
   *    - For final segment: Creates/updates file with provided code
   *    - Tracks current position in hierarchy using currentFileStructure
   * 
   * 4. State Updates:
   *    - Updates fileItems with new file structure
   *    - Marks all processed steps as "completed"
   */
  useEffect(() => {
    let originalFiles = [...fileItems];
    let updateHappened = false;
    // Filter steps that are pending and process each one
    // This operation finds all steps marked as "pending" and triggers file creation
    // The map function is used here to process each step, though we don't collect its return value
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;

        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }

            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    })

    if (updateHappened) {
      setFileItems(originalFiles);
      setSteps(steps => steps.map((s: Step) => ({
        ...s,
        status: "completed"
      })));
    }
  }, [steps, fileItems]);

  const Initialize = async () => {
    try {
      const savedPrompt = localStorage.getItem('currentPrompt');
      if (savedPrompt) {
        const response = await axios.post('http://localhost:3000/template', {
          prompt: savedPrompt.trim()
        });

        const {prompts, uiPrompts} = response.data;

        setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
          ...x,
          status: "pending"
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Enable dark mode
    document.documentElement.classList.add('dark');

    // Retrieve the prompt from local storage
    const savedPrompt = localStorage.getItem('currentPrompt');
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
    Initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12 px-4 container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/" className="text-gray-400 hover:text-blue-400 mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Building Your Website</h1>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              className="mr-3"
              disabled={isGenerating}
              icon={<ExternalLink className="h-4 w-4" />}
            >
              Preview Site
            </Button>
            
            <Button 
              disabled={isGenerating}
            >
              Download Code
            </Button>
          </div>
        </div>
        
        {prompt && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-8 shadow-sm">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Your Prompt</h2>
            <p className="text-gray-200">{prompt}</p>
          </div>
        )}
        
        <div className="flex flex-row gap-4 h-[calc(100vh-300px)]">
          {/* ExecutionSteps - 25% width */}
          <div className="w-1/4 overflow-auto pr-2" style={{ maxHeight: '100%' }}>
            <ExecutionSteps steps={steps} currentStepId={currentStepId} />
          </div>
          
          {/* FileExplorer - 25% width */}
          <div className="w-1/4 overflow-auto">
            <FileExplorer 
              files={fileItems} 
              onFileSelect={(fileItem) => setSelectedFile(fileItem)} 
            />
          </div>
          
          {/* CodePreview - 50% width */}
          <div className="w-1/2">
            <CodePreview file={selectedFile} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;