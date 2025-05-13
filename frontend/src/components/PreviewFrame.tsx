import { WebContainer } from '@webcontainer/api'; 
import { useEffect, useState } from 'react'; 

interface PreviewFrameProps { 
  files: any[]; 
  webContainer: WebContainer; 
} 

export function PreviewFrame({ webContainer }: PreviewFrameProps) {  
  const [url, setUrl] = useState(""); 

  async function main() { 
    const installProcess = await webContainer.spawn('npm', ['install']); 

    installProcess.output.pipeTo(new WritableStream({ 
      write(data) { 
        console.log(data); 
      } 
    })); 

    await webContainer.spawn('npm', ['run', 'dev']); 

    // Wait for `server-ready` event 
    webContainer.on('server-ready', (port, url) => { 
      // ... 
      console.log(url) 
      console.log(port) 
      setUrl(url); 
    }); 
  } 

  useEffect(() => { 
    main() 
  }, []) 
  return ( 
    <div className="h-full flex items-center justify-center text-gray-400"> 
      {!url && <div className="text-center"> 
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="animate-pulse">
            <p className="text-gray-500 mb-2">Creating project files...</p>
            <p className="text-gray-500 mb-2">Installing dependencies...</p>
            <p className="text-gray-500 mb-2">Starting development server...</p>
            <p className="text-sm text-gray-400">Estimated wait time: ~1:30 min</p>
          </div>
        </div>
      </div>} 
      {url && <iframe width={"100%"} height={"100%"} src={url} />} 
    </div> 
  ); 
}