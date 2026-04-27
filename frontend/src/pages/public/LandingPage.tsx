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
      <section className="relative min-h-[88vh] flex items-center justify-center px-4 py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--card)/0.75),transparent_42rem)]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/85 px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
          >
            <StarIcon className="h-3.5 w-3.5 text-warning fill-warning" />
            Trusted by 900+ companies worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6 text-5xl font-semibold tracking-tight leading-[1.04] sm:text-6xl lg:text-7xl"
          >
            Find your dream job,{" "}
            <span className="text-gradient">faster</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
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
            <Button size="lg" asChild className="px-8 text-base">
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
            className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="surface-card px-4 py-4"
              >
                <div className="text-2xl font-semibold tracking-tight sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/25 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 kicker normal-case tracking-normal">
              <SparklesIcon className="h-3.5 w-3.5 text-primary" />
              Platform Benefits
            </div>
            <h2 className="mb-3 text-3xl font-semibold sm:text-4xl">
              Everything you need to hire and get hired
            </h2>
            <p className="mx-auto max-w-xl text-lg leading-7 text-muted-foreground">
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
                className="surface-card surface-card-hover group p-5"
              >
                <div className="icon-tile relative mb-4 h-10 w-10">
                  {feature.icon}
                </div>
                <h3 className="relative mb-1.5 font-semibold">{feature.title}</h3>
                <p className="relative text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-emphasized p-10"
          >
            <h2 className="mb-4 text-3xl font-semibold sm:text-4xl">
              Ready to take the next step?
            </h2>
            <p className="mb-8 text-lg leading-7 text-muted-foreground">
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
