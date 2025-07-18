import React from 'react';
import { Car, Calendar, Fuel, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  showActions?: boolean;
}

export function VehicleCard({ vehicle, onSelect, onEdit, showActions = false }: VehicleCardProps) {
  const getStatusIcon = (status: Vehicle['status']) => {
    switch (status) {
      case 'disponivel':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'alugado':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'manutencao':
        return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusVariant = (status: Vehicle['status']) => {
    switch (status) {
      case 'disponivel':
        return 'default';
      case 'alugado':
        return 'destructive';
      case 'manutencao':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: Vehicle['status']) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'alugado':
        return 'Alugado';
      case 'manutencao':
        return 'Manutenção';
    }
  };

  return (
    <Card className="w-full hover:shadow-elevated transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {vehicle.modelo}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{vehicle.placa}</p>
          </div>
          <Badge variant={getStatusVariant(vehicle.status)} className="flex items-center gap-1">
            {getStatusIcon(vehicle.status)}
            {getStatusText(vehicle.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Vehicle details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{vehicle.ano}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span>{vehicle.cor}</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <Badge variant="outline">{vehicle.categoria}</Badge>
          </div>

          {/* Features */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Características:</p>
            <div className="flex flex-wrap gap-1">
              {vehicle.caracteristicas.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                R$ {vehicle.valorDiaria}
              </p>
              <p className="text-sm text-muted-foreground">por dia</p>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-4">
              {onSelect && vehicle.status === 'disponivel' && (
                <Button
                  onClick={() => onSelect(vehicle)}
                  className="flex-1"
                  variant="gradient"
                >
                  Reservar
                </Button>
              )}
              {onEdit && (
                <Button
                  onClick={() => onEdit(vehicle)}
                  variant="outline"
                  className="flex-1"
                >
                  Editar
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}