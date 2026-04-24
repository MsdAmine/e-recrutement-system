import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { User } from "../../types";
import { ShieldCheck, ShieldAlert, Search, Mail, User as UserIcon } from "lucide-react";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      const updatedUser = await adminService.toggleUserStatus(userId);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (error) {
      console.error("Failed to toggle user status", error);
    }
  };

  const filteredUsers = users.filter((user) => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading users...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
          <p className="text-slate-500 mt-2">Activate or deactivate candidate and recruiter accounts.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                        <div className="flex items-center text-sm text-slate-500">
                          <Mail className="w-3 h-3 mr-1" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role.name === "ROLE_ADMIN" ? "bg-amber-100 text-amber-700" :
                      user.role.name === "ROLE_RECRUITER" ? "bg-purple-100 text-purple-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role.name.replace("ROLE_", "")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 ${user.enabled ? "text-green-600" : "text-red-600"}`}>
                      {user.enabled ? (
                        <><ShieldCheck className="w-4 h-4" /> <span className="text-sm font-medium">Active</span></>
                      ) : (
                        <><ShieldAlert className="w-4 h-4" /> <span className="text-sm font-medium">Disabled</span></>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      disabled={user.role.name === "ROLE_ADMIN"}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        user.enabled 
                          ? "bg-red-50 text-red-600 hover:bg-red-100" 
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {user.enabled ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-slate-500">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
