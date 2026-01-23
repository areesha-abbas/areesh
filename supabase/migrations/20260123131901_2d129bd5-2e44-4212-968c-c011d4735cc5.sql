-- Drop the existing restrictive SELECT policies
DROP POLICY IF EXISTS "Anyone can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin can view all reviews" ON public.reviews;

-- Create a PERMISSIVE policy for public read access
CREATE POLICY "Public can view all reviews" 
ON public.reviews 
FOR SELECT 
TO anon, authenticated
USING (true);