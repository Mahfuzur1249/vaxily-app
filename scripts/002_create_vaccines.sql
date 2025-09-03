-- Create vaccines table for vaccine information
CREATE TABLE IF NOT EXISTS public.vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  description TEXT,
  age_group TEXT,
  doses_required INTEGER DEFAULT 1,
  interval_between_doses INTEGER, -- days
  side_effects TEXT,
  contraindications TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vaccines ENABLE ROW LEVEL SECURITY;

-- RLS Policies - vaccines are public information
CREATE POLICY "Anyone can view active vaccines" ON public.vaccines
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage vaccines" ON public.vaccines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert common vaccines
INSERT INTO public.vaccines (name, manufacturer, description, age_group, price) VALUES
('COVID-19 mRNA', 'Pfizer-BioNTech', 'mRNA vaccine for COVID-19 prevention', 'All ages 6 months+', 25.00),
('Influenza (Flu)', 'Various', 'Annual flu vaccine', 'All ages 6 months+', 30.00),
('Hepatitis B', 'Various', 'Hepatitis B prevention vaccine', 'All ages', 45.00),
('MMR', 'Various', 'Measles, Mumps, Rubella combination vaccine', 'Children and adults', 55.00),
('Tdap', 'Various', 'Tetanus, Diphtheria, Pertussis booster', 'All ages', 40.00)
ON CONFLICT DO NOTHING;
