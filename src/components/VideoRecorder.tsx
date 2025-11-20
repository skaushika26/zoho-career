import { useEffect, useRef, useState } from 'react';
import { useContest } from '../contexts/ContestContext';
import { Circle } from 'lucide-react';

export default function VideoRecorder() {
  const { isRecording, setIsRecording } = useContest();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setHasPermission(true);

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8',
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: 'video/webm',
          });
          (window as any).recordedVideoBlob = blob;
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to access camera:', err);
        setHasPermission(false);
      }
    };

    startRecording();

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        const stream = (videoRef.current?.srcObject as MediaStream);
        stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, [setIsRecording]);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {hasPermission ? (
        <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-2 shadow-lg">
          <div className="relative w-20 h-20">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full rounded bg-black object-cover"
            />
            {isRecording && (
              <div className="absolute inset-0 rounded animate-pulse">
                <Circle className="w-4 h-4 text-red-500 absolute bottom-1 right-1 fill-current animate-pulse" />
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 text-center mt-1">Recording</p>
        </div>
      ) : (
        <div className="text-xs text-slate-500 text-center p-2">
          Camera access denied
        </div>
      )}
    </div>
  );
}
