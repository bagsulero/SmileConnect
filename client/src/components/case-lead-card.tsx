import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseLeadWithDetails } from "@/lib/types";

interface CaseLeadCardProps {
  caseLead: CaseLeadWithDetails;
  onViewDetails: (caseLead: CaseLeadWithDetails) => void;
}

export function CaseLeadCard({ caseLead, onViewDetails }: CaseLeadCardProps) {
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

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="mr-2">{getSourceIcon(caseLead.source)}</span>
            <span className="text-sm font-medium text-gray-600 capitalize">{caseLead.source}</span>
          </div>
          <span className="text-xs text-gray-500">{getTimeAgo(caseLead.createdAt)}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{caseLead.patientName}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{caseLead.issueDescription}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(caseLead.priority)}>
              {caseLead.priority}
            </Badge>
            <Badge variant="secondary">{caseLead.location}</Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-medical-blue hover:text-blue-700"
            onClick={() => onViewDetails(caseLead)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
