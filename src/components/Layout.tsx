import React from 'react';
import { Car, LogOut, User, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-sidebar border-b border-sidebar-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-sidebar-foreground">iLoccar</h1>
            </div>

            {/* User info and logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sidebar-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs bg-primary px-2 py-1 rounded-full text-primary-foreground">
                  {user?.role}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>
        {children}
      </main>
    </div>
  );
}