import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Vehicle } from '@/types';
import { Car, Users, Fuel, Settings } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onReserve?: (vehicleId: string) => void;
  showReserveButton?: boolean;
}

const statusColors = {
  disponivel: 'bg-green-500/10 text-green-700 border-green-200',
  alugado: 'bg-red-500/10 text-red-700 border-red-200',
  manutencao: 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
};

const statusLabels = {
  disponivel: 'Disponível',
  alugado: 'Alugado', 
  manutencao: 'Manutenção'
};

export function VehicleCard({ vehicle, onReserve, showReserveButton = false }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {vehicle.brand} {vehicle.model}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Placa: {vehicle.plate}
            </p>
          </div>
          <Badge 
            variant="outline"
            className={statusColors[vehicle.status]}
          >
            {statusLabels[vehicle.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          {vehicle.image_url ? (
            <img 
              src={vehicle.image_url} 
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Car className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.year}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.transmission}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.doors} portas</span>
          </div>

          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.fuel_type}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-2xl font-bold text-primary">
            R$ {vehicle.daily_rate?.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">/dia</span>
          </div>
        </div>
      </CardContent>

      {showReserveButton && (
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => onReserve?.(vehicle.id)}
            disabled={vehicle.status !== 'disponivel'}
          >
            {vehicle.status === 'disponivel' ? 'Reservar' : 'Indisponível'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}