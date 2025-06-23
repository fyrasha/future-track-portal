
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Building, Mail, Calendar } from "lucide-react";
import { Timestamp } from "firebase/firestore";

interface Employer {
  id: string;
  companyName: string;
  email: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  createdAt: Timestamp;
}

interface EmployerDetailsDialogProps {
  employer: Employer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (employerId: string, status: 'Verified' | 'Rejected') => void;
}

const EmployerDetailsDialog = ({ employer, open, onOpenChange, onUpdateStatus }: EmployerDetailsDialogProps) => {
  if (!employer) return null;

  const getStatusBadge = (status: Employer['status']) => {
    switch (status) {
      case 'Verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100/80">
            <XCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Employer Details
          </DialogTitle>
          <DialogDescription>
            Review and manage employer registration
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{employer.companyName}</CardTitle>
              <CardDescription>Company Information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Company Name</label>
                  <p className="text-sm font-medium">{employer.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(employer.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Contact Email
                  </label>
                  <p className="text-sm">{employer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Registration Date
                  </label>
                  <p className="text-sm">{employer.createdAt?.toDate().toLocaleDateString() || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            {employer.status !== 'Rejected' && (
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  onUpdateStatus(employer.id, 'Rejected');
                  onOpenChange(false);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            )}
            {employer.status !== 'Verified' && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onUpdateStatus(employer.id, 'Verified');
                  onOpenChange(false);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployerDetailsDialog;
