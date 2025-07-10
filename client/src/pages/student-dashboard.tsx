import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { CaseLeadCard } from "@/components/case-lead-card";
import { CaseDetailModal } from "@/components/case-detail-modal";
import { ClaimTrackerModal } from "@/components/claim-tracker-modal";
import { CaseLeadWithDetails, SavedCaseWithDetails, ClaimedCaseWithDetails } from "@/lib/types";

// Mock current user ID - in a real app, this would come from authentication
const CURRENT_USER_ID = 2;

export default function StudentDashboard() {
  const [selectedCase, setSelectedCase] = useState<CaseLeadWithDetails | null>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showClaimTracker, setShowClaimTracker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  const { data: caseLeads = [] } = useQuery<CaseLeadWithDetails[]>({
    queryKey: ["/api/case-leads"],
  });

  const { data: savedCases = [] } = useQuery<SavedCaseWithDetails[]>({
    queryKey: ["/api/saved-cases", CURRENT_USER_ID],
  });

  const { data: claimedCases = [] } = useQuery<ClaimedCaseWithDetails[]>({
    queryKey: ["/api/claimed-cases", CURRENT_USER_ID],
  });

  // Filter available case leads
  const filteredCaseLeads = caseLeads.filter((caseLead) => {
    if (caseLead.status !== 'available') return false;
    
    const matchesSearch = caseLead.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseLead.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = sourceFilter === "all" || caseLead.source === sourceFilter;
    
    return matchesSearch && matchesSource;
  });

  // Calculate completed cases
  const completedCases = claimedCases.filter(cc => cc.status === 'done');

  const handleViewDetails = (caseLead: CaseLeadWithDetails) => {
    setSelectedCase(caseLead);
    setShowCaseModal(true);
  };

  const handleViewProgress = () => {
    setShowClaimTracker(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Browse and manage dental case leads</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Available Cases"
          value={filteredCaseLeads.length}
          icon={<span className="text-xl">📋</span>}
          color="blue"
        />
        <StatsCard
          title="Saved Cases"
          value={savedCases.length}
          icon={<span className="text-xl">🔖</span>}
          color="green"
        />
        <StatsCard
          title="Claimed Cases"
          value={claimedCases.length}
          icon={<span className="text-xl">✅</span>}
          color="orange"
        />
        <StatsCard
          title="Completed"
          value={completedCases.length}
          icon={<span className="text-xl">🎯</span>}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <Card>
        <Tabs defaultValue="cases" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cases">Case Leads</TabsTrigger>
              <TabsTrigger value="saved">Saved Cases</TabsTrigger>
              <TabsTrigger value="claimed">Claimed Cases</TabsTrigger>
              <TabsTrigger value="history">Case History</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="cases" className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Available Case Leads</h2>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="md:w-64"
                />
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="md:w-40">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="barangay">Barangay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCaseLeads.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No available case leads found.</p>
                </div>
              ) : (
                filteredCaseLeads.map((caseLead) => (
                  <CaseLeadCard
                    key={caseLead.id}
                    caseLead={caseLead}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Case Leads</h2>
            <div className="space-y-4">
              {savedCases.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No saved cases yet.</p>
              ) : (
                savedCases.map((savedCase) => (
                  <Card key={savedCase.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-3 text-xl">🔖</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{savedCase.caseLead.patientName}</h3>
                            <p className="text-sm text-gray-600">
                              {savedCase.caseLead.issueDescription.substring(0, 100)}... - {savedCase.caseLead.source}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            className="bg-medical-blue hover:bg-medical-blue/90"
                            onClick={() => handleViewDetails(savedCase.caseLead)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="claimed" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Claimed Cases</h2>
              <Button
                className="bg-medical-blue hover:bg-medical-blue/90"
                onClick={handleViewProgress}
              >
                🗓️ View Progress Tracker
              </Button>
            </div>
            <div className="space-y-4">
              {claimedCases.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No claimed cases yet.</p>
              ) : (
                claimedCases.map((claimedCase) => (
                  <Card key={claimedCase.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{claimedCase.caseLead.patientName}</h3>
                        <Badge className={getStatusColor(claimedCase.status)}>
                          {claimedCase.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {claimedCase.caseLead.issueDescription.substring(0, 100)}... - {claimedCase.caseLead.source}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Claimed {new Date(claimedCase.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-medical-blue hover:text-blue-700"
                          onClick={handleViewProgress}
                        >
                          View Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Case History</h2>
            <div className="space-y-4">
              {completedCases.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No completed cases yet.</p>
              ) : (
                completedCases.map((completedCase) => (
                  <Card key={completedCase.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{completedCase.caseLead.patientName}</h3>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {completedCase.caseLead.issueDescription.substring(0, 100)}... - {completedCase.caseLead.source}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Completed {new Date(completedCase.updatedAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-medical-blue hover:text-blue-700"
                          onClick={() => handleViewDetails(completedCase.caseLead)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Modals */}
      <CaseDetailModal
        caseLead={selectedCase}
        open={showCaseModal}
        onClose={() => setShowCaseModal(false)}
        currentUserId={CURRENT_USER_ID}
      />

      <ClaimTrackerModal
        claimedCases={claimedCases}
        open={showClaimTracker}
        onClose={() => setShowClaimTracker(false)}
        currentUserId={CURRENT_USER_ID}
      />
    </div>
  );
}
