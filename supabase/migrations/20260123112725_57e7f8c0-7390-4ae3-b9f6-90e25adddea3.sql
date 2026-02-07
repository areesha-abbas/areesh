-- Create reviews table for storing client testimonials
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT,
  overall_experience TEXT NOT NULL,
  project_type TEXT NOT NULL,
  delivery TEXT NOT NULL,
  communication TEXT NOT NULL,
  optional_comment TEXT,
  would_recommend TEXT NOT NULL,
  generated_review TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit reviews
CREATE POLICY "Anyone can submit reviews"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Admin can view all reviews
CREATE POLICY "Admin can view all reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can update reviews (for approval)
CREATE POLICY "Admin can update reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (is_admin());

-- Admin can delete reviews
CREATE POLICY "Admin can delete reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (is_admin());