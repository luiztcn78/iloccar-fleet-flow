-- Create users table for authentication and user management
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('cliente', 'funcionario', 'admin')),
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model TEXT NOT NULL,
  brand TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('economico', 'compacto', 'intermediario', 'executivo', 'suv', 'luxo')),
  daily_rate DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'alugado', 'manutencao')),
  image_url TEXT,
  fuel_type TEXT NOT NULL DEFAULT 'flex',
  transmission TEXT NOT NULL DEFAULT 'manual',
  doors INTEGER NOT NULL DEFAULT 4,
  air_conditioning BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create policies for vehicles table
CREATE POLICY "Everyone can view vehicles" ON public.vehicles
  FOR SELECT USING (true);

CREATE POLICY "Funcionarios and admins can manage vehicles" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text AND role IN ('funcionario', 'admin')
    )
  );

-- Create policies for reservations table
CREATE POLICY "Users can view their own reservations" ON public.reservations
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Funcionarios and admins can view all reservations" ON public.reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text AND role IN ('funcionario', 'admin')
    )
  );

CREATE POLICY "Funcionarios and admins can manage reservations" ON public.reservations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text AND role IN ('funcionario', 'admin')
    )
  );

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically update vehicle status when reservation is created
CREATE OR REPLACE FUNCTION public.update_vehicle_status_on_reservation()
RETURNS TRIGGER AS $$
BEGIN
  -- Update vehicle status to 'alugado' when reservation is created
  IF TG_OP = 'INSERT' AND NEW.status = 'ativa' THEN
    UPDATE public.vehicles 
    SET status = 'alugado' 
    WHERE id = NEW.vehicle_id;
  END IF;
  
  -- Update vehicle status back to 'disponivel' when reservation is completed/cancelled
  IF TG_OP = 'UPDATE' AND OLD.status = 'ativa' AND NEW.status IN ('concluida', 'cancelada') THEN
    UPDATE public.vehicles 
    SET status = 'disponivel' 
    WHERE id = NEW.vehicle_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic vehicle status update
CREATE TRIGGER update_vehicle_status_trigger
  AFTER INSERT OR UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vehicle_status_on_reservation();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;