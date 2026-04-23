import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { LandingPage } from "@/pages/public/LandingPage";
import { LoginPage } from "@/pages/public/LoginPage";
import { RegisterCandidatePage } from "@/pages/public/RegisterCandidatePage";
import { RegisterRecruiterPage } from "@/pages/public/RegisterRecruiterPage";
import { JobOffersPage } from "@/pages/public/JobOffersPage";
import { JobOfferDetailPage } from "@/pages/public/JobOfferDetailPage";
import { CandidateDashboardPage } from "@/pages/candidate/CandidateDashboardPage";
import { CandidateProfilePage } from "@/pages/candidate/CandidateProfilePage";
import { EditCandidateProfilePage } from "@/pages/candidate/EditCandidateProfilePage";
import { CandidateApplicationsPage } from "@/pages/candidate/CandidateApplicationsPage";
import { ApplicationDetailPage } from "@/pages/candidate/ApplicationDetailPage";
import { NotificationsPage } from "@/pages/candidate/NotificationsPage";
import { RecruiterDashboardPage } from "@/pages/recruiter/RecruiterDashboardPage";
import { RecruiterProfilePage } from "@/pages/recruiter/RecruiterProfilePage";
import { EditRecruiterProfilePage } from "@/pages/recruiter/EditRecruiterProfilePage";
import { RecruiterJobOffersPage } from "@/pages/recruiter/RecruiterJobOffersPage";
import { CreateJobOfferPage } from "@/pages/recruiter/CreateJobOfferPage";
import { EditJobOfferPage } from "@/pages/recruiter/EditJobOfferPage";
import { RecruiterApplicationsPage } from "@/pages/recruiter/RecruiterApplicationsPage";
import { JobOfferApplicationsPage } from "@/pages/recruiter/JobOfferApplicationsPage";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/candidate" element={<RegisterCandidatePage />} />
        <Route path="/register/recruiter" element={<RegisterRecruiterPage />} />
        <Route path="/jobs" element={<JobOffersPage />} />
        <Route path="/jobs/:id" element={<JobOfferDetailPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_CANDIDATE"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
          <Route path="/candidate/jobs" element={<JobOffersPage />} />
          <Route path="/candidate/jobs/:id" element={<JobOfferDetailPage />} />
          <Route path="/candidate/profile" element={<CandidateProfilePage />} />
          <Route path="/candidate/profile/edit" element={<EditCandidateProfilePage />} />
          <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
          <Route path="/candidate/applications/:applicationId" element={<ApplicationDetailPage />} />
          <Route path="/candidate/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_RECRUITER"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/recruiter" element={<Navigate to="/recruiter/dashboard" replace />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
          <Route path="/recruiter/jobs" element={<JobOffersPage />} />
          <Route path="/recruiter/jobs/:id" element={<JobOfferDetailPage />} />
          <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
          <Route path="/recruiter/profile/edit" element={<EditRecruiterProfilePage />} />
          <Route path="/recruiter/job-offers" element={<RecruiterJobOffersPage />} />
          <Route path="/recruiter/job-offers/new" element={<CreateJobOfferPage />} />
          <Route path="/recruiter/job-offers/:id/edit" element={<EditJobOfferPage />} />
          <Route path="/recruiter/applications" element={<RecruiterApplicationsPage />} />
          <Route
            path="/recruiter/applications/job-offers/:jobOfferId"
            element={<JobOfferApplicationsPage />}
          />
          <Route path="/recruiter/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
