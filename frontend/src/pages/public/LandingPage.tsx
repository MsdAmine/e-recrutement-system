import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "@/store/authStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getDashboardPath } from "@/lib/auth";
import {
  BriefcaseIcon,
  UsersIcon,
  ZapIcon,
  ArrowRightIcon,
  StarIcon,
  BuildingIcon,
  TrendingUpIcon,
  SparklesIcon,
} from "lucide-react";

const stats = [
  { value: "2,400+", label: "Active Jobs" },
  { value: "18K+", label: "Candidates" },
  { value: "940+", label: "Companies" },
  { value: "92%", label: "Hire Rate" },
];

const features = [
  {
    icon: <ZapIcon className="h-5 w-5" />,
    title: "Fast Applications",
    description: "Apply to top roles in seconds with your saved profile.",
  },
  {
    icon: <UsersIcon className="h-5 w-5" />,
    title: "Smart Matching",
    description: "Get matched with jobs that fit your skills and ambitions.",
  },
  {
    icon: <TrendingUpIcon className="h-5 w-5" />,
    title: "Real-time Tracking",
    description: "Track every application status update in real time.",
  },
  {
    icon: <BuildingIcon className="h-5 w-5" />,
    title: "Top Companies",
    description: "Connect with leading employers across every industry.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.12),transparent_35%),radial-gradient(circle_at_80%_15%,hsl(var(--primary)/0.08),transparent_35%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute -top-48 -right-40 h-[680px] w-[680px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-48 -left-40 h-[640px] w-[640px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm text-primary shadow-sm"
          >
            <StarIcon className="h-3.5 w-3.5 text-warning fill-warning" />
            Trusted by 900+ companies worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
          >
            Find your dream job,{" "}
            <span className="text-gradient">faster</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            TalentBridge connects ambitious candidates with forward-thinking companies.
            Browse curated opportunities, apply instantly, and track every step of your journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button size="lg" asChild className="text-base px-8 shadow-md shadow-primary/20">
              <Link to="/jobs">
                Browse Jobs
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-base px-8">
              <Link to="/register/recruiter">Post a Job</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border/70 bg-card/75 backdrop-blur-sm px-4 py-4 shadow-sm"
              >
                <div className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 kicker normal-case tracking-normal">
              <SparklesIcon className="h-3.5 w-3.5 text-primary" />
              Platform Benefits
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Everything you need to hire and get hired
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A modern recruitment experience built for speed, clarity, and results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-lg border border-border/80 bg-card p-6 shadow-sm hover:border-primary/35 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 ring-1 ring-primary/20">
                  {feature.icon}
                </div>
                <h3 className="relative font-semibold mb-1.5">{feature.title}</h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-lg border border-border/80 bg-card/80 p-10 shadow-sm"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to take the next step?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of candidates and recruiters already using TalentBridge.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="px-8">
                <Link to="/register/candidate">
                  <UsersIcon className="h-4 w-4" />
                  I'm a Candidate
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="px-8">
                <Link to="/register/recruiter">
                  <BriefcaseIcon className="h-4 w-4" />
                  I'm a Recruiter
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
