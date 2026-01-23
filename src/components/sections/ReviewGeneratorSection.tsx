import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ReviewGeneratorSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    overallExperience: "",
    projectType: "",
    delivery: "",
    communication: "",
    optionalComment: "",
    wouldRecommend: "",
  });

  const [generatedReview, setGeneratedReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (
      !formData.overallExperience ||
      !formData.projectType ||
      !formData.delivery ||
      !formData.communication ||
      !formData.wouldRecommend
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setGeneratedReview("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-review", {
        body: formData,
      });

      if (error) {
        throw error;
      }

      if (data?.review) {
        setGeneratedReview(data.review);
        toast.success("Review generated successfully!");
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedReview);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="review-generator" className="py-32 px-4 relative">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client <span className="text-gradient">Review</span> Generator
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Select your experience details and let AI craft a polished testimonial for you.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 glow-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Overall Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-foreground">
                Overall Experience *
              </Label>
              <Select
                value={formData.overallExperience}
                onValueChange={(value) => handleSelectChange("overallExperience", value)}
              >
                <SelectTrigger id="experience" className="bg-secondary border-glass-border">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent className="bg-card border-glass-border z-50">
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delivery */}
            <div className="space-y-2">
              <Label htmlFor="delivery" className="text-foreground">
                Delivery *
              </Label>
              <Select
                value={formData.delivery}
                onValueChange={(value) => handleSelectChange("delivery", value)}
              >
                <SelectTrigger id="delivery" className="bg-secondary border-glass-border">
                  <SelectValue placeholder="Select delivery speed" />
                </SelectTrigger>
                <SelectContent className="bg-card border-glass-border z-50">
                  <SelectItem value="Very Fast">Very Fast</SelectItem>
                  <SelectItem value="On Time">On Time</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Communication */}
            <div className="space-y-2">
              <Label htmlFor="communication" className="text-foreground">
                Communication *
              </Label>
              <Select
                value={formData.communication}
                onValueChange={(value) => handleSelectChange("communication", value)}
              >
                <SelectTrigger id="communication" className="bg-secondary border-glass-border">
                  <SelectValue placeholder="Select communication quality" />
                </SelectTrigger>
                <SelectContent className="bg-card border-glass-border z-50">
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Would Recommend */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="recommend" className="text-foreground">
                Would you recommend? *
              </Label>
              <Select
                value={formData.wouldRecommend}
                onValueChange={(value) => handleSelectChange("wouldRecommend", value)}
              >
                <SelectTrigger id="recommend" className="bg-secondary border-glass-border">
                  <SelectValue placeholder="Select recommendation" />
                </SelectTrigger>
                <SelectContent className="bg-card border-glass-border z-50">
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="Maybe">Maybe</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Optional Comment */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comment" className="text-foreground">
                Optional Comment
              </Label>
              <Textarea
                id="comment"
                placeholder="Add any additional thoughts or specific details about your experience..."
                className="bg-secondary border-glass-border min-h-[100px] resize-none"
                value={formData.optionalComment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, optionalComment: e.target.value }))
                }
              />
            </div>
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
              className="mt-8 p-6 bg-secondary/50 border border-glass-border rounded-xl relative"
            >
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
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewGeneratorSection;