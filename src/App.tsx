import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import CreatePrescription from './views/CreatePrescription';
import Medications from './views/Medications';
import Transcription from './views/Transcription';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/prescription" element={
              <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
                <CreatePrescription />
              </ProtectedRoute>
            } />

            <Route path="/dosage" element={
              <ProtectedRoute>
                <Medications />
              </ProtectedRoute>
            } />

            <Route path="/transcricao" element={
              <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
                <Transcription />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
