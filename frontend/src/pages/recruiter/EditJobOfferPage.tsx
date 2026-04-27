import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { jobOfferService } from "@/services/jobOfferService";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ErrorDisplay,
  FormField,
  PageHeader,
  Skeleton,
} from "@/components/shared/SharedComponents";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { AxiosError } from "axios";
import { ApiError, JobOffer } from "@/types";

const CONTRACT_TYPES = ["CDI", "CDD", "STAGE", "FREELANCE", "INTERIM"] as const;

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description too short"),
  contractType: z.enum(CONTRACT_TYPES),
  location: z.string().min(2, "Location is required"),
  salary: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || (!Number.isNaN(Number(value)) && Number(value) > 0),
      "Must be a positive number"
    ),
  requiredSkills: z.string().max(1000, "Skills text too long").optional(),
  requiredExperienceYears: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || (Number.isInteger(Number(value)) && Number(value) >= 0),
      "Must be a non-negative whole number"
    ),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

// ── Inner form — only mounted after offer data is ready ─────────────────────
function EditJobForm({
  offer,
  offerId,
}: {
  offer: JobOffer;
  offerId: number;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, control, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      // Pass offer values as defaultValues so every field — including the
      // Radix Select — has the correct value on its very first render.
      defaultValues: {
        title: offer.title,
        description: offer.description,
        contractType: offer.contractType as (typeof CONTRACT_TYPES)[number],
        location: offer.location,
        salary: offer.salary?.toString() ?? "",
        requiredSkills: offer.requiredSkills ?? "",
        requiredExperienceYears:
          offer.requiredExperienceYears?.toString() ?? "",
        active: offer.active,
      },
    });

  const mutation = useMutation({
    mutationFn: (vals: FormValues) =>
      jobOfferService.updateOffer(offerId, {
        title: vals.title,
        description: vals.description,
        contractType: vals.contractType,
        location: vals.location,
        salary: vals.salary ? Number(vals.salary) : null,
        requiredSkills: vals.requiredSkills?.trim() || null,
        requiredExperienceYears: vals.requiredExperienceYears
          ? Number(vals.requiredExperienceYears)
          : null,
        active: vals.active,
      }),
    onSuccess: () => {
      navigate("/recruiter/job-offers");
      queryClient.invalidateQueries({ queryKey: ["myJobOffers"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobOffer(offerId) });
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
      <FormField label="Job Title" error={errors.title?.message} required>
        <Input id="edit-job-title" {...register("title")} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Contract Type" error={errors.contractType?.message} required>
          <Controller
            name="contractType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="edit-job-contract">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">Permanent (CDI)</SelectItem>
                  <SelectItem value="CDD">Fixed-term (CDD)</SelectItem>
                  <SelectItem value="STAGE">Internship</SelectItem>
                  <SelectItem value="FREELANCE">Freelance</SelectItem>
                  <SelectItem value="INTERIM">Temporary</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Location" error={errors.location?.message} required>
          <Input id="edit-job-location" {...register("location")} />
        </FormField>
      </div>

      <FormField label="Monthly Salary (MAD)" error={errors.salary?.message}>
        <Input id="edit-job-salary" type="number" {...register("salary")} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Required Skills (comma-separated)"
          error={errors.requiredSkills?.message}
        >
          <Input
            id="edit-job-required-skills"
            placeholder="Java, Spring Boot, PostgreSQL"
            {...register("requiredSkills")}
          />
        </FormField>
        <FormField
          label="Required Experience (years)"
          error={errors.requiredExperienceYears?.message}
        >
          <Input
            id="edit-job-required-exp"
            type="number"
            min="0"
            {...register("requiredExperienceYears")}
          />
        </FormField>
      </div>

      <FormField label="Job Description" error={errors.description?.message} required>
        <Textarea
          id="edit-job-description"
          className="min-h-[160px]"
          {...register("description")}
        />
      </FormField>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="edit-job-active"
              checked={field.value}
              onChange={field.onChange}
              className="h-4 w-4 rounded accent-primary"
            />
          )}
        />
        <label htmlFor="edit-job-active" className="text-sm font-medium cursor-pointer">
          Active (visible to candidates)
        </label>
      </div>

      {mutation.isError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive">
          {mutation.error instanceof AxiosError
            ? (mutation.error.response?.data as ApiError | undefined)?.detail ??
              (mutation.error.response?.data as ApiError | undefined)?.error ??
              "Failed to update job offer."
            : "Failed to update job offer."}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" asChild>
          <Link to="/recruiter/job-offers">Cancel</Link>
        </Button>
        <Button type="submit" loading={mutation.isPending} id="edit-job-submit">
          <SaveIcon className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </form>
  );
}

// ── Page shell — handles loading / error states ──────────────────────────────
export function EditJobOfferPage() {
  const { id } = useParams<{ id: string }>();
  const offerId = Number(id);
  const isValidOfferId = Number.isInteger(offerId) && offerId > 0;

  const { data: offer, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.jobOffer(offerId),
    queryFn: () => jobOfferService.getMyOfferById(offerId),
    enabled: isValidOfferId,
  });

  if (!isValidOfferId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-in">
        <p className="text-muted-foreground">Invalid job offer ID.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/recruiter/job-offers">Back to Job Offers</Link>
        </Button>
      </div>
    );
  }

  if (isLoading || !offer) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    const loadErrorMessage =
      error instanceof AxiosError
        ? (error.response?.data as ApiError | undefined)?.detail ??
          (error.response?.data as ApiError | undefined)?.error ??
          "Failed to load this job offer."
        : "Failed to load this job offer.";

    return (
      <div className="max-w-2xl mx-auto animate-in">
        <ErrorDisplay
          title="Unable to load job offer"
          message={loadErrorMessage}
          onRetry={refetch}
        />
        <div className="mt-4 text-center">
          <Button variant="outline" asChild>
            <Link to="/recruiter/job-offers">Back to Job Offers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <Button variant="ghost" size="sm" className="mb-5 -ml-2" asChild>
        <Link to="/recruiter/job-offers">
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <PageHeader title="Edit Job Offer" description="Update your job offer details" />

      <div className="rounded-xl border border-border bg-card p-6">
        {/* key=offer.id ensures EditJobForm fully remounts if user navigates
            between different job edit pages without unmounting the route */}
        <EditJobForm key={offer.id} offer={offer} offerId={offerId} />
      </div>
    </div>
  );
}
