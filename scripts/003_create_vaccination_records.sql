-- Create vaccination records table
CREATE TABLE IF NOT EXISTS public.vaccination_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vaccine_id UUID NOT NULL REFERENCES public.vaccines(id),
  provider_id UUID REFERENCES public.profiles(id), -- The provider who administered
  date_administered DATE NOT NULL,
  lot_number TEXT,
  expiration_date DATE,
  site_of_injection TEXT,
  dose_number INTEGER DEFAULT 1,
  next_dose_due DATE,
  notes TEXT,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own vaccination records" ON public.vaccination_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vaccination records" ON public.vaccination_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can view their administered vaccines" ON public.vaccination_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'provider'
    ) AND provider_id = auth.uid()
  );

CREATE POLICY "Providers can insert vaccination records" ON public.vaccination_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'provider'
    ) AND provider_id = auth.uid()
  );

CREATE POLICY "Admins can view all vaccination records" ON public.vaccination_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
