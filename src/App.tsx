/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Tools = lazy(() => import('./pages/Tools'));
const Scripts = lazy(() => import('./pages/Scripts'));
const AppStore = lazy(() => import('./pages/AppStore'));
const Support = lazy(() => import('./pages/Support'));
const About = lazy(() => import('./pages/About'));
const Auth = lazy(() => import('./pages/Auth'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-dark">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-brand-purple/40 rounded-full animate-ping"></div>
      </div>
    </div>
  </div>
);

// Protected Route components
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0c',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px'
          }
        }}
      />
      <Router>
        <div className="min-h-screen flex flex-col relative">
          <Navbar />
          
          <main className="flex-grow pt-24">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/scripts" element={<Scripts />} />
                <Route path="/apps" element={<AppStore />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes */}
                <Route path="/support" element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

