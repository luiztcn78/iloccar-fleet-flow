import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchFilters } from '@/types';
const mockCategories = ['economico', 'compacto', 'intermediario', 'executivo', 'suv', 'luxo'];

interface VehicleSearchProps {
  onSearch: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export function VehicleSearch({ onSearch, filters }: VehicleSearchProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    onSearch(localFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: SearchFilters = {};
    setLocalFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <Card className="w-full shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Buscar Veículos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={localFilters.categoria || 'all'}
              onValueChange={(value) => handleFilterChange('categoria', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Input
              type="date"
              value={localFilters.dataInicio || ''}
              onChange={(e) => handleFilterChange('dataInicio', e.target.value || undefined)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label>Data de Fim</Label>
            <Input
              type="date"
              value={localFilters.dataFim || ''}
              onChange={(e) => handleFilterChange('dataFim', e.target.value || undefined)}
            />
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <Label>Valor Máximo/Dia</Label>
            <Input
              type="number"
              placeholder="R$ 0,00"
              value={localFilters.valorMaximo || ''}
              onChange={(e) => handleFilterChange('valorMaximo', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSearch} className="flex-1" variant="gradient">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          <Button onClick={handleClearFilters} variant="outline">
            <Filter className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}