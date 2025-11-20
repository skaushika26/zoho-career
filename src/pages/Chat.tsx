import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  options?: { label: string; value: string }[];
  timestamp: Date;
}

type ConversationStep = 'greeting' | 'role-selection' | 'certification' | 'project-level' | 'contest-link';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationStep, setConversationStep] = useState<ConversationStep>('greeting');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedCertification, setSelectedCertification] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        type: 'bot',
        text: "Hi there! I'm your Zoho Career Assistant. Which role are you interested in pursuing?",
        options: [
          { label: '💻 Frontend Developer', value: 'frontend' },
          { label: '⚙️ Backend Developer', value: 'backend' },
          { label: '📊 Data Scientist', value: 'data-science' },
        ],
        timestamp: new Date(),
      };
      setMessages([greeting]);
      setConversationStep('role-selection');
    }
  }, []);

  const handleOptionClick = (option: { label: string; value: string }) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: option.label,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    if (conversationStep === 'role-selection') {
      setSelectedRole(option.value);
      setTimeout(() => {
        const certMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: `Great! ${option.label.split(' ')[1]} is an excellent choice. Do you have any certifications or relevant projects for this role?`,
          options: [
            { label: '✅ Yes, I have both', value: 'yes' },
            { label: '❌ No, I\'m starting out', value: 'no' },
          ],
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, certMessage]);
        setConversationStep('certification');
      }, 500);
    } else if (conversationStep === 'certification') {
      setSelectedCertification(option.value);
      if (option.value === 'yes') {
        setTimeout(() => {
          const levelMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'bot',
            text: 'Excellent! What level are your projects or certifications at?',
            options: [
              { label: '🌱 Beginner', value: 'beginner' },
              { label: '🌿 Intermediate', value: 'intermediate' },
              { label: '🌳 Advanced', value: 'advanced' },
            ],
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, levelMessage]);
          setConversationStep('project-level');
        }, 500);
      } else {
        setTimeout(() => {
          const levelMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'bot',
            text: 'No problem! You\'ll start with a beginner-level challenge. Let\'s assess your current skills.',
            options: [
              { label: '🌱 Continue to Challenge', value: 'beginner' },
            ],
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, levelMessage]);
          setSelectedLevel('beginner');
          setConversationStep('project-level');
        }, 500);
      }
    } else if (conversationStep === 'project-level') {
      setSelectedLevel(option.value);
      setTimeout(() => {
        const contestMessage: Message = {
          id: (Date.now() + 3).toString(),
          type: 'bot',
          text: `Perfect! I've prepared a ${option.value} challenge for you: "Build a Coffee Shop Website". You'll have 60 minutes to complete this project. Click the button below to start the coding challenge!`,
          options: [
            { label: '🚀 Start Coding Challenge', value: 'start-contest' },
          ],
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, contestMessage]);
        setConversationStep('contest-link');
      }, 500);
    } else if (conversationStep === 'contest-link' && option.value === 'start-contest') {
      const contestId = `contest-${Date.now()}`;
      navigate(`/contest/${contestId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="border-b border-blue-500/20 p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'} animate-fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'bot'
                  ? 'bg-slate-800/50 border border-blue-500/30 text-slate-100'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
              } shadow-lg`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {conversationStep !== 'contest-link' && messages[messages.length - 1]?.options && (
          <div className="flex justify-start space-y-2">
            <div className="space-y-2 w-full">
              {messages[messages.length - 1].options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className="w-full text-left px-4 py-3 bg-slate-800/50 border border-blue-500/30 hover:border-blue-500/60 hover:bg-slate-800/70 rounded-lg text-slate-100 transition-all duration-200 text-sm"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {conversationStep === 'contest-link' && messages[messages.length - 1]?.options && (
          <div className="flex justify-start">
            <button
              onClick={() => handleOptionClick(messages[messages.length - 1].options![0])}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/50"
            >
              {messages[messages.length - 1].options![0].label}
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
