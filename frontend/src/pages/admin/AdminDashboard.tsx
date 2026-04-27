import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { PlatformStats } from "../../types";
import { Users, Briefcase, FileText, UserCheck, UserX } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading stats...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load statistics.</div>;

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Candidates", value: stats.totalCandidates, icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
    { title: "Recruiters", value: stats.totalRecruiters, icon: UserX, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Job Offers", value: stats.totalJobOffers, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Applications", value: stats.totalApplications, icon: FileText, color: "text-rose-600", bg: "bg-rose-100" },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor platform activity and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="surface-card surface-card-hover p-6 flex items-center space-x-4">
            <div className={`p-4 rounded-lg shadow-sm ring-1 ring-inset ring-border/50 ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">{card.title}</p>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="surface-card p-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Insights</h2>
        {stats.totalUsers > 0 ? (
          <p className="text-muted-foreground leading-relaxed">
            The platform currently serves <span className="font-bold text-primary">{stats.totalUsers}</span> users, with a ratio of 
            <span className="font-bold text-foreground"> {Math.round((stats.totalCandidates / stats.totalUsers) * 100)}%</span> candidates 
            to <span className="font-bold text-foreground"> {Math.round((stats.totalRecruiters / stats.totalUsers) * 100)}%</span> recruiters.
          </p>
        ) : (
          <p className="text-muted-foreground italic">No users registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
