
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle2, 
  Clock,
  Building,
  MapPin,
  FileText,
  LogIn,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/MainLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import ApplicationDetailsDialog from "../components/ApplicationDetailsDialog";

interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  location?: string;
  appliedAt: Timestamp;
  status: string;
  nextSteps?: string;
}

const Applications = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const id = localStorage.getItem('userId');
      setIsLoggedIn(loggedIn);
      setUserId(id);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const { data: applications, isLoading, isError } = useQuery<Application[]>({
    queryKey: ['applications', userId],
    queryFn: async () => {
      if (!userId) return [];
      // Query without ordering to avoid needing a composite index in Firestore.
      // Sorting is done on the client-side after fetching.
      const q = query(collection(db, "applications"), where("studentId", "==", userId));
      const snapshot = await getDocs(q);
      const appData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      
      // Sort applications by date, newest first.
      return appData.sort((a, b) => b.appliedAt.toMillis() - a.appliedAt.toMillis());
    },
    enabled: !!userId,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Applied":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>;
      case "Under Review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>;
      case "Interview Scheduled":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          <Calendar className="h-3 w-3 mr-1" />
          {status}
        </Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          {status}
        </Badge>;
      case "Offer Received":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {status}
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">My Applications</h1>
            <p className="text-gray-600">Track all your job applications and their current status</p>
          </div>

          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-unisphere-blue/10 p-4 rounded-full">
                  <FileText className="h-12 w-12 text-unisphere-blue" />
                </div>
              </div>
              <CardTitle className="text-xl text-unisphere-darkBlue">No Applications Yet</CardTitle>
              <CardDescription>
                Please log in to view and track your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login to View Applications
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="w-full border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your job applications and their current status</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableCaption>A list of your recent job applications.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Steps</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="p-2">
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-destructive py-10">
                    <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                    Could not load your applications.
                  </TableCell>
                </TableRow>
              ) : applications && applications.length > 0 ? (
                applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.jobTitle}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-500" />
                        {application.companyName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {application.location || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>{application.appliedAt.toDate().toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>{application.nextSteps || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
                        onClick={() => handleViewDetails(application)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                     <FileText className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                    You haven't applied to any jobs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ApplicationDetailsDialog
        application={selectedApplication}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </MainLayout>
  );
};

export default Applications;
