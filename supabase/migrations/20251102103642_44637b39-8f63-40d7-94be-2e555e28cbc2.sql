-- Create portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create holdings table
CREATE TABLE public.holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  shares NUMERIC NOT NULL,
  average_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolios
CREATE POLICY "Users can view their own portfolios"
ON public.portfolios
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolios"
ON public.portfolios
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios"
ON public.portfolios
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
ON public.portfolios
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for holdings
CREATE POLICY "Users can view holdings in their portfolios"
ON public.holdings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = holdings.portfolio_id
    AND portfolios.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create holdings in their portfolios"
ON public.holdings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = holdings.portfolio_id
    AND portfolios.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update holdings in their portfolios"
ON public.holdings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = holdings.portfolio_id
    AND portfolios.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete holdings in their portfolios"
ON public.holdings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = holdings.portfolio_id
    AND portfolios.user_id = auth.uid()
  )
);

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers
CREATE TRIGGER update_portfolios_updated_at
BEFORE UPDATE ON public.portfolios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at
BEFORE UPDATE ON public.holdings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();