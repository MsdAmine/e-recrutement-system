import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { JobOffer } from "../../types";
import { Search, Trash2, MapPin, Briefcase, Calendar, AlertCircle } from "lucide-react";

const JobSupervision: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm("Are you sure you want to delete this job offer? This action cannot be undone.")) return;
    try {
      await adminService.deleteJob(jobId);
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (error) {
      console.error("Failed to delete job", error);
    }
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
            className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
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
                  onClick={() => handleDeleteJob(job.id)}
                  className="flex items-center justify-center p-3 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  title="Delete non-compliant content"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="ml-2 md:hidden">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 p-12 rounded-2xl text-center border-2 border-dashed border-border">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No job offers found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
};

export default JobSupervision;
