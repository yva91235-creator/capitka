import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { useAuthStore } from './store/authStore';

// Lazy loaded pages for performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const Wallet = lazy(() => import('./pages/Wallet').then(m => ({ default: m.Wallet })));
const Referrals = lazy(() => import('./pages/Referrals').then(m => ({ default: m.Referrals })));
const KYC = lazy(() => import('./pages/KYC').then(m => ({ default: m.KYC })));
const Support = lazy(() => import('./pages/Support').then(m => ({ default: m.Support })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Academy = lazy(() => import('./pages/Academy').then(m => ({ default: m.Academy })));

const Loading = () => (
  <div className="min-h-screen bg-[#0A0C15] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin" />
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0A0C15] text-[#F1F5F9]">
    <Sidebar />
    <main className="lg:ml-[280px] p-4 md:p-6 lg:p-10 pt-20 lg:pt-10">{children}</main>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><MainLayout><Projects /></MainLayout></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><MainLayout><Wallet /></MainLayout></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><MainLayout><Referrals /></MainLayout></ProtectedRoute>} />
          <Route path="/kyc" element={<ProtectedRoute><MainLayout><KYC /></MainLayout></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><MainLayout><Support /></MainLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><MainLayout><Admin /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
          <Route path="/academy" element={<ProtectedRoute><MainLayout><Academy /></MainLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
