import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useContest } from '../contexts/ContestContext';

interface CodeEditorProps {
  onAntiCheat: (flag: string) => void;
}

export default function CodeEditor({ onAntiCheat }: CodeEditorProps) {
  const { htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode } = useContest();
  const [editorTheme] = useState('vs-dark');
  const [autoSaveCount, setAutoSaveCount] = useState(0);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onAntiCheat('rightClickCount');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'v')) {
        e.preventDefault();
        onAntiCheat('copyPasteAttempts');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAntiCheat]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      setAutoSaveCount(prev => prev + 1);
    }, 2000);

    return () => clearInterval(autoSaveInterval);
  }, []);

  return (
    <div className="h-full bg-slate-900 rounded-lg border border-blue-500/20 overflow-hidden flex flex-col">
      <div className="px-4 py-2 bg-slate-800/50 border-b border-blue-500/20 flex items-center justify-between">
        <span className="text-sm text-slate-400">HTML • CSS • JavaScript</span>
        <span className="text-xs text-slate-500">Auto-saved: {autoSaveCount}</span>
      </div>

      <Tabs defaultValue="html" className="flex-1 flex flex-col">
        <TabsList className="bg-slate-800/50 border-b border-blue-500/20 rounded-none px-4 py-0 h-auto gap-0">
          <TabsTrigger
            value="html"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 px-4 py-2"
          >
            HTML
          </TabsTrigger>
          <TabsTrigger
            value="css"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 px-4 py-2"
          >
            CSS
          </TabsTrigger>
          <TabsTrigger
            value="js"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 px-4 py-2"
          >
            JavaScript
          </TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="flex-1 m-0">
          <Editor
            height="100%"
            defaultLanguage="html"
            value={htmlCode}
            onChange={(value) => setHtmlCode(value || '')}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              contextmenu: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              fontSize: 13,
            }}
          />
        </TabsContent>

        <TabsContent value="css" className="flex-1 m-0">
          <Editor
            height="100%"
            defaultLanguage="css"
            value={cssCode}
            onChange={(value) => setCssCode(value || '')}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              contextmenu: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              fontSize: 13,
            }}
          />
        </TabsContent>

        <TabsContent value="js" className="flex-1 m-0">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={jsCode}
            onChange={(value) => setJsCode(value || '')}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              contextmenu: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              fontSize: 13,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
