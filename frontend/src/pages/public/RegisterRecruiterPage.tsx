import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useAuth } from "@/store/authStore";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/SharedComponents";
import { BuildingIcon, MailIcon, LockIcon } from "lucide-react";
import { AxiosError } from "axios";
import { ApiError } from "@/types";
import { useEffect } from "react";
import { getDashboardPath } from "@/lib/auth";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    companyName: z.string().min(1, "Company name is required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterRecruiterPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getDashboardPath(user?.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (vals: FormValues) =>
      authService.registerRecruiter({
        firstName: vals.firstName,
        lastName: vals.lastName,
        email: vals.email,
        password: vals.password,
        companyName: vals.companyName,
      }),
    onSuccess: (data) => {
      login(data);
      navigate(getDashboardPath(data.role), { replace: true });
    },
  });

  const getError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const data = error.response?.data as ApiError;
      return data?.detail || data?.error || "Registration failed.";
    }
    return "Something went wrong.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <BuildingIcon className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Post your first job</h1>
          <p className="text-muted-foreground text-sm mt-1">Register as a recruiter to start hiring</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" error={errors.firstName?.message} required>
                <Input id="reg-r-firstname" placeholder="Amine" {...register("firstName")} />
              </FormField>
              <FormField label="Last Name" error={errors.lastName?.message} required>
                <Input id="reg-r-lastname" placeholder="Moussaid" {...register("lastName")} />
              </FormField>
            </div>

            <FormField label="Company Name" error={errors.companyName?.message} required>
              <div className="relative">
                <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input id="reg-r-company" placeholder="TechCorp" className="pl-9" {...register("companyName")} />
              </div>
            </FormField>

            <FormField label="Email" error={errors.email?.message} required>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input id="reg-r-email" type="email" placeholder="amine@techcorp.com" className="pl-9" {...register("email")} />
              </div>
            </FormField>

            <FormField label="Password" error={errors.password?.message} required>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input id="reg-r-password" type="password" placeholder="••••••••" className="pl-9" {...register("password")} />
              </div>
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input id="reg-r-confirm" type="password" placeholder="••••••••" className="pl-9" {...register("confirmPassword")} />
              </div>
            </FormField>

            {mutation.isError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive">
                {getError(mutation.error)}
              </div>
            )}

            <Button type="submit" className="w-full" loading={mutation.isPending} id="reg-r-submit">
              Create Recruiter Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground font-medium hover:underline">Sign in</Link>
          {" · "}
          <Link to="/register/candidate" className="text-foreground font-medium hover:underline">Candidate?</Link>
        </p>
      </motion.div>
    </div>
  );
}
