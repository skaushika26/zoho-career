import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  totalMinutes: number;
  onTimeUp: () => void;
}

export default function Timer({ totalMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 300) setIsWarning(true);
        if (newTime <= 60) setIsCritical(true);
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (totalMinutes * 60)) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
        isCritical
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : isWarning
          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
          : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      }`}>
        <Clock className="w-5 h-5" />
        <span className="font-mono font-semibold text-lg">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      <div className="hidden md:block flex-1 max-w-xs bg-slate-700/50 rounded-full h-2 overflow-hidden border border-blue-500/20">
        <div
          className={`h-full transition-all duration-300 ${
            isCritical
              ? 'bg-red-500'
              : isWarning
              ? 'bg-orange-500'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
