import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { uploadResume } from '../services/supabase';
import { toast } from 'sonner';
import { Upload, Zap } from 'lucide-react';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(droppedFile.type)) {
      setFile(droppedFile);
    } else {
      toast.error('Please upload a PDF or DOCX file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    try {
      await uploadResume(user.id, file);
      toast.success('Resume uploaded successfully!');
      setTimeout(() => navigate('/success'), 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSkip = () => {
    navigate('/success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-lg w-full">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold text-white">Upload Your Resume</h1>
          </div>

          <p className="text-center text-slate-300 mb-8">
            Great work! Now let's get your resume into our system so HR can review your profile.
          </p>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-blue-500/30 hover:border-blue-500/60 bg-slate-700/20'
            }`}
          >
            <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">Drag and drop your resume here</p>
            <p className="text-xs text-slate-500 mb-4">or</p>
            <label className="inline-block">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold">
                Click to browse
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-4">Supported formats: PDF, DOCX</p>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-slate-700/50 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3 bg-slate-600/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3 mt-8">
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold h-11"
            >
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">
            Your resume will be shared with our HR team for review
          </p>
        </div>
      </div>
    </div>
  );
}
