import React, { useState } from 'react';
import { Car, Plus, Calendar, BarChart3 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { VehicleCard } from '@/components/VehicleCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Vehicle, Reservation } from '@/types';
import { mockVehicles, mockReservations, mockCategories } from '@/data/mockData';

export function FuncionarioDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    placa: '',
    modelo: '',
    ano: new Date().getFullYear(),
    cor: '',
    categoria: '',
    valorDiaria: 0,
    status: 'disponivel' as Vehicle['status'],
    caracteristicas: [] as string[],
  });
  const { toast } = useToast();

  const reservations = mockReservations;

  // Stats
  const stats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'disponivel').length,
    rentedVehicles: vehicles.filter(v => v.status === 'alugado').length,
    maintenanceVehicles: vehicles.filter(v => v.status === 'manutencao').length,
    activeReservations: reservations.filter(r => r.status === 'confirmada').length,
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({
      placa: '',
      modelo: '',
      ano: new Date().getFullYear(),
      cor: '',
      categoria: '',
      valorDiaria: 0,
      status: 'disponivel',
      caracteristicas: [],
    });
    setIsVehicleDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      placa: vehicle.placa,
      modelo: vehicle.modelo,
      ano: vehicle.ano,
      cor: vehicle.cor,
      categoria: vehicle.categoria,
      valorDiaria: vehicle.valorDiaria,
      status: vehicle.status,
      caracteristicas: vehicle.caracteristicas,
    });
    setIsVehicleDialogOpen(true);
  };

  const handleSaveVehicle = () => {
    if (!vehicleForm.placa || !vehicleForm.modelo || !vehicleForm.categoria) {
      toast({
        title: 'Dados incompletos',
        description: 'Por favor, preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    if (editingVehicle) {
      // Edit existing vehicle
      setVehicles(prev => prev.map(v => 
        v.id === editingVehicle.id 
          ? { ...v, ...vehicleForm, updatedAt: new Date().toISOString() }
          : v
      ));
      toast({
        title: 'Veículo atualizado!',
        description: `${vehicleForm.modelo} foi atualizado com sucesso`,
      });
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: (vehicles.length + 1).toString(),
        ...vehicleForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVehicles(prev => [...prev, newVehicle]);
      toast({
        title: 'Veículo adicionado!',
        description: `${vehicleForm.modelo} foi adicionado à frota`,
      });
    }

    setIsVehicleDialogOpen(false);
  };

  const handleCharacteristicAdd = (characteristic: string) => {
    if (characteristic && !vehicleForm.caracteristicas.includes(characteristic)) {
      setVehicleForm(prev => ({
        ...prev,
        caracteristicas: [...prev.caracteristicas, characteristic]
      }));
    }
  };

  const handleCharacteristicRemove = (index: number) => {
    setVehicleForm(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index)
    }));
  };

  return (
    <Layout title="Painel do Funcionário">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Veículos</p>
                  <p className="text-2xl font-bold">{stats.totalVehicles}</p>
                </div>
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disponíveis</p>
                  <p className="text-2xl font-bold text-success">{stats.availableVehicles}</p>
                </div>
                <div className="h-8 w-8 bg-success rounded-full flex items-center justify-center">
                  <span className="text-success-foreground text-sm font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alugados</p>
                  <p className="text-2xl font-bold text-destructive">{stats.rentedVehicles}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Manutenção</p>
                  <p className="text-2xl font-bold text-warning">{stats.maintenanceVehicles}</p>
                </div>
                <div className="h-8 w-8 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-warning-foreground text-sm font-bold">!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reservas Ativas</p>
                  <p className="text-2xl font-bold text-primary">{stats.activeReservations}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Management */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Gestão da Frota</h3>
            <Button onClick={handleAddVehicle} variant="gradient">
              <Plus className="h-4 w-4" />
              Adicionar Veículo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEditVehicle}
                showActions
              />
            ))}
          </div>
        </section>

        {/* Recent Reservations */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Reservas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {reservations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma reserva encontrada
                </p>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="flex justify-between items-center border-b pb-4">
                      <div>
                        <p className="font-medium">Reserva #{reservation.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.dataInicio} - {reservation.dataFim}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Cliente ID: {reservation.clienteId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">R$ {reservation.valorTotal}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'confirmada' ? 'bg-success text-success-foreground' :
                          reservation.status === 'pendente' ? 'bg-warning text-warning-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {reservation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Vehicle Dialog */}
        <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="placa">Placa *</Label>
                <Input
                  id="placa"
                  value={vehicleForm.placa}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, placa: e.target.value }))}
                  placeholder="ABC-1234"
                />
              </div>

              <div>
                <Label htmlFor="modelo">Modelo *</Label>
                <Input
                  id="modelo"
                  value={vehicleForm.modelo}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, modelo: e.target.value }))}
                  placeholder="Toyota Corolla"
                />
              </div>

              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  value={vehicleForm.ano}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, ano: Number(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  value={vehicleForm.cor}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, cor: e.target.value }))}
                  placeholder="Branco"
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={vehicleForm.categoria}
                  onValueChange={(value) => setVehicleForm(prev => ({ ...prev, categoria: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="valorDiaria">Valor por Dia (R$)</Label>
                <Input
                  id="valorDiaria"
                  type="number"
                  value={vehicleForm.valorDiaria}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, valorDiaria: Number(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={vehicleForm.status}
                  onValueChange={(value) => setVehicleForm(prev => ({ ...prev, status: value as Vehicle['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="alugado">Alugado</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Características</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {vehicleForm.caracteristicas.map((char, index) => (
                  <span
                    key={index}
                    className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs cursor-pointer"
                    onClick={() => handleCharacteristicRemove(index)}
                  >
                    {char} ×
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite uma característica e pressione Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCharacteristicAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveVehicle} className="flex-1" variant="gradient">
                {editingVehicle ? 'Atualizar' : 'Adicionar'} Veículo
              </Button>
              <Button 
                onClick={() => setIsVehicleDialogOpen(false)} 
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}