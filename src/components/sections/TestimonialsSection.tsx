import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Quote, Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  client_name: string;
  project_type: string;
  generated_review: string;
  rating: number;
  created_at: string;
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "fallback-1",
    client_name: "Sarah Mitchell",
    project_type: "E-Commerce Website",
    generated_review:
      "Absolutely blown away by the quality of work. The website is sleek, fast, and exactly what I envisioned. Communication was flawless and delivery was ahead of schedule. Highly recommend!",
    rating: 5,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "fallback-2",
    client_name: "James Carter",
    project_type: "Portfolio Site",
    generated_review:
      "Working with Areesha was a great experience. She understood my brand instantly and delivered a portfolio that truly represents my work. The attention to detail is remarkable.",
    rating: 5,
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "fallback-3",
    client_name: "Fatima Al-Rashid",
    project_type: "AI Automation",
    generated_review:
      "The AI integration into our workflow has saved us hours every week. Professional, responsive, and incredibly knowledgeable. The project was delivered on time with excellent results.",
    rating: 4,
    created_at: "2026-01-05T10:00:00Z",
  },
  {
    id: "fallback-4",
    client_name: "David Park",
    project_type: "SaaS Dashboard",
    generated_review:
      "From concept to launch, the entire process was seamless. The dashboard is intuitive, beautifully designed, and our users love it. Will definitely be coming back for future projects.",
    rating: 5,
    created_at: "2025-12-28T10:00:00Z",
  },
  {
    id: "fallback-5",
    client_name: "Elena Rodriguez",
    project_type: "Landing Page",
    generated_review:
      "Quick turnaround, stunning design, and great communication throughout. The landing page conversion rate exceeded our expectations. Truly a talented developer.",
    rating: 5,
    created_at: "2025-12-20T10:00:00Z",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("id, client_name, project_type, generated_review, rating, created_at")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(FALLBACK_REVIEWS);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews(FALLBACK_REVIEWS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-32 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
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
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Left spacer for centering on large screens */}
        <div className="shrink-0 w-[calc((100vw-1280px)/2)] hidden xl:block" />

        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl hover-glow transition-all duration-300 shrink-0 w-[320px] md:w-[380px] snap-start"
          >
            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <Quote className="w-8 h-8 text-primary/30 mb-3" />

            {/* Review Text */}
            <p className="text-foreground/90 text-sm leading-relaxed mb-4 line-clamp-5">
              {review.generated_review}
            </p>

            {/* Client Info */}
            <div className="pt-4 border-t border-glass-border">
              <p className="font-semibold text-foreground">{review.client_name}</p>
              <p className="text-xs text-muted-foreground">{review.project_type}</p>
            </div>
          </motion.div>
        ))}

        {/* Right spacer */}
        <div className="shrink-0 w-4" />
      </div>
    </section>
  );
};

export default TestimonialsSection;
