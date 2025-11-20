import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContest } from '../contexts/ContestContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import Timer from '../components/Timer';
import CodeEditor from '../components/CodeEditor';
import Preview from '../components/Preview';
import VideoRecorder from '../components/VideoRecorder';
import { submitContest, uploadVideo } from '../services/supabase';
import { toast } from 'sonner';
import { AlertCircle, Send } from 'lucide-react';

const CONTEST_TOPIC = 'Build a Coffee Shop Website';
const TOTAL_MINUTES = 60;

export default function ContestPage() {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const { user } = useAuth();
  const {
    htmlCode,
    cssCode,
    jsCode,
    cheatingFlags,
    incrementCheatingFlag,
    resetContest,
    isRecording,
  } = useContest();

  const [timeTaken, setTimeTaken] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [isAutoFailed, setIsAutoFailed] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementCheatingFlag('tabSwitches');
        setShowTabWarning(true);
        setTimeout(() => setShowTabWarning(false), 3000);

        if (cheatingFlags.tabSwitches >= 3) {
          setIsAutoFailed(true);
          toast.error('Too many tab switches. Contest auto-failed.');
        }
      }
    };

    const handleWindowBlur = () => {
      incrementCheatingFlag('windowBlurs');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [cheatingFlags.tabSwitches, incrementCheatingFlag]);

  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        incrementCheatingFlag('idleWarnings');
        setShowIdleWarning(true);
        setTimeout(() => setShowIdleWarning(false), 3000);
      }, 5 * 60 * 1000);
    };

    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);

    resetIdleTimer();

    return () => {
      document.removeEventListener('mousemove', resetIdleTimer);
      document.removeEventListener('keypress', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [incrementCheatingFlag]);

  const handleTimeUp = async () => {
    setShowSubmitDialog(true);
    await handleAutoSubmit();
  };

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    try {
      const timeTakenSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);

      let videoUrl: string | undefined;
      const videoBlob = (window as any).recordedVideoBlob;
      if (videoBlob && user) {
        try {
          videoUrl = await uploadVideo(user.id, videoBlob);
        } catch (err) {
          console.error('Failed to upload video:', err);
        }
      }

      const submission = await submitContest(
        user.id,
        contestId || 'default',
        htmlCode,
        cssCode,
        jsCode,
        timeTakenSecs,
        cheatingFlags,
        cheatingFlags.tabSwitches,
        videoUrl
      );

      if (submission.score >= 80) {
        navigate('/resume-upload', { state: { submission } });
      } else {
        navigate('/failed', { state: { submission } });
      }
    } catch (error: any) {
      toast.error('Failed to submit contest');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async () => {
    setShowSubmitDialog(false);
    await handleAutoSubmit();
  };

  if (isAutoFailed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Contest Auto-Failed</h2>
          <p className="text-slate-300 mb-6">Too many suspicious activities detected. Please try again later.</p>
          <Button onClick={() => navigate('/')} className="w-full bg-blue-600 hover:bg-blue-700">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="border-b border-blue-500/20 bg-slate-900/50 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{CONTEST_TOPIC}</h1>
            <p className="text-sm text-slate-400">Build this website using HTML, CSS, and JavaScript</p>
          </div>

          <div className="flex items-center gap-6">
            <Timer totalMinutes={TOTAL_MINUTES} onTimeUp={handleTimeUp} />
            <div className="text-sm text-slate-400">
              Tab Switches: <span className="text-blue-400 font-semibold">{cheatingFlags.tabSwitches}/3</span>
            </div>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        <ResizablePanel defaultSize={50} minSize={30}>
          <CodeEditor onAntiCheat={(flag) => incrementCheatingFlag(flag as any)} />
        </ResizablePanel>

        <ResizableHandle className="bg-blue-500/20 hover:bg-blue-500/40 transition-colors" />

        <ResizablePanel defaultSize={50} minSize={30}>
          <Preview />
        </ResizablePanel>
      </ResizablePanelGroup>

      <VideoRecorder />

      {showTabWarning && (
        <div className="fixed top-4 right-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-3 rounded-lg animate-fade-in-down">
          Warning: Tab switch detected ({cheatingFlags.tabSwitches}/3)
        </div>
      )}

      {showIdleWarning && (
        <div className="fixed top-4 right-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-lg animate-fade-in-down">
          You've been idle for 5 minutes. Keep coding!
        </div>
      )}

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="bg-slate-800/50 border-blue-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Submit Contest?</DialogTitle>
            <DialogDescription className="text-slate-300">
              Are you sure you want to submit your work? You can review the following:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="p-3 bg-slate-700/50 rounded border border-blue-500/20">
              <p className="text-sm text-slate-300">
                <span className="font-semibold">Tab Switches:</span> {cheatingFlags.tabSwitches}/3
              </p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-blue-500/20">
              <p className="text-sm text-slate-300">
                <span className="font-semibold">Copy/Paste Attempts:</span> {cheatingFlags.copyPasteAttempts}
              </p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-blue-500/20">
              <p className="text-sm text-slate-300">
                <span className="font-semibold">Right Clicks:</span> {cheatingFlags.rightClickCount}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button onClick={() => setShowSubmitDialog(false)} variant="outline" className="border-blue-500/30">
              Keep Coding
            </Button>
            <Button
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
