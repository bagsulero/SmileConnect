import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CaseLeadWithDetails } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Mock current user ID - in a real app, this would come from authentication
const CURRENT_USER_ID = 2;

export default function CaseDetail() {
  const [match, params] = useRoute("/case/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const caseId = params?.id ? parseInt(params.id) : null;

  const { data: caseLead, isLoading, error } = useQuery<CaseLeadWithDetails>({
    queryKey: ["/api/case-leads", caseId],
    enabled: !!caseId,
  });

  const saveCaseMutation = useMutation({
    mutationFn: async () => {
      if (!caseLead) return;
      await apiRequest("POST", "/api/saved-cases", {
        userId: CURRENT_USER_ID,
        caseLeadId: caseLead.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Case saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-cases", CURRENT_USER_ID] });
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
        userId: CURRENT_USER_ID,
        caseLeadId: caseLead.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Case claimed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/claimed-cases", CURRENT_USER_ID] });
      queryClient.invalidateQueries({ queryKey: ["/api/case-leads"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to claim case",
        variant: "destructive",
      });
    },
  });

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

  if (!match || !caseId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Case ID</h1>
            <p className="text-gray-600 mb-6">The case you're looking for could not be found.</p>
            <Link href="/student">
              <Button className="bg-medical-blue hover:bg-medical-blue/90">
                ← Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !caseLead) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Case Not Found</h1>
            <p className="text-gray-600 mb-6">
              The case you're looking for could not be found or may have been removed.
            </p>
            <Link href="/student">
              <Button className="bg-medical-blue hover:bg-medical-blue/90">
                ← Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Case Details</h1>
              <p className="text-gray-600 mt-2">Patient: {caseLead.patientName}</p>
            </div>
            <Link href="/student">
              <Button variant="outline">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
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
                    {new Date(caseLead.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{caseLead.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <Badge variant={caseLead.status === 'available' ? 'default' : 'secondary'}>
                    {caseLead.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Description</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {caseLead.issueDescription}
              </p>
            </div>
          </div>
          
          {caseLead.status === 'available' && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  className="bg-medical-green hover:bg-medical-green/90 text-white"
                  onClick={() => saveCaseMutation.mutate()}
                  disabled={saveCaseMutation.isPending}
                >
                  📌 {saveCaseMutation.isPending ? 'Saving...' : 'Save Case'}
                </Button>
                <Button 
                  className="bg-medical-blue hover:bg-medical-blue/90 text-white"
                  onClick={() => claimCaseMutation.mutate()}
                  disabled={claimCaseMutation.isPending}
                >
                  ✅ {claimCaseMutation.isPending ? 'Claiming...' : 'Claim Case'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
