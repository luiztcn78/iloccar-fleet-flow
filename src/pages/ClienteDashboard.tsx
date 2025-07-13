import React, { useState, useMemo } from 'react';
import { Search, Calendar, Car } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { VehicleCard } from '@/components/VehicleCard';
import { VehicleSearch } from '@/components/VehicleSearch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Vehicle, SearchFilters, Reservation } from '@/types';
import { mockVehicles, mockReservations } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export function ClienteDashboard() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [reservationDates, setReservationDates] = useState({
    dataInicio: '',
    dataFim: ''
  });
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Filter vehicles based on search criteria
  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter(vehicle => {
      if (searchFilters.categoria && vehicle.categoria !== searchFilters.categoria) {
        return false;
      }
      if (searchFilters.valorMaximo && vehicle.valorDiaria > searchFilters.valorMaximo) {
        return false;
      }
      // In real app, would check date availability against reservations
      return vehicle.status === 'disponivel';
    });
  }, [searchFilters]);

  // Get user reservations
  const userReservations = mockReservations.filter(r => r.clienteId === user?.id);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsReservationDialogOpen(true);
  };

  const handleReservation = () => {
    if (!selectedVehicle || !reservationDates.dataInicio || !reservationDates.dataFim) {
      toast({
        title: 'Dados incompletos',
        description: 'Por favor, preencha todas as datas',
        variant: 'destructive'
      });
      return;
    }

    // Calculate days and total value
    const startDate = new Date(reservationDates.dataInicio);
    const endDate = new Date(reservationDates.dataFim);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalValue = days * selectedVehicle.valorDiaria;

    // In real app, would send to API
    toast({
      title: 'Reserva realizada com sucesso!',
      description: `Veículo ${selectedVehicle.modelo} reservado por ${days} dias. Total: R$ ${totalValue}`,
    });

    setIsReservationDialogOpen(false);
    setSelectedVehicle(null);
    setReservationDates({ dataInicio: '', dataFim: '' });
  };

  return (
    <Layout title="Painel do Cliente">
      <div className="space-y-8">
        {/* Search Section */}
        <section>
          <VehicleSearch
            filters={searchFilters}
            onSearch={setSearchFilters}
          />
        </section>

        {/* My Reservations */}
        <section>
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
                    <Label htmlFor="dataInicio">Data de Início</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={reservationDates.dataInicio}
                      onChange={(e) => setReservationDates(prev => ({ ...prev, dataInicio: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim">Data de Fim</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={reservationDates.dataFim}
                      onChange={(e) => setReservationDates(prev => ({ ...prev, dataFim: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleReservation} className="flex-1" variant="gradient">
                    Confirmar Reserva
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
}