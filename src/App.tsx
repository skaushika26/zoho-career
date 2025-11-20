import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContestProvider } from './contexts/ContestContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Chat from './pages/Chat';
import ContestPage from './pages/ContestPage';
import ResumeUpload from './pages/ResumeUpload';
import Success from './pages/Success';
import Failed from './pages/Failed';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContestProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/contest/:contestId" element={<ProtectedRoute><ContestPage /></ProtectedRoute>} />
            <Route path="/resume-upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
            <Route path="/failed" element={<ProtectedRoute><Failed /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </ContestProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
