// iLoccar System Types

export type UserRole = 'cliente' | 'funcionario' | 'administrador';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  cpf?: string;
  cnh?: string;
  dataNascimento?: string;
  created_at?: string;
  updated_at?: string;
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
  plate: string;
  model: string;
  brand: string;
  year: number;
  category: string;
  daily_rate: number;
  status: VehicleStatus;
  image_url?: string;
  fuel_type: string;
  transmission: string;
  doors: number;
  air_conditioning: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ReservationStatus = 'pendente' | 'confirmada' | 'cancelada' | 'finalizada';

export interface Reservation {
  id: string;
  user_id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: ReservationStatus;
  cliente?: User;
  vehicle?: Vehicle;
  created_at?: string;
  updated_at?: string;
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