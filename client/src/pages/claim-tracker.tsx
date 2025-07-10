import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { ClaimedCaseWithDetails } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Mock current user ID - in a real app, this would come from authentication
const CURRENT_USER_ID = 2;

export default function ClaimTracker() {
  const [selectedCase, setSelectedCase] = useState<ClaimedCaseWithDetails | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: claimedCases = [], isLoading } = useQuery<ClaimedCaseWithDetails[]>({
    queryKey: ["/api/claimed-cases", CURRENT_USER_ID],
  });

  const updateCaseMutation = useMutation({
    mutationFn: async (data: { status: string; notes?: string; appointmentDate?: Date }) => {
      if (!selectedCase) return;
      await apiRequest("PATCH", `/api/claimed-cases/${selectedCase.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Case updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/claimed-cases", CURRENT_USER_ID] });
      setSelectedCase(null);
      setNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update case",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'border-l-yellow-400';
      case 'scheduled':
        return 'border-l-blue-400';
      case 'done':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const handleCaseSelect = (claimedCase: ClaimedCaseWithDetails) => {
    setSelectedCase(claimedCase);
    setNotes(claimedCase.notes || "");
  };

  const getUpcomingAppointments = () => {
    return claimedCases.filter(cc => 
      cc.status === 'scheduled' && 
      cc.appointmentDate && 
      new Date(cc.appointmentDate) >= new Date()
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-48" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Case Tracker</h1>
            <p className="text-gray-600">Track and manage your claimed dental cases</p>
          </div>
          <Link href="/student">
            <Button variant="outline">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claimed Cases List */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Claimed Cases</h3>
          <div className="space-y-4">
            {claimedCases.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No claimed cases yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by claiming a case from the available case leads.
                  </p>
                  <Link href="/student">
                    <Button className="bg-medical-blue hover:bg-medical-blue/90">
                      Browse Case Leads
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              claimedCases.map((claimedCase) => (
                <Card 
                  key={claimedCase.id} 
                  className={`border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getStatusBorder(claimedCase.status)} ${
                    selectedCase?.id === claimedCase.id ? 'ring-2 ring-medical-blue ring-opacity-50' : ''
                  }`}
                  onClick={() => handleCaseSelect(claimedCase)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{claimedCase.caseLead.patientName}</h4>
                      <Badge className={getStatusColor(claimedCase.status)}>
                        {claimedCase.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {claimedCase.caseLead.issueDescription}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {claimedCase.status === 'scheduled' && claimedCase.appointmentDate
                          ? `Appointment: ${new Date(claimedCase.appointmentDate).toLocaleDateString()}`
                          : `Claimed: ${new Date(claimedCase.createdAt).toLocaleDateString()}`}
                      </span>
                      <span className="font-medium text-medical-blue">
                        Priority: {claimedCase.caseLead.priority}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        
        {/* Calendar and Case Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📅 Appointment Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              
              {getUpcomingAppointments().length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Appointments</h4>
                  <div className="space-y-2">
                    {getUpcomingAppointments().map((appointment) => (
                      <div key={appointment.id} className="text-xs bg-blue-50 p-2 rounded">
                        <div className="font-medium">{appointment.caseLead.patientName}</div>
                        <div className="text-gray-600">
                          {appointment.appointmentDate && new Date(appointment.appointmentDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📝 Case Management
                {selectedCase && (
                  <Badge variant="outline" className="ml-2">
                    {selectedCase.caseLead.patientName}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedCase ? (
                <div className="text-center py-6">
                  <div className="text-gray-400 text-4xl mb-2">👆</div>
                  <p className="text-gray-600 text-sm">
                    Select a case from the list to manage it
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Notes
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about patient interaction, treatment plans, or follow-up requirements..."
                      rows={4}
                      className="mb-4"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => updateCaseMutation.mutate({
                        status: 'contacted',
                        notes,
                      })}
                      disabled={updateCaseMutation.isPending}
                    >
                      📞 Mark as Contacted
                    </Button>
                    <Button
                      className="w-full bg-medical-blue hover:bg-medical-blue/90 text-white"
                      onClick={() => updateCaseMutation.mutate({
                        status: 'scheduled',
                        notes,
                        appointmentDate: selectedDate,
                      })}
                      disabled={updateCaseMutation.isPending}
                    >
                      📅 Schedule Appointment
                    </Button>
                    <Button
                      className="w-full bg-medical-green hover:bg-medical-green/90 text-white"
                      onClick={() => updateCaseMutation.mutate({
                        status: 'done',
                        notes,
                      })}
                      disabled={updateCaseMutation.isPending}
                    >
                      ✅ Mark as Complete
                    </Button>
                  </div>
                  
                  {selectedCase.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Previous Notes:</h5>
                      <p className="text-sm text-gray-600">{selectedCase.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
