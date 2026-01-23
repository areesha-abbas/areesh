import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Copy, Check, Loader2, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Reviews = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    projectType: "",
    optionalComment: "",
  });

  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [generatedReview, setGeneratedReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  const handleGenerate = async () => {
    if (!formData.clientName || !formData.projectType || rating === 0) {
      toast.error("Please fill in your name, project type, and rating");
      return;
    }

    setIsLoading(true);
    setGeneratedReview("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-review", {
        body: {
          overallExperience: getRatingLabel(rating),
          projectType: formData.projectType,
          delivery: rating >= 4 ? "On Time" : "Flexible",
          communication: rating >= 4 ? "Excellent" : "Good",
          optionalComment: formData.optionalComment,
          wouldRecommend: rating >= 3 ? "Yes" : "Maybe",
        },
      });

      if (error) throw error;

      if (data?.review) {
        setGeneratedReview(data.review);
        toast.success("Review generated! You can now submit it.");
      } else {
        throw new Error("No review returned");
      }
    } catch (error) {
      console.error("Error generating review:", error);
      toast.error("Failed to generate review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!generatedReview) {
      toast.error("Please generate a review first");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        client_name: formData.clientName,
        client_email: formData.clientEmail || null,
        overall_experience: getRatingLabel(rating),
        project_type: formData.projectType,
        delivery: rating >= 4 ? "On Time" : "Flexible",
        communication: rating >= 4 ? "Excellent" : "Good",
        optional_comment: formData.optionalComment || null,
        would_recommend: rating >= 3 ? "Yes" : "Maybe",
        generated_review: generatedReview,
        rating: rating,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Thank you! Your review has been published.");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedReview);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your review has been published and is now visible on the site.
          </p>
          <Link to="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-glass-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gradient">
            AA
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Leave a <span className="text-gradient">Review</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Share your experience working with me. Rate your experience and let AI craft a polished testimonial for you.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 glow-border"
        >
          <div className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-3">
              <Label className="text-foreground text-lg font-medium">
                Your Rating *
              </Label>
              <div className="flex flex-col items-center gap-3 p-6 bg-secondary/30 rounded-xl border border-glass-border">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm font-medium text-foreground">
                  {getRatingLabel(hoveredRating || rating)}
                </p>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-foreground">
                  Your Name *
                </Label>
                <Input
                  id="clientName"
                  placeholder="John Doe"
                  className="bg-secondary border-glass-border"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, clientName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-foreground">
                  Email (optional)
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-secondary border-glass-border"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-foreground">
                Project Type *
              </Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => handleSelectChange("projectType", value)}
              >
                <SelectTrigger id="projectType" className="bg-secondary border-glass-border">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-glass-border z-50">
                  <SelectItem value="Website Development">Website Development</SelectItem>
                  <SelectItem value="AI Automation">AI Automation</SelectItem>
                  <SelectItem value="Portfolio Site">Portfolio Site</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Landing Page">Landing Page</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="text-foreground">
                Additional Comments (optional)
              </Label>
              <Textarea
                id="comment"
                placeholder="Add any specific details about your experience..."
                className="bg-secondary border-glass-border min-h-[100px] resize-none"
                value={formData.optionalComment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, optionalComment: e.target.value }))
                }
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover-glow py-6 text-lg rounded-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Review
                </>
              )}
            </Button>

            {/* Generated Review Output */}
            {generatedReview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 space-y-4"
              >
                <div className="p-6 bg-secondary/50 border border-glass-border rounded-xl relative">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-foreground italic leading-relaxed flex-1">
                      "{generatedReview}"
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopy}
                      className="shrink-0 hover:bg-primary/10"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <Copy className="w-5 h-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">— {formData.clientName}</p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-lg rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Publish Review
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Reviews;
