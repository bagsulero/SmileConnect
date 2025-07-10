import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ClaimedCaseWithDetails } from "@/lib/types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ClaimTrackerModalProps {
  claimedCases: ClaimedCaseWithDetails[];
  open: boolean;
  onClose: () => void;
  currentUserId: number;
}

export function ClaimTrackerModal({ claimedCases, open, onClose, currentUserId }: ClaimTrackerModalProps) {
  const [selectedCase, setSelectedCase] = useState<ClaimedCaseWithDetails | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["/api/claimed-cases", currentUserId] });
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim Case Tracker</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Claimed Cases List */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Claimed Cases</h3>
            <div className="space-y-4">
              {claimedCases.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No claimed cases yet.</p>
              ) : (
                claimedCases.map((claimedCase) => (
                  <Card key={claimedCase.id} className={`border-l-4 ${getStatusBorder(claimedCase.status)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{claimedCase.caseLead.patientName}</h4>
                        <Badge className={getStatusColor(claimedCase.status)}>
                          {claimedCase.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {claimedCase.caseLead.issueDescription.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {claimedCase.status === 'scheduled' && claimedCase.appointmentDate
                            ? `Appointment: ${new Date(claimedCase.appointmentDate).toLocaleDateString()}`
                            : `Claimed ${new Date(claimedCase.createdAt).toLocaleDateString()}`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-medical-blue hover:text-blue-700"
                          onClick={() => {
                            setSelectedCase(claimedCase);
                            setNotes(claimedCase.notes || "");
                          }}
                        >
                          Update Status
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
          
          {/* Calendar and Notes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Patient Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about patient interaction..."
                  rows={4}
                  className="mb-4"
                />
                <div className="space-y-2">
                  <Button
                    className="w-full bg-medical-blue hover:bg-medical-blue/90 text-white"
                    onClick={() => updateCaseMutation.mutate({
                      status: 'contacted',
                      notes,
                    })}
                    disabled={updateCaseMutation.isPending || !selectedCase}
                  >
                    Mark as Contacted
                  </Button>
                  <Button
                    className="w-full bg-medical-orange hover:bg-medical-orange/90 text-white"
                    onClick={() => updateCaseMutation.mutate({
                      status: 'scheduled',
                      notes,
                      appointmentDate: selectedDate,
                    })}
                    disabled={updateCaseMutation.isPending || !selectedCase}
                  >
                    Schedule Appointment
                  </Button>
                  <Button
                    className="w-full bg-medical-green hover:bg-medical-green/90 text-white"
                    onClick={() => updateCaseMutation.mutate({
                      status: 'done',
                      notes,
                    })}
                    disabled={updateCaseMutation.isPending || !selectedCase}
                  >
                    Mark as Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
