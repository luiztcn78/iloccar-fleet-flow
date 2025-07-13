// iLoccar System Types

export type UserRole = 'cliente' | 'funcionario' | 'administrador';

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  role: UserRole;
  cpf?: string; // Apenas para clientes
  cnh?: string; // Apenas para clientes
  dataNascimento?: string; // Apenas para clientes
  createdAt: string;
  updatedAt: string;
}

export interface Cliente extends User {
  role: 'cliente';
  cpf: string;
  cnh: string;
  dataNascimento: string;
}

export interface Funcionario extends User {
  role: 'funcionario' | 'administrador';
}

export type VehicleStatus = 'disponivel' | 'alugado' | 'manutencao';

export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  ano: number;
  cor: string;
  categoria: string;
  valorDiaria: number;
  status: VehicleStatus;
  foto?: string;
  caracteristicas: string[];
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 'pendente' | 'confirmada' | 'cancelada' | 'finalizada';

export interface Reservation {
  id: string;
  clienteId: string;
  vehicleId: string;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  status: ReservationStatus;
  cliente?: Cliente;
  vehicle?: Vehicle;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
  valorMaximo?: number;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}