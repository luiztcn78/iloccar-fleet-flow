import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Plus, Edit, Trash2, Calendar, Users, DollarSign } from 'lucide-react';
import { Vehicle, Reservation } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useRealtime } from '@/hooks/useRealtime';
import { useToast } from '@/hooks/use-toast';

export const FuncionarioDashboard: React.FC = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    modelo: '',
    marca: '',
    ano: new Date().getFullYear(),
    placa: '',
    categoria: '',
    valorDiaria: 0,
    status: 'disponivel' as 'disponivel' | 'alugado' | 'manutencao',
    combustivel: 'flex',
    transmissao: 'manual',
    portas: 4,
    arCondicionado: true
  });

  // Load vehicles from Supabase
  const loadVehicles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');

      if (error) throw error;

      const formattedVehicles: Vehicle[] = data?.map(vehicle => ({
        id: vehicle.id,
        modelo: vehicle.model,
        marca: vehicle.brand,
        ano: vehicle.year,
        placa: vehicle.plate,
        categoria: vehicle.category,
        valorDiaria: parseFloat(vehicle.daily_rate),
        status: vehicle.status,
        imagem: vehicle.image_url || '/placeholder.svg',
        combustivel: vehicle.fuel_type,
        transmissao: vehicle.transmission,
        portas: vehicle.doors,
        arCondicionado: vehicle.air_conditioning,
        cor: '',
        caracteristicas: []
      })) || [];

      setVehicles(formattedVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  }, []);

  // Load reservations from Supabase
  const loadReservations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          vehicles (*),
          users (name, email)
        `);

      if (error) throw error;

      const formattedReservations: Reservation[] = data?.map(reservation => ({
        id: reservation.id,
        clienteId: reservation.user_id,
        veiculoId: reservation.vehicle_id,
        dataInicio: reservation.start_date,
        dataFim: reservation.end_date,
        valorTotal: parseFloat(reservation.total_amount),
        status: reservation.status === 'ativa' ? 'confirmada' : reservation.status,
        dataCriacao: reservation.created_at,
        cliente: {
          nome: reservation.users?.name || 'Unknown',
          email: reservation.users?.email || ''
        },
        veiculo: {
          modelo: reservation.vehicles.model,
          placa: reservation.vehicles.plate
        }
      })) || [];

      setReservations(formattedReservations);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
    loadReservations();
  }, [loadVehicles, loadReservations]);

  // Real-time updates for vehicles
  useRealtime('vehicles', '*', (payload) => {
    console.log('Vehicle change detected:', payload);
    loadVehicles();
  });

  // Real-time updates for reservations
  useRealtime('reservations', '*', (payload) => {
    console.log('Reservation change detected:', payload);
    loadReservations();
    
    if (payload.eventType === 'INSERT') {
      toast({
        title: "Nova Reserva!",
        description: `Uma nova reserva foi criada.`,
      });
    }
  });

  // Calculate statistics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'disponivel').length;
  const rentedVehicles = vehicles.filter(v => v.status === 'alugado').length;
  const activeReservations = reservations.filter(r => r.status === 'confirmada').length;

  const handleAddVehicle = async () => {
    if (!vehicleForm.modelo || !vehicleForm.marca || !vehicleForm.placa) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          model: vehicleForm.modelo,
          brand: vehicleForm.marca,
          year: vehicleForm.ano,
          plate: vehicleForm.placa,
          category: vehicleForm.categoria,
          daily_rate: vehicleForm.valorDiaria,
          status: vehicleForm.status,
          fuel_type: vehicleForm.combustivel,
          transmission: vehicleForm.transmissao,
          doors: vehicleForm.portas,
          air_conditioning: vehicleForm.arCondicionado
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Veículo adicionado com sucesso!",
      });

      setIsAddingVehicle(false);
      setVehicleForm({
        modelo: '',
        marca: '',
        ano: new Date().getFullYear(),
        placa: '',
        categoria: '',
        valorDiaria: 0,
        status: 'disponivel',
        combustivel: 'flex',
        transmissao: 'manual',
        portas: 4,
        arCondicionado: true
      });
      
      await loadVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o veículo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'default';
      case 'alugado':
        return 'destructive';
      case 'manutencao':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'alugado':
        return 'Alugado';
      case 'manutencao':
        return 'Manutenção';
      default:
        return status;
    }
  };

  return (
    <Layout title="Dashboard Funcionário">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel do Funcionário
          </h1>
          <p className="text-muted-foreground">
            Gerencie a frota e monitore as reservas
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Veículos</p>
                  <p className="text-2xl font-bold">{totalVehicles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disponíveis</p>
                  <p className="text-2xl font-bold text-green-600">{availableVehicles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alugados</p>
                  <p className="text-2xl font-bold text-orange-600">{rentedVehicles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reservas Ativas</p>
                  <p className="text-2xl font-bold text-blue-600">{activeReservations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Gestão da Frota
            </CardTitle>
            <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Veículo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Veículo</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do veículo para adicioná-lo à frota.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="marca">Marca *</Label>
                    <Input
                      id="marca"
                      value={vehicleForm.marca}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, marca: e.target.value }))}
                      placeholder="Toyota"
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
                    <Label htmlFor="placa">Placa *</Label>
                    <Input
                      id="placa"
                      value={vehicleForm.placa}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, placa: e.target.value }))}
                      placeholder="ABC-1234"
                    />
                  </div>

                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select
                      value={vehicleForm.categoria}
                      onValueChange={(value) => setVehicleForm(prev => ({ ...prev, categoria: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economico">Econômico</SelectItem>
                        <SelectItem value="compacto">Compacto</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="executivo">Executivo</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="luxo">Luxo</SelectItem>
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
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddVehicle} disabled={loading} className="flex-1">
                    {loading ? 'Adicionando...' : 'Adicionar Veículo'}
                  </Button>
                  <Button 
                    onClick={() => setIsAddingVehicle(false)} 
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor/Dia</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.marca} {vehicle.modelo}
                    </TableCell>
                    <TableCell>{vehicle.placa}</TableCell>
                    <TableCell className="capitalize">{vehicle.categoria}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(vehicle.status)}>
                        {getStatusLabel(vehicle.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>R$ {vehicle.valorDiaria}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsEditingVehicle(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Reservations Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Gestão de Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">#{reservation.id.slice(0, 8)}</TableCell>
                    <TableCell>{reservation.cliente?.nome || 'N/A'}</TableCell>
                    <TableCell>{reservation.veiculo?.modelo || 'N/A'}</TableCell>
                    <TableCell>
                      {reservation.dataInicio} - {reservation.dataFim}
                    </TableCell>
                    <TableCell>R$ {reservation.valorTotal}</TableCell>
                    <TableCell>
                      <Badge variant={reservation.status === 'confirmada' ? 'default' : 'secondary'}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};