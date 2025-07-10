import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StatsCard } from "@/components/stats-card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCaseLeadSchema } from "@shared/schema";
import { z } from "zod";

// Mock current user ID - in a real app, this would come from authentication  
const CURRENT_USER_ID = 3;

const formSchema = insertCaseLeadSchema.extend({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  contactInfo: z.string().min(5, "Contact information is required"),
  address: z.string().min(10, "Complete address is required"),
  issueDescription: z.string().min(20, "Please provide a detailed description"),
  priority: z.enum(["routine", "moderate", "urgent"]),
  location: z.string().min(2, "Location is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function BarangayDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      contactInfo: "",
      address: "",
      issueDescription: "",
      priority: "routine",
      location: "",
      source: "barangay",
      submittedBy: CURRENT_USER_ID,
    },
  });

  // Mock query for barangay submitted cases
  const { data: submittedCases = [] } = useQuery({
    queryKey: ["/api/case-leads"],
    select: (data: any[]) => data.filter(caseLead => caseLead.submittedBy === CURRENT_USER_ID),
  });

  const submitCaseMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await apiRequest("POST", "/api/case-leads", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Case submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/case-leads"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit case",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitCaseMutation.mutate(data);
  };

  // Calculate stats
  const completedCases = submittedCases.filter((c: any) => c.status === 'completed').length;
  const pendingCases = submittedCases.filter((c: any) => c.status === 'available').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Barangay Health Worker Dashboard</h1>
        <p className="text-gray-600">Submit and track community dental cases</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Cases Submitted"
          value={submittedCases.length}
          icon={<span className="text-xl">➕</span>}
          color="blue"
        />
        <StatsCard
          title="Cases Completed"
          value={completedCases}
          icon={<span className="text-xl">✅</span>}
          color="green"
        />
        <StatsCard
          title="Pending Cases"
          value={pendingCases}
          icon={<span className="text-xl">⏰</span>}
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit New Case Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit New Case</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone or email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Patient age" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City or area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete address" rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dental Issue Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the dental problem" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                  disabled={submitCaseMutation.isPending}
                >
                  {submitCaseMutation.isPending ? "Submitting..." : "Submit Case"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Recent Cases */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submittedCases.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No cases submitted yet.</p>
              ) : (
                submittedCases.map((caseItem: any) => (
                  <Card key={caseItem.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{caseItem.patientName}</h3>
                        <Badge className={getStatusColor(caseItem.status)}>
                          {caseItem.status === 'available' ? 'Available' : 
                           caseItem.status === 'claimed' ? 'In Progress' : 'Completed'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {caseItem.issueDescription.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Age: {caseItem.age || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Submitted {new Date(caseItem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
