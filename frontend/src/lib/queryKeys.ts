// Centralised TanStack Query key factory
// Use these throughout the app for cache consistency

const recruiterApplicationsRoot = ["recruiterApplications"] as const;
const jobOfferApplicationsRoot = ["jobOfferApplications"] as const;

export const queryKeys = {
  // Auth
  currentUser: ["currentUser"] as const,

  // Candidate
  candidateProfile: ["candidateProfile"] as const,
  candidateDashboard: ["candidateDashboard"] as const,
  candidateMatches: ["candidateMatches"] as const,
  candidateMatchByJob: (jobId: number) => ["candidateMatchByJob", jobId] as const,

  // Recruiter
  recruiterProfile: ["recruiterProfile"] as const,
  recruiterDashboard: ["recruiterDashboard"] as const,

  // Job Offers
  jobOffers: (page: number, size: number) =>
    ["jobOffers", page, size] as const,
  jobOffer: (id: number) => ["jobOffer", id] as const,
  myJobOffers: (page: number, size: number) =>
    ["myJobOffers", page, size] as const,

  // Applications
  myApplications: (page: number, size: number) =>
    ["myApplications", page, size] as const,
  myApplication: (id: number) => ["myApplication", id] as const,
  recruiterApplicationsRoot,
  recruiterApplications: (
    page: number,
    size: number,
    status?: string
  ) => [...recruiterApplicationsRoot, page, size, status] as const,
  jobOfferApplicationsRoot,
  jobOfferApplications: (jobOfferId: number, page: number, size: number) =>
    [...jobOfferApplicationsRoot, jobOfferId, page, size] as const,

  // Notifications
  notifications: (page: number, size: number) =>
    ["notifications", page, size] as const,
  unreadNotifications: (page: number, size: number) =>
    ["unreadNotifications", page, size] as const,
} as const;
