import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatsCard } from "@/components/stats-card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardStats, CaseLeadWithDetails } from "@/lib/types";
import { User } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingLead, setEditingLead] = useState<CaseLeadWithDetails | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    role: "student",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const leads = [
    { name: "John Doe", contact: "john@example.com", priority: "Urgent", location: "New York" },
    { name: "Jane Smith", contact: "555-123-4567", priority: "Routine", location: "Los Angeles" },
    { name: "Michael Brown", contact: "michael@example.com", priority: "Emergency", location: "Chicago" },
    { name: "Emily Johnson", contact: "222-987-6543", priority: "Routine", location: "Houston" },
    { name: "David Wilson", contact: "david@example.com", priority: "Urgent", location: "San Francisco" },
  ];

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: unpublishedLeads = [] } = useQuery<CaseLeadWithDetails[]>({
    queryKey: ["/api/admin/unpublished-leads"],
  });

  const { data: completedCases = [] } = useQuery<CaseLeadWithDetails[]>({
    queryKey: ["/api/case-leads", "completed"],
    queryFn: async () => {
      return await apiRequest("GET", "/api/case-leads?status=completed");
    },
  });

  const publishLeadMutation = useMutation({
    mutationFn: async (leadId: number) => {
      await apiRequest("PATCH", `/api/case-leads/${leadId}`, { isPublished: true });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead published successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/unpublished-leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/case-leads"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish lead",
        variant: "destructive",
      });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<CaseLeadWithDetails> }) => {
      await apiRequest("PATCH", `/api/case-leads/${data.id}`, data.updates);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/unpublished-leads"] });
      setEditingLead(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (leadId: number) => {
      await apiRequest("DELETE", `/api/case-leads/${leadId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/unpublished-leads"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/users/${data.id}`, { isActive: data.isActive });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User status updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (user: typeof newUser) => {
      await apiRequest("POST", "/api/users", user);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "User added!" });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setShowAddUser(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        role: "student",
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add user", variant: "destructive" });
    },
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'barangay':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'facebook':
        return '📘';
      case 'reddit':
        return '🔴';
      case 'barangay':
        return '🏠';
      default:
        return '📋';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, review leads, and monitor system statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Students"
          value={stats?.activeStudents || 0}
          icon={<span className="text-xl">👥</span>}
          color="blue"
        />
        <StatsCard
          title="Total Case Leads"
          value={stats?.totalLeads || 0}
          icon={<span className="text-xl">📋</span>}
          color="green"
        />
        <StatsCard
          title="Pending Reviews"
          value={stats?.pendingReviews || 0}
          icon={<span className="text-xl">⏰</span>}
          color="orange"
        />
        <StatsCard
          title="Completed Cases"
          value={stats?.completedCases || 0}
          icon={<span className="text-xl">✅</span>}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <Card>
        <Tabs defaultValue="users" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="leads">Lead Managment</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="users" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <Button
                className="bg-medical-blue hover:bg-medical-blue/90"
                onClick={() => setShowAddUser(true)}
              >
                ➕ Add User
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {user.firstName[0]}{user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastActive
                          ? new Date(user.lastActive).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button variant="ghost" size="sm" className="text-medical-blue mr-2">
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() =>
                            toggleUserStatusMutation.mutate({
                              id: user.id,
                              isActive: !user.isActive,
                            })
                          }
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Lead Management</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow"
              >
                Add Lead
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow rounded-lg">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Contact</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Priority</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700">{lead.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{lead.contact}</td>
                      <td
                        className={`px-4 py-2 text-sm font-semibold ${lead.priority === "Urgent"
                          ? "text-red-600"
                          : lead.priority === "Emergency"
                            ? "text-orange-600"
                            : "text-green-600"
                          }`}
                      >
                        {lead.priority}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{lead.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                  <h3 className="text-lg font-semibold mb-4">Add New Lead</h3>

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <input
                        type="text"
                        placeholder="Patient full name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <div className="md:row-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dental Issue Description</label>
                      <textarea
                        rows={5}
                        placeholder="Describe the dental case"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                      <input
                        type="text"
                        placeholder="Phone or email"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                      <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400">
                        <option>Routine</option>
                        <option>Urgent</option>
                        <option>Emergency</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        placeholder="Patient age"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="City or area"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link Source (URL)</label>
                      <input
                        type="url"
                        placeholder="Link"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition"
                      >
                        Submit Lead
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-3">📘</span>
                      <span className="text-sm font-medium text-gray-700">Facebook</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-3">🔴</span>
                      <span className="text-sm font-medium text-gray-700">Reddit</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-3">🏠</span>
                      <span className="text-sm font-medium text-gray-700">Barangay</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Case Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Available</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-gray-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Claimed</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-medical-orange h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Completed</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-medical-success h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={e => {
              e.preventDefault();
              addUserMutation.mutate(newUser);
            }}
          >
            <Input
              placeholder="First Name"
              value={newUser.firstName}
              onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
              required
            />
            <Input
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <Input
              placeholder="Username"
              value={newUser.username}
              onChange={e => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <select
              className="w-full border rounded px-2 py-1"
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="barangay">Barangay</option>
            </select>
            <div className="flex justify-end space-x-2">
              <Button type="submit" className="bg-medical-blue hover:bg-medical-blue/90">
                Add
              </Button>
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
