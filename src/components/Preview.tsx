import { useState, useEffect, useRef } from 'react';
import { useContest } from '../contexts/ContestContext';
import { RefreshCw } from 'lucide-react';

export default function Preview() {
  const { htmlCode, cssCode, jsCode } = useContest();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mergeCode = () => {
    const combinedHtml = htmlCode.replace(
      '</body>',
      `<style>${cssCode}</style><script>${jsCode}<\/script></body>`
    );
    return combinedHtml;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updatePreview();
    }, 1000);

    return () => clearInterval(interval);
  }, [htmlCode, cssCode, jsCode]);

  const updatePreview = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const mergedCode = mergeCode();
      const doc = iframe.contentDocument;

      if (doc) {
        doc.open();
        doc.write(mergedCode);
        doc.close();
        setError(null);
      }
    } catch (err) {
      setError('Error rendering preview');
    }
  };

  const handleManualRefresh = () => {
    setRefreshCount(prev => prev + 1);
    updatePreview();
  };

  return (
    <div className="h-full bg-slate-900 rounded-lg border border-blue-500/20 overflow-hidden flex flex-col">
      <div className="px-4 py-2 bg-slate-800/50 border-b border-blue-500/20 flex items-center justify-between">
        <span className="text-sm text-slate-400">Live Preview</span>
        <button
          onClick={handleManualRefresh}
          className="p-1.5 hover:bg-slate-700/50 rounded transition-colors"
          title="Refresh preview"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-slate-950">
        {error ? (
          <div className="p-4 text-red-400 text-sm">{error}</div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none"
            sandbox={{
              allowSameOrigin: true,
              allowScripts: true,
              allowForms: true,
              allowPopups: true,
            }}
            title="Live Preview"
          />
        )}
      </div>

      <div className="px-4 py-2 bg-slate-800/50 border-t border-blue-500/20 text-xs text-slate-500">
        Refreshes: {refreshCount} | Auto-update enabled
      </div>
    </div>
  );
}
