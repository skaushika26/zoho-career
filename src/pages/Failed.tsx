import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Failed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-lg w-full">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-12 shadow-2xl text-center">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Challenge Not Passed</h1>

          <p className="text-lg text-slate-300 mb-8">
            Your score was 70/100. You need 80+ to qualify for the HR round. Don't worry though!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-slate-400">Your Score</p>
              <p className="text-2xl font-bold text-red-400">70/100</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-slate-400">Needed</p>
              <p className="text-2xl font-bold text-yellow-400">80/100</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-white mb-3">Areas to Improve:</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Practice CSS layout and responsive design</li>
              <li>• Improve JavaScript interactivity</li>
              <li>• Focus on code structure and best practices</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                window.location.href = '/chat';
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold h-12"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">
            You can attempt the challenge again anytime. Keep practicing!
          </p>
        </div>
      </div>
    </div>
  );
}
