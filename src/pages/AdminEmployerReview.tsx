import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Employer {
  id: string;
  companyName: string;
  email: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  createdAt: Timestamp;
}

const AdminEmployerReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: employers, isLoading, error } = useQuery<Employer[]>({
    queryKey: ['employers'],
    queryFn: async () => {
      const employersCollection = collection(db, "employers");
      const querySnapshot = await getDocs(query(employersCollection, orderBy("createdAt", "desc")));
      const employerList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Employer, 'id'>)
      }));
      // sort by status: Pending first
      employerList.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        // if statuses are same, secondary sort by date is already handled by query
        return 0;
      });
      return employerList;
    },
  });

  const updateEmployerStatus = useMutation({
    mutationFn: async ({ employerId, status }: { employerId: string, status: 'Verified' | 'Rejected' }) => {
      const employerDocRef = doc(db, 'employers', employerId);
      await updateDoc(employerDocRef, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
      toast({
        title: "Success",
        description: `Employer has been ${variables.status.toLowerCase()}.`,
      });
    },
    onError: (err, variables) => {
      toast({
        title: "Error",
        description: `Failed to update employer status to ${variables.status.toLowerCase()}.`,
        variant: "destructive",
      });
      console.error("Error updating employer status:", err);
    }
  });

  const handleUpdateStatus = (employerId: string, status: 'Verified' | 'Rejected') => {
    updateEmployerStatus.mutate({ employerId, status });
  };

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
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Employer Review</h1>
          <p className="text-gray-600">Review and manage employer registrations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employer Applications</CardTitle>
            <CardDescription>Review and approve employer registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Jobs Posted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-destructive py-8">
                      Failed to load employers.
                    </TableCell>
                  </TableRow>
                ) : employers && employers.length > 0 ? (
                  employers.map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell className="font-medium">{employer.companyName}</TableCell>
                      <TableCell>{employer.email}</TableCell>
                      <TableCell>
                        {getStatusBadge(employer.status)}
                      </TableCell>
                      <TableCell>{employer.createdAt?.toDate().toLocaleDateString() || 'N/A'}</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {employer.status === 'Pending' && (
                            <>
                              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleUpdateStatus(employer.id, 'Verified')}>
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleUpdateStatus(employer.id, 'Rejected')}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                       <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                       <h3 className="text-xl font-medium text-gray-700 mb-1">No employer applications</h3>
                       <p className="text-gray-500">There are no pending employer applications to review.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminEmployerReview;
