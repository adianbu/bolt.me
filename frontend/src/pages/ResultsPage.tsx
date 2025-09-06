import React, { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ExecutionSteps from "../components/ExecutionSteps";
import { FileExplorer } from "../components/FileExplorer";
import CodePreview from "../components/CodePreview";
import Button from "../components/ui/Button";
import { FileItem, Step, StepType } from "../types";
import axios from "axios";
import { parseXml } from "../utils/parseXML";
import { useWebContainer } from "../hooks/useWebContainer";
import { WebContainer } from "@webcontainer/api";
import { API_URL } from "../utils/config";

const ResultsPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [isWebContainerReady, setIsWebContainerReady] = useState(false);
  const [webContainerError, setWebContainerError] = useState<string | null>(
    null
  );
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [userPrompt, setUserPrompt] = useState<string>(""); // New state for follow-up prompt
  const [loading, setLoading] = useState<boolean>(false); // Loading state for follow-up prompt

  const webContainer = useWebContainer();

  // Track web container readiness
  useEffect(() => {
    if (webContainer) {
      setIsWebContainerReady(true);
    }
  }, [webContainer]);

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
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFileItems(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => ({
          ...s,
          status: "completed",
        }))
      );
      // Enable download button when files are ready
      setIsGenerating(false);
    }
  }, [steps, fileItems]);

  // Effect to write files to web container when it's ready and start the server
  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === "folder") {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processFile(child, false),
                  ])
                )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach((file) => processFile(file, true));

      return mountStructure;
    };

    const setupWebContainer = async () => {
      if (isWebContainerReady && webContainer && fileItems.length > 0) {
        try {
          // Create mount structure from files
          const mountStructure = createMountStructure(fileItems);

          console.log("Mount structure:", mountStructure);

          // Mount all files at once
          await webContainer.mount(mountStructure);

          // try {
          //   // Install dependencies
          //   console.log('Installing dependencies...');
          //   const installProcess = await webContainer.spawn('npm', ['install']);

          //   // Pipe install process output to console
          //   installProcess.output.pipeTo(new WritableStream({
          //     write(data) {
          //       console.log(data);
          //     }
          //   }));

          //   // Start dev server
          //   await webContainer.spawn('npm', ['run', 'dev']);

          //   // Listen for server-ready event
          //   webContainer.on('server-ready', (port, url) => {
          //     console.log('Server URL:', url);
          //     console.log('Server Port:', port);
          //     setPreviewUrl(url);
          //     setIsServerRunning(true);
          //     setIsGenerating(false);
          //   });

          // } catch (err) {
          //   console.error('Error setting up server:', err);
          //   setWebContainerError(err instanceof Error ? err.message : 'Failed to set up server');
          //   setIsGenerating(false);
          // }
        } catch (err) {
          console.error("Error mounting files to web container:", err);
          setWebContainerError(
            err instanceof Error
              ? err.message
              : "Failed to mount files to web container"
          );
          setIsGenerating(false);
        }
      }
    };

    setupWebContainer();
  }, [isWebContainerReady, webContainer, fileItems]);

  useEffect(() => {
    // Enable dark mode
    document.documentElement.classList.add("dark");

    // Retrieve the prompt from local storage
    const savedPrompt = localStorage.getItem("currentPrompt");
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
    if (savedPrompt) {
      Initialize(savedPrompt);
    }
  }, []);

  // Update the Initialize function to accept the prompt as a parameter
  const Initialize = async (savedPrompt: string) => {
    try {
      if (savedPrompt) {
        setLoading(true);
        //loads template
        const response = await axios.post(`${API_URL}geminiTemplate`, {
          prompt: savedPrompt.trim(),
        }, {
          headers: {
            Authorization: `Bearer abcd123`
          }
        });
  
        const { prompts, uiPrompts } = response.data;
  
        setSteps(
          parseXml(uiPrompts[0]).map((x: Step) => ({
            ...x,
            status: "pending",
          }))
        );
       
        //loads files for prompt
        const stepsResponse = await axios.post(`${API_URL}geminichat`, {
          messages: [...prompts, savedPrompt].map((content) => ({
            role: "user",
            content,
          })),
        }, {
          headers: {
            Authorization: `Bearer abcd123`
          }
        });
        
        setSteps((s) => [
          ...s,
          ...parseXml(stepsResponse.data.response).map((x) => ({
            ...x,
            status: "pending" as "pending",
          })),
        ]);

        setLlmMessages(
          [...prompts, prompt].map((content) => ({
            role: "user",
            content,
          }))
        );

        setLlmMessages((x) => [
          ...x,
          { role: "assistant", content: stepsResponse.data.response },
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setIsGenerating(false); // Enable download button after generation completes
    }
  };

  // Function to open preview in a new tab
  const openPreview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  // Function to handle follow-up prompt submission
  const handleFollowUpPrompt = async () => {
    if (!userPrompt.trim()) return;
    
    const newMessage = {
      role: "user" as "user",
      content: userPrompt
    };

    setLoading(true);
    try {
      const stepsResponse = await axios.post(`${API_URL}geminichat`, {
        messages: [...llmMessages, newMessage]
      }, {
        headers: {
          Authorization: `Bearer abcd123`
        }
      });

      setLlmMessages(x => [...x, newMessage]);
      setLlmMessages(x => [...x, {
        role: "assistant",
        content: stepsResponse.data.response
      }]);
      
      setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
        ...x,
        status: "pending" as "pending"
      }))]);

      // Clear the input after sending
      setUserPrompt("");
    } catch (error) {
      console.error("Error sending follow-up prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download functionality
  const downloadCode = async () => {
    console.log('Download function called');
    console.log('FileItems:', fileItems);
    console.log('FileItems length:', fileItems.length);
    
    // Enhanced validation
    if (!fileItems || fileItems.length === 0) {
      alert('No files available to download. Please generate a website first by entering a prompt.');
      return;
    }

    // Show loading state
    const button = document.querySelector('[data-download-button]') as HTMLButtonElement;
    const originalText = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = 'Preparing Download...';
    }

    try {
      console.log('Attempting to import JSZip...');
      // Use dynamic import for JSZip to reduce bundle size
      const JSZip = (await import('jszip')).default;
      console.log('JSZip imported successfully:', JSZip);
      const zip = new JSZip();
      
      let fileCount = 0;
      let folderCount = 0;

      // Add all files to the zip
      const addFilesToZip = (files: FileItem[], currentPath = '') => {
        files.forEach((file) => {
          const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
          console.log(`Processing: ${filePath} (type: ${file.type})`);
          
          if (file.type === 'folder' && file.children) {
            // Create folder and recursively add files
            folderCount++;
            console.log(`Creating folder: ${filePath}`);
            addFilesToZip(file.children, filePath);
          } else if (file.type === 'file') {
            // Add file to zip
            const content = file.content || '// Empty file';
            console.log(`Adding file: ${filePath} (${content.length} chars)`);
            zip.file(filePath, content);
            fileCount++;
          }
        });
      };

      addFilesToZip(fileItems);
      console.log(`Processing complete: ${fileCount} files, ${folderCount} folders`);
      
      if (fileCount === 0) {
        alert('No files found to download. The generated project might be empty.');
        return;
      }

      // Update button text
      if (button) {
        button.textContent = 'Creating ZIP...';
      }

      console.log('Generating zip file...');
      // Generate zip file
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        }
      });
      console.log('Zip file generated successfully, size:', content.size, 'bytes');
      
      // Update button text
      if (button) {
        button.textContent = 'Starting Download...';
      }

      // Create download link with better naming
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const projectName = prompt?.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) || 'website';
      const filename = `${projectName}-${timestamp}.zip`;
      
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Add to DOM and trigger download
      document.body.appendChild(link);
      console.log(`Triggering download: ${filename}`);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      // Success feedback
      console.log('Download completed successfully');
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 text-green-200">✓</div>
          <div>
            <div class="font-medium">Download Started!</div>
            <div class="text-sm opacity-90">${fileCount} files • ${filename}</div>
          </div>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        successDiv.remove();
      }, 3000);
      
    } catch (error) {
      console.error('Error creating zip file:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50';
      errorDiv.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 text-red-200">✗</div>
          <div>
            <div class="font-medium">Download Failed</div>
            <div class="text-sm opacity-90">${error instanceof Error ? error.message : 'Unknown error'}</div>
          </div>
        </div>
      `;
      document.body.appendChild(errorDiv);
      
      // Remove error message after 5 seconds
      setTimeout(() => {
        errorDiv.remove();
      }, 5000);
      
    } finally {
      // Reset button state
      if (button && originalText) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col w-full">
      <Header />

      <main className="flex-grow pt-24 pb-12 px-4 container mx-auto bg-gray-900 min-h-screen w-full">
        {webContainerError && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8 text-red-200">
            <p>Failed to initialize web container: {webContainerError}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <Link to="/" className="text-gray-400 hover:text-blue-400 mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Building Your Website
            </h1>
          </div>

          <div className="flex items-center w-full sm:w-auto space-x-3">
            <Button 
              disabled={isGenerating || fileItems.length === 0}
              className="flex-1 sm:flex-none"
              icon={<Download className="h-4 w-4" />}
              onClick={downloadCode}
              data-download-button="true"
            >
              Download Code
            </Button>
          </div>
        </div>

        {prompt && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-8 shadow-sm">
            <h2 className="text-sm font-medium text-gray-400 mb-2">
              Your Prompt
            </h2>
            <p className="text-gray-200 break-words">{prompt}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-200px)] bg-gray-900 w-full">
          {/* ExecutionSteps - Full width on mobile, 25% on desktop */}
          <div
            className="w-full lg:w-1/4 overflow-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-gray-900 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 min-h-[350px] lg:min-h-full bg-gray-900"
          >
            <ExecutionSteps steps={steps} currentStepId={currentStepId} />
            <div className="mt-6">
              {loading && (
                <div className="flex flex-col items-center justify-center space-y-3 bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <div className="flex flex-col items-center text-gray-300 text-sm">
                    <div className="animate-pulse">Creating files...</div>
                    <div className="animate-pulse delay-75">Generating code...</div>
                    <div className="animate-pulse delay-150">Building components...</div>
                  </div>
                </div>
              )}
            </div>
            {/* Follow-up prompt input */}
            <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Follow-up Prompt</h3>
              <div className="flex flex-col">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    <textarea 
                      value={userPrompt} 
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Enter a follow-up prompt..."
                      className="p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 mb-2 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button 
                      onClick={handleFollowUpPrompt}
                      disabled={loading || !userPrompt.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Send
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* FileExplorer - Full width on mobile, 25% on desktop */}
          <div className="w-full lg:w-1/4 overflow-auto min-h-[350px] lg:min-h-full bg-gray-900">
            <FileExplorer
              files={fileItems}
              onFileSelect={(fileItem) => setSelectedFile(fileItem)}
            />
          </div>

          {/* CodePreview - Smaller on mobile/tablet, 50% on desktop */}
          <div className="w-full lg:w-1/2 min-h-[350px] lg:min-h-full bg-gray-900">
            <CodePreview
              file={selectedFile}
              webContainer={{
                instance: webContainer || null,
                isReady: isWebContainerReady,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
