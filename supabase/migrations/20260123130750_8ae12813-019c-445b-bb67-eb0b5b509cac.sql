-- Add rating column to reviews table
ALTER TABLE public.reviews ADD COLUMN rating integer NOT NULL DEFAULT 5;

-- Add constraint for rating between 1 and 5
ALTER TABLE public.reviews ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5);

-- Drop the old approved-only policy
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;

-- Create new policy to allow anyone to view all reviews
CREATE POLICY "Anyone can view all reviews" 
ON public.reviews 
FOR SELECT 
USING (true);