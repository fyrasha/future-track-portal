import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, Timestamp, query, where, addDoc, serverTimestamp } from "firebase/firestore";
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

  const { data: employers, isLoading, error } = useQuery<Employer[], Error>({
    queryKey: ['employers-from-jobs'],
    queryFn: async () => {
      console.log("Fetching unique companies from 'job' collection...");
      const jobsCollection = collection(db, "job");
      const jobsSnapshot = await getDocs(jobsCollection);

      if (jobsSnapshot.empty) {
        console.log("The 'job' collection is empty.");
        return [];
      }

      const companiesMap = new Map<string, Omit<Employer, 'status' | 'id'>>();
      jobsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const company = data.company;
        if (company && typeof company === 'object' && company.email) {
          const email = company.email;
          if (!companiesMap.has(email)) {
            companiesMap.set(email, {
              companyName: company.name || "Unnamed Company",
              email: email,
              createdAt: data.postedDate || Timestamp.now(),
            });
          }
        }
      });

      if (companiesMap.size === 0) return [];
      
      const employerEmails = Array.from(companiesMap.keys());
      const employersRef = collection(db, "employers");
      // Firestore 'in' query is limited to 30 elements. If more are needed, batching is required.
      const q = query(employersRef, where('email', 'in', employerEmails));
      const employersSnapshot = await getDocs(q);
      
      const statusMap = new Map<string, 'Pending' | 'Verified' | 'Rejected'>();
      employersSnapshot.forEach(doc => {
          const data = doc.data();
          statusMap.set(data.email, data.status);
      });

      const employerList: Employer[] = employerEmails.map(email => {
          const companyData = companiesMap.get(email)!;
          return {
              ...companyData,
              id: email, // Use email as ID for the list
              status: statusMap.get(email) || 'Pending',
          };
      });

      employerList.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });
      
      console.log("Returning processed and sorted employers from jobs:", employerList);
      return employerList;
    },
    onError: (err) => {
      console.error("Error fetching employers from jobs:", err);
    }
  });

  const updateEmployerStatus = useMutation({
    mutationFn: async ({ employer, status }: { employer: Employer, status: 'Verified' | 'Rejected' }) => {
      const employersRef = collection(db, 'employers');
      const q = query(employersRef, where("email", "==", employer.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`Employer with email ${employer.email} not found, creating new entry.`);
        await addDoc(collection(db, "employers"), {
            companyName: employer.companyName,
            email: employer.email,
            status: status,
            createdAt: serverTimestamp(),
        });
      } else {
        console.log(`Employer with email ${employer.email} found, updating status.`);
        const employerDoc = querySnapshot.docs[0];
        await updateDoc(employerDoc.ref, { status });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employers-from-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employers'] });
      toast({
        title: "Success",
        description: `Employer status has been updated to ${variables.status.toLowerCase()}.`,
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

  const handleUpdateStatus = (employer: Employer, status: 'Verified' | 'Rejected') => {
    updateEmployerStatus.mutate({ employer, status });
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
                      Failed to load employers. {error && `Details: ${error.message}`}
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
                              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleUpdateStatus(employer, 'Verified')}>
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleUpdateStatus(employer, 'Rejected')}>
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
