import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { VehicleSearch } from '@/components/VehicleSearch';
import { VehicleCard } from '@/components/VehicleCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Car, Clock, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Vehicle, Reservation } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const ClienteDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [reservationStep, setReservationStep] = useState<'search' | 'details' | 'confirm'>('search');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);

  // Load vehicles from Supabase
  const loadVehicles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'disponivel');

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
      setFilteredVehicles(formattedVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os veículos.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Load user reservations
  const loadReservations = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          vehicles (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedReservations: Reservation[] = data?.map(reservation => ({
        id: reservation.id,
        clienteId: reservation.user_id,
        veiculoId: reservation.vehicle_id,
        dataInicio: reservation.start_date,
        dataFim: reservation.end_date,
        valorTotal: parseFloat(reservation.total_amount),
        status: reservation.status === 'ativa' ? 'confirmada' : reservation.status,
        dataCriacao: reservation.created_at
      })) || [];

      setUserReservations(formattedReservations);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadVehicles();
    loadReservations();
  }, [loadVehicles, loadReservations]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsReservationDialogOpen(true);
  };

  const handleReserve = async () => {
    if (!selectedVehicle || !startDate || !endDate || !user?.id) return;

    setLoading(true);
    try {
      // Calculate total amount
      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = days * selectedVehicle.valorDiaria;

      // Create reservation in database
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          user_id: user.id,
          vehicle_id: selectedVehicle.id,
          start_date: startDate,
          end_date: endDate,
          total_amount: totalAmount,
          status: 'ativa'
        })
        .select()
        .single();

      if (error) throw error;

      // Reset form
      setSelectedVehicle(null);
      setStartDate('');
      setEndDate('');
      setIsReservationDialogOpen(false);
      
      // Reload data
      await loadVehicles();
      await loadReservations();

      toast({
        title: "Sucesso!",
        description: "Reserva realizada com sucesso!",
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar a reserva. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: any) => {
    let filtered = vehicles;
    
    if (filters.category) {
      filtered = filtered.filter(v => v.categoria === filters.category);
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(v => v.valorDiaria <= filters.maxPrice);
    }
    
    setFilteredVehicles(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Encontre o veículo perfeito para sua próxima viagem
          </p>
        </div>

        {/* Search Section */}
        <VehicleSearch onSearch={handleSearch} />

        {/* My Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Minhas Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userReservations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Você ainda não possui reservas
              </p>
            ) : (
              <div className="space-y-4">
                {userReservations.map((reservation) => (
                  <div key={reservation.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Reserva #{reservation.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.dataInicio} até {reservation.dataFim}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          R$ {reservation.valorTotal}
                        </p>
                      </div>
                      <Badge variant={reservation.status === 'confirmada' ? 'default' : 'secondary'}>
                        {reservation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Vehicles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Car className="h-5 w-5" />
              Veículos Disponíveis ({filteredVehicles.length})
            </h3>
          </div>

          {filteredVehicles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum veículo encontrado com os filtros selecionados
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onSelect={handleVehicleSelect}
                  showActions
                />
              ))}
            </div>
          )}
        </section>

        {/* Reservation Dialog */}
        <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reservar Veículo</DialogTitle>
            </DialogHeader>
            
            {selectedVehicle && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium">{selectedVehicle.modelo}</h4>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.placa}</p>
                  <p className="text-lg font-bold text-primary">
                    R$ {selectedVehicle.valorDiaria}/dia
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data de Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleReserve}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : 'Confirmar Reserva'}
                  </Button>
                  <Button 
                    onClick={() => setIsReservationDialogOpen(false)} 
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};