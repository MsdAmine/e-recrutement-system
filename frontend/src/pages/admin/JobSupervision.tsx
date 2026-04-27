import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import adminService from "../../services/adminService";
import { JobOffer } from "../../types";
import { Search, Trash2, MapPin, Briefcase, Calendar, AlertCircle, Eye, X, DollarSign, ShieldAlert } from "lucide-react";

const JobSupervision: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await adminService.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    try {
      await adminService.deleteJob(selectedJob.id);
      setJobs(jobs.filter((j) => j.id !== selectedJob.id));
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Failed to delete job", error);
    }
  };

  const openDetailsModal = (job: JobOffer) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const filteredJobs = jobs.filter((job) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.recruiterEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading job offers...</div>;

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supervise Job Offers</h1>
          <p className="text-muted-foreground mt-2">Monitor and remove non-compliant job postings.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="surface-card p-6 flex flex-col md:flex-row justify-between gap-6 surface-card-hover">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                    <p className="text-sm text-primary font-semibold">By {job.recruiterEmail}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {job.active ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{job.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 opacity-70" /> {job.location}</div>
                  <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 opacity-70" /> {job.contractType}</div>
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 opacity-70" /> {new Date(job.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-3">
                <button
                  onClick={() => openDetailsModal(job)}
                  className="flex items-center justify-center p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                  <span className="ml-2 md:hidden">View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 p-12 rounded-lg text-center border-2 border-dashed border-border">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No job offers found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters.</p>
        </div>
      )}

      {isDetailsModalOpen && selectedJob && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-2xl rounded-lg shadow-[0_20px_60px_hsl(222_38%_9%/0.18)] overflow-hidden animate-in zoom-in-95 my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">Job Offer Details</h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-2xl font-bold text-foreground">{selectedJob.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedJob.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {selectedJob.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-primary font-medium flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {selectedJob.recruiterEmail}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center"><MapPin className="w-3 h-3 mr-1"/> Location</p>
                  <p className="font-semibold text-sm">{selectedJob.location}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center"><Briefcase className="w-3 h-3 mr-1"/> Contract</p>
                  <p className="font-semibold text-sm">{selectedJob.contractType}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center"><DollarSign className="w-3 h-3 mr-1"/> Salary</p>
                  <p className="font-semibold text-sm">{selectedJob.salary ? `$${selectedJob.salary}` : "Not specified"}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Posted</p>
                  <p className="font-semibold text-sm">{new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h5 className="font-semibold mb-2">Description</h5>
                <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border bg-muted/20 flex justify-between items-center">
              <button
                onClick={openDeleteModal}
                className="flex items-center px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Job
              </button>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {isDeleteModalOpen && selectedJob && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-lg shadow-[0_20px_60px_hsl(222_38%_9%/0.18)] overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-bold text-destructive flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Confirm Deletion
              </h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-foreground mb-4">
                Are you sure you want to permanently delete the job offer <span className="font-semibold">"{selectedJob.title}"</span>?
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone and will remove all applications associated with this job.
              </p>
            </div>
            <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors font-medium"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default JobSupervision;
