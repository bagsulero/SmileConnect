import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CaseLeadWithDetails } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CaseDetailModalProps {
  caseLead: CaseLeadWithDetails | null;
  open: boolean;
  onClose: () => void;
  currentUserId: number;
}

export function CaseDetailModal({ caseLead, open, onClose, currentUserId }: CaseDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveCaseMutation = useMutation({
    mutationFn: async () => {
      if (!caseLead) return;
      await apiRequest("POST", "/api/saved-cases", {
        userId: currentUserId,
        caseLeadId: caseLead.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Case saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-cases", currentUserId] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save case",
        variant: "destructive",
      });
    },
  });

  const claimCaseMutation = useMutation({
    mutationFn: async () => {
      if (!caseLead) return;
      await apiRequest("POST", "/api/claimed-cases", {
        userId: currentUserId,
        caseLeadId: caseLead.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Case claimed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/claimed-cases", currentUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/case-leads"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to claim case",
        variant: "destructive",
      });
    },
  });

  if (!caseLead) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'routine':
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Case Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{caseLead.patientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <p className="text-sm text-gray-900">{caseLead.age || 'Not specified'} years old</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <p className="text-sm text-gray-900">{caseLead.contactInfo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{caseLead.address}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Source</label>
                  <div className="flex items-center">
                    <span className="mr-2">{getSourceIcon(caseLead.source)}</span>
                    <span className="text-sm text-gray-900 capitalize">{caseLead.source}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <Badge className={getPriorityColor(caseLead.priority)}>
                    {caseLead.priority}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Submitted</label>
                  <p className="text-sm text-gray-900">
                    {new Date(caseLead.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{caseLead.location}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Description</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              {caseLead.issueDescription}
            </p>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button 
              className="bg-medical-green hover:bg-medical-green/90 text-white"
              onClick={() => saveCaseMutation.mutate()}
              disabled={saveCaseMutation.isPending}
            >
              📌 Save Case
            </Button>
            <Button 
              className="bg-medical-blue hover:bg-medical-blue/90 text-white"
              onClick={() => claimCaseMutation.mutate()}
              disabled={claimCaseMutation.isPending}
            >
              ✅ Claim Case
            </Button>
            <Button variant="outline" onClick={onClose}>
              ← Back
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
