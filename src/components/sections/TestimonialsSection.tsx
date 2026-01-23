import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Quote, Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  client_name: string;
  project_type: string;
  generated_review: string;
  overall_experience: string;
  created_at: string;
}

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("id, client_name, project_type, generated_review, overall_experience, created_at")
          .eq("status", "approved")
          .order("approved_at", { ascending: false })
          .limit(6);

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getStarCount = (experience: string) => {
    switch (experience) {
      case "Excellent":
        return 5;
      case "Good":
        return 4;
      case "Average":
        return 3;
      default:
        return 2;
    }
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't render section if no approved reviews
  }

  return (
    <section id="testimonials" className="py-32 px-4 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client <span className="text-gradient">Testimonials</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            What clients say about working with me
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl hover-glow transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: getStarCount(review.overall_experience) }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                {Array.from({ length: 5 - getStarCount(review.overall_experience) }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-muted-foreground/30" />
                ))}
              </div>

              <Quote className="w-8 h-8 text-primary/30 mb-3" />

              <p className="text-foreground/90 text-sm leading-relaxed mb-4 line-clamp-4">
                {review.generated_review}
              </p>

              <div className="pt-4 border-t border-glass-border">
                <p className="font-semibold text-foreground">{review.client_name}</p>
                <p className="text-xs text-muted-foreground">{review.project_type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;