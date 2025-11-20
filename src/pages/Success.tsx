import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Success() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const confettiInstance = confetti.create(canvas, { resize: true, disableForReducedMotion: true });

      confettiInstance({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.3 },
        colors: ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899'],
      });

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-5" />

      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-12 shadow-2xl text-center">
          <div className="mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Congratulations!</h1>

          <p className="text-lg text-slate-300 mb-8">
            You've successfully completed the coding challenge with a score of 85/100!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-slate-400">Score</p>
              <p className="text-2xl font-bold text-blue-400">85/100</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-slate-400">Status</p>
              <p className="text-2xl font-bold text-green-400">Qualified</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
            <p className="text-sm text-slate-300">
              Our HR team has been notified about your successful submission. You'll receive an email shortly with next steps for the interview process.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold h-12"
            >
              <Zap className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">
            Thank you for using Zoho Career Assistant
          </p>
        </div>
      </div>
    </div>
  );
}
