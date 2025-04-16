
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { adoptionService } from '@/services/adoptionService';
import { AdoptionRequest } from '@/types/pet';
import { toast } from '@/hooks/use-toast';

interface AdoptionRequestsListProps {
  petId: string;
  onRequestsUpdated?: () => void;
}

const AdoptionRequestsList: React.FC<AdoptionRequestsListProps> = ({ petId, onRequestsUpdated }) => {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adoptionService.getRequestsForPet(petId);
      setRequests(data);
    } catch (err) {
      setError('Failed to load adoption requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [petId]);

  const handleResponse = async (requestId: string, approved: boolean) => {
    try {
      setUpdating(prev => ({ ...prev, [requestId]: true }));
      await adoptionService.respondToRequest(requestId, approved);
      
      // Update the local state
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: approved ? 'approved' : 'rejected' } 
            : req
        )
      );
      
      toast({
        title: approved ? "Request Approved" : "Request Rejected",
        description: approved 
          ? "You have approved the adoption request. The adopter will be notified." 
          : "You have rejected the adoption request. The adopter will be notified.",
      });
      
      if (onRequestsUpdated) onRequestsUpdated();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to respond to the adoption request.",
        variant: "destructive",
      });
    } finally {
      setUpdating(prev => ({ ...prev, [requestId]: false }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading adoption requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={loadRequests}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">No adoption requests yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Adoption Requests</h3>
      
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={request.userAvatar} alt={request.userName} />
                  <AvatarFallback>{request.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{request.userName}</CardTitle>
                  <CardDescription>
                    {format(new Date(request.createdAt), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
              </div>
              <StatusBadge status={request.status} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{request.message}</p>
          </CardContent>
          {request.status === 'pending' && (
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleResponse(request.id, false)} 
                disabled={updating[request.id]}
              >
                {updating[request.id] ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </>
                )}
              </Button>
              <Button 
                size="sm"
                onClick={() => handleResponse(request.id, true)}
                disabled={updating[request.id]}
              >
                {updating[request.id] ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Declined
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

export default AdoptionRequestsList;
