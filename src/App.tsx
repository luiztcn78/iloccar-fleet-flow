import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "@/pages/Login";
import { ClienteDashboard } from "@/pages/ClienteDashboard";
import { FuncionarioDashboard } from "@/pages/FuncionarioDashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

function AppContent() {
  const { user, isLoading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Give time for auth context to initialize
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  // Route based on user role
  switch (user.role) {
    case 'cliente':
      return <ClienteDashboard />;
    case 'funcionario':
      return <FuncionarioDashboard />;
    case 'administrador':
      return <AdminDashboard />;
    default:
      return <LoginPage onLoginSuccess={() => {}} />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
