import React, { useState } from 'react';
import { Users, Car, Calendar, TrendingUp, FileText, Shield } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { User, Vehicle, Reservation } from '@/types';

export function AdminDashboard() {
  const [users] = useState<User[]>([]);
  const [vehicles] = useState<Vehicle[]>([]);
  const [reservations] = useState<Reservation[]>([]);

  // Advanced statistics
  const stats = {
    totalUsers: users.length,
    totalClients: users.filter(u => u.role === 'cliente').length,
    totalEmployees: users.filter(u => u.role === 'funcionario').length,
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'disponivel').length,
    rentedVehicles: vehicles.filter(v => v.status === 'alugado').length,
    totalReservations: reservations.length,
    activeReservations: reservations.filter(r => r.status === 'confirmada').length,
    revenue: reservations.reduce((sum, r) => sum + r.total_amount, 0),
    avgDailyRate: vehicles.reduce((sum, v) => sum + v.daily_rate, 0) / (vehicles.length || 1),
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'destructive';
      case 'funcionario':
        return 'secondary';
      case 'cliente':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'Admin';
      case 'funcionario':
        return 'Funcionário';
      case 'cliente':
        return 'Cliente';
      default:
        return role;
    }
  };

  return (
    <Layout title="Painel Administrativo">
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalClients} clientes • {stats.totalEmployees} funcionários
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Frota Total</p>
                  <p className="text-2xl font-bold">{stats.totalVehicles}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.availableVehicles} disponíveis • {stats.rentedVehicles} alugados
                  </p>
                </div>
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reservas</p>
                  <p className="text-2xl font-bold">{stats.totalReservations}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeReservations} ativas
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-success">R$ {stats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Média: R$ {stats.avgDailyRate.toFixed(0)}/dia
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestão de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Criado: {new Date(user.created_at || '').toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Fleet Overview */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Visão Geral da Frota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{vehicle.brand} {vehicle.model}</h4>
                        <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                      </div>
                      <Badge 
                        variant={
                          vehicle.status === 'disponivel' ? 'default' :
                          vehicle.status === 'alugado' ? 'destructive' : 'secondary'
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Categoria:</span> {vehicle.category}</p>
                      <p><span className="font-medium">Ano:</span> {vehicle.year}</p>
                      <p><span className="font-medium">Combustível:</span> {vehicle.fuel_type}</p>
                      <p><span className="font-medium">Valor/dia:</span> R$ {vehicle.daily_rate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* System Health */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4" />
                  Relatório de Faturamento
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4" />
                  Relatório de Ocupação da Frota
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4" />
                  Relatório de Clientes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disponibilidade</span>
                  <Badge variant="default">99.8%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tempo de Resposta</span>
                  <Badge variant="default">&lt; 300ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Última Atualização</span>
                  <span className="text-sm text-muted-foreground">Há 2 minutos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backups</span>
                  <Badge variant="default">Atualizados</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}