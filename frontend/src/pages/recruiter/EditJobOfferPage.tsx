import { useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, PageHeader, Skeleton } from "@/components/shared/SharedComponents";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";

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
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function EditJobOfferPage() {
  const { id } = useParams<{ id: string }>();
  const offerId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: offer, isLoading } = useQuery({
    queryKey: queryKeys.jobOffer(offerId),
    queryFn: () => jobOfferService.getOfferById(offerId),
    enabled: !!offerId,
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (offer) {
      reset({
        title: offer.title,
        description: offer.description,
        contractType: offer.contractType,
        location: offer.location,
        salary: offer.salary?.toString() ?? "",
        active: offer.active,
      });
    }
  }, [offer, reset]);

  const mutation = useMutation({
    mutationFn: (vals: FormValues) =>
      jobOfferService.updateOffer(offerId, {
        title: vals.title,
        description: vals.description,
        contractType: vals.contractType,
        location: vals.location,
        salary: vals.salary ? Number(vals.salary) : null,
        active: vals.active,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobOffers"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobOffer(offerId) });
      navigate("/recruiter/job-offers");
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 rounded-xl" />
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

          <FormField label="Job Description" error={errors.description?.message} required>
            <Textarea id="edit-job-description" className="min-h-[160px]" {...register("description")} />
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
              Failed to update job offer.
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
      </div>
    </div>
  );
}
