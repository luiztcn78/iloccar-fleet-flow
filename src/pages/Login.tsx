import React from 'react';
import { Car } from 'lucide-react';
import { LoginForm } from '@/components/LoginForm';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left text-white space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <Car className="h-12 w-12" />
            <h1 className="text-4xl font-bold">iLoccar</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Gestão Inteligente de
              <br />
              <span className="text-secondary">Locação de Veículos</span>
            </h2>
            
            <p className="text-xl text-white/90 max-w-lg">
              Simplifique a gestão da sua frota e otimize o processo de reservas com nossa plataforma moderna e intuitiva.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-lg">Gestão Completa</h3>
              <p className="text-sm text-white/80">Controle total da frota</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-lg">Reservas Online</h3>
              <p className="text-sm text-white/80">Processo simplificado</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-lg">Relatórios</h3>
              <p className="text-sm text-white/80">Insights estratégicos</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex justify-center">
          <LoginForm onSuccess={onLoginSuccess} />
        </div>
      </div>
    </div>
  );
}