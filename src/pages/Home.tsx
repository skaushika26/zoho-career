import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { MessageCircle, LogOut, Zap } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="flex justify-between items-center p-8 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">CareerBot</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.email}</span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-12 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">Welcome to Your Career Journey</h2>
                <p className="text-slate-400 text-lg">
                  Get ready to showcase your skills for Zoho internship opportunities. Our AI-powered career assistant will guide you through a series of technical assessments.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Chat with AI</h3>
                  <p className="text-sm text-slate-400">Get personalized role recommendations</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Coding Challenge</h3>
                  <p className="text-sm text-slate-400">Build real-world projects</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">HR Dashboard</h3>
                  <p className="text-sm text-slate-400">Connect with HR if you qualify</p>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleStartChat}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold h-12 text-lg transition-all duration-300 shadow-lg shadow-blue-500/50 rounded-xl"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Start Chat with Career Assistant
                </Button>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-blue-400">Pro Tip:</span> Be honest about your skills and experience. Our AI will recommend the best role for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
