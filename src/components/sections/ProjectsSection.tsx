import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ExternalLink,
  Calendar,
  PenTool,
  BookOpen,
  ShoppingCart
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    name: "Intelligent Booking Ecosystem",
    description: "Full-stack service management with automated scheduling",
    icon: Calendar,
    color: "from-cyan-500 to-blue-600",
    link: "https://ai-powered-bookingsystem.vercel.app/",
    details:
      "A comprehensive booking platform engineered to streamline service appointments. It features a conversational interface for requirement gathering and a robust backend system for real-time availability and automated notification dispatch.",
    technologies: [
      "React",
      "TypeScript",
      "Custom Logic",
      "Supabase",
      "Edge Functions"
    ]
  },
  {
    id: 2,
    name: "Social Intelligence Suite",
    description: "AI-driven content optimization and scheduled workflows",
    icon: PenTool,
    color: "from-teal-300 to-cyan-500",
    link: "https://ai-social-media-scheduler.vercel.app/",
    details:
      "An advanced content tool that leverages LLM integration to transform niche descriptions into high-engagement captions. Built with a scheduled reminder architecture to ensure consistent content delivery.",
    technologies: [
      "React",
      "LLM Integration",
      "Workflow Automation",
      "Tailwind CSS"
    ]
  },
  {
    id: 3,
    name: "Architect: Productivity Planner",
    description: "Deep-work coordination system with focus analytics",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-600",
    link: "https://study-buddy-aipowered.vercel.app/",
    details:
      "A productivity application designed for deep work. It utilizes complex logic to generate dynamic study plans and manages state for focus sessions, allowing users to export structured schedules.",
    technologies: [
      "React",
      "TypeScript",
      "State Management",
      "Logic Architecture"
    ]
  },
  {
    id: 4,
    name: "Consumer Intelligence Assistant",
    description: "E-commerce guidance system with predictive logic",
    icon: ShoppingCart,
    color: "from-orange-500 to-red-600",
    link: "https://ai-shoppers-muse.vercel.app/",
    details:
      "An interactive assistant developed to optimize the shopping experience. It processes budget and preference data to provide real-time product comparisons and detailed technical explanations.",
    technologies: [
      "React",
      "Predictive Logic",
      "Integration Engineering",
      "Tailwind CSS"
    ]
  }
  ,
  {
  id: 5,
  name: "AI Booking & Service Assistant",
  description: "AI-powered assistant for local service businesses",
  icon: ShoppingCart,
  color: "from-red-400 to-yellow-500",
  link: "https://ask-glow-book.vercel.app/",
  details:
    "An AI-driven assistant designed for salons and fitness studios to automate customer interactions. It intelligently answers FAQs, recommends services based on user needs, and collects appointment requests without human involvement.",
  technologies: [
    "React",
    "AI Chatbot Logic",
    "Form Automation",
    "Email Follow-up Automation",
    "Tailwind CSS"
  ]
  }, 
  { 
  id: 6,
  name: "LunaLift AI Fitness Coach",
  description: "AI-powered personalized workout & wellness assistant",
  icon: ShoppingCart,
  color: "from-violet-500 to-fuchsia-600",
  link: "https://lunalift-jeoc.vercel.app/",
  details:
    "LunaLift is an AI-powered fitness and wellness coach designed specifically for women. It personalizes daily workouts based on energy levels, recovery needs, and user goals. The assistant guides users through warm-ups, strength training, and recovery while adapting plans dynamically to support consistency, confidence, and long-term health.",
  technologies: [
    "React",
    "AI Workout Personalization",
    "Energy-Based Training Logic",
    "Adaptive Program Generation",
    "Tailwind CSS"
  ]
}

];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] =
    useState<(typeof projects)[0] | null>(null);

  return (
    <section id="projects" className="py-32 px-4 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-gradient">Portfolio</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="glass-card p-6 cursor-pointer hover-glow group relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-5 transition-opacity`}
              />
              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center shrink-0`}
                >
                  <project.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                {selectedProject && (
                  <>
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedProject.color} flex items-center justify-center`}
                    >
                      <selectedProject.icon className="w-5 h-5 text-white" />
                    </div>
                    {selectedProject.name}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedProject && (
              <div className="space-y-6 pt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.details}
                </p>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary/80">Stack & Infrastructure</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-glass-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-md font-semibold mt-4"
                  onClick={() =>
                    window.open(selectedProject.link, "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Preview
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ProjectsSection;