import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { candidateService } from "@/services/candidateService";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, PageHeader, Skeleton } from "@/components/shared/SharedComponents";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { ApiError } from "@/types";

const schema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  headline: z.string().max(120, "Headline too long").optional(),
  summary: z.string().max(1000, "Summary too long").optional(),
  cvUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function normalizeOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function EditCandidateProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.candidateProfile,
    queryFn: candidateService.getProfile,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        phone: profile.phone ?? "",
        address: profile.address ?? "",
        headline: profile.headline ?? "",
        summary: profile.summary ?? "",
        cvUrl: profile.cvUrl ?? "",
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      candidateService.updateProfile({
        phone: normalizeOptional(values.phone),
        address: normalizeOptional(values.address),
        headline: normalizeOptional(values.headline),
        summary: normalizeOptional(values.summary),
        cvUrl: normalizeOptional(values.cvUrl),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidateProfile });
      navigate("/candidate/profile");
    },
  });

  const getErrorMessage = (error: unknown) => {
    if (error instanceof AxiosError) {
      const data = error.response?.data as ApiError;
      return (
        data?.detail ||
        data?.error ||
        "Failed to update profile. Please try again."
      );
    }
    return "Failed to update profile. Please try again.";
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <PageHeader title="Edit Profile" description="Update your candidate information" />

      <div className="rounded-xl border border-border bg-card p-6">
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Phone" error={errors.phone?.message}>
              <Input id="edit-c-phone" placeholder="+212 6 00 000 000" {...register("phone")} />
            </FormField>
            <FormField label="Location / Address" error={errors.address?.message}>
              <Input id="edit-c-address" placeholder="Casablanca, Morocco" {...register("address")} />
            </FormField>
          </div>

          <FormField label="Professional Headline" error={errors.headline?.message} description="One line that describes your expertise">
            <Input id="edit-c-headline" placeholder="e.g. Java Backend Developer" {...register("headline")} />
          </FormField>

          <FormField label="CV / Portfolio URL" error={errors.cvUrl?.message}>
            <Input id="edit-c-cvurl" type="url" placeholder="https://yourportfolio.com/cv.pdf" {...register("cvUrl")} />
          </FormField>

          <FormField label="Summary" error={errors.summary?.message} description="Tell recruiters about yourself (max 1000 characters)">
            <Textarea
              id="edit-c-summary"
              placeholder="Describe your experience, skills, and what you're looking for..."
              className="min-h-[120px]"
              {...register("summary")}
            />
          </FormField>

          {mutation.isError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive">
              {getErrorMessage(mutation.error)}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" asChild>
              <Link to="/candidate/profile">
                <ArrowLeftIcon className="h-4 w-4" />
                Cancel
              </Link>
            </Button>
            <Button type="submit" loading={mutation.isPending} id="save-c-profile">
              <SaveIcon className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

