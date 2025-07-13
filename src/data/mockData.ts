// Mock data for iLoccar system

import { User, Vehicle, Reservation, Cliente, Funcionario } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    senha: 'senha123',
    role: 'cliente',
    cpf: '123.456.789-00',
    cnh: '12345678901',
    dataNascimento: '1990-05-15',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@iloccar.com',
    telefone: '(11) 88888-8888',
    senha: 'func123',
    role: 'funcionario',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    nome: 'Admin Sistema',
    email: 'admin@iloccar.com',
    telefone: '(11) 77777-7777',
    senha: 'admin123',
    role: 'administrador',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    placa: 'ABC-1234',
    modelo: 'Volkswagen Gol',
    ano: 2023,
    cor: 'Branco',
    categoria: 'Econômico',
    valorDiaria: 80,
    status: 'disponivel',
    caracteristicas: ['Ar condicionado', 'Direção hidráulica', '4 portas'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    placa: 'DEF-5678',
    modelo: 'Honda Civic',
    ano: 2022,
    cor: 'Prata',
    categoria: 'Intermediário',
    valorDiaria: 120,
    status: 'disponivel',
    caracteristicas: ['Ar condicionado', 'Câmbio automático', 'GPS', 'Bluetooth'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    placa: 'GHI-9012',
    modelo: 'Toyota Corolla',
    ano: 2023,
    cor: 'Preto',
    categoria: 'Executivo',
    valorDiaria: 150,
    status: 'alugado',
    caracteristicas: ['Ar condicionado', 'Câmbio automático', 'GPS', 'Banco de couro'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    placa: 'JKL-3456',
    modelo: 'Chevrolet Onix',
    ano: 2023,
    cor: 'Vermelho',
    categoria: 'Econômico',
    valorDiaria: 75,
    status: 'disponivel',
    caracteristicas: ['Ar condicionado', 'Direção elétrica', 'Bluetooth'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    placa: 'MNO-7890',
    modelo: 'Ford EcoSport',
    ano: 2022,
    cor: 'Azul',
    categoria: 'SUV',
    valorDiaria: 140,
    status: 'manutencao',
    caracteristicas: ['Ar condicionado', '4x4', 'GPS', 'Porta-malas amplo'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: '1',
    clienteId: '1',
    vehicleId: '3',
    dataInicio: '2024-07-15',
    dataFim: '2024-07-20',
    valorTotal: 750,
    status: 'confirmada',
    createdAt: '2024-07-10T00:00:00Z',
    updatedAt: '2024-07-10T00:00:00Z'
  }
];

export const mockCategories = [
  'Econômico',
  'Intermediário',
  'Executivo',
  'SUV',
  'Premium'
];