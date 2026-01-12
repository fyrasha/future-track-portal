import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  Briefcase,
  CheckCircle2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Job } from "@/types/job";
import JobApplicationDialog from "@/components/JobApplicationDialog";
import { useToast } from "@/hooks/use-toast";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyVerified, setCompanyVerified] = useState(false);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  
  const [isLoggedIn] = useState(() => localStorage.getItem('userLoggedIn') === 'true');

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const jobDoc = await getDoc(doc(db, "jobs", id));
        if (jobDoc.exists()) {
          const jobData = { id: jobDoc.id, ...jobDoc.data() } as Job;
          setJob(jobData);

          // Check if company is verified
          if (jobData.companyId) {
            const companyDoc = await getDoc(doc(db, "employers", jobData.companyId));
            if (companyDoc.exists()) {
              setCompanyVerified(companyDoc.data().status === 'Verified');
            }
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login as a student to apply for jobs.",
        variant: "destructive"
      });
      return;
    }
    setApplicationDialogOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Job Not Found</h2>
            <p className="text-gray-500 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/jobs")} className="bg-unisphere-darkBlue hover:bg-unisphere-blue">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/jobs")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building className="h-5 w-5" />
                <span className="text-lg">{job.company}</span>
                {companyVerified && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location || 'Not specified'}
                </span>
                {job.type && (
                  <Badge variant="outline">{job.type}</Badge>
                )}
                {job.status === 'Pending' && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Approval
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description || 'No description provided.'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Apply for this Position</CardTitle>
                <CardDescription>Submit your application today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className="font-medium">{job.deadline?.toDate?.().toLocaleDateString() || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-500">Posted On</p>
                      <p className="font-medium">{job.postedDate?.toDate?.().toLocaleDateString() || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue"
                  onClick={handleApply}
                  disabled={job.status !== 'Active'}
                >
                  {job.status !== 'Active' ? 'Pending Approval' : (isLoggedIn ? 'Apply Now' : 'Login to Apply')}
                </Button>

                <Link to={`/company/${job.companyId}`} className="block">
                  <Button variant="outline" className="w-full">
                    <Building className="mr-2 h-4 w-4" />
                    View Company
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      {job && (
        <JobApplicationDialog 
          job={{
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location || 'Not specified',
          }}
          open={applicationDialogOpen}
          onOpenChange={setApplicationDialogOpen}
        />
      )}
    </MainLayout>
  );
};

export default JobDetails;
