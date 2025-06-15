import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Briefcase, 
  MapPin, 
  Building, 
  Calendar, 
  Star,
  CheckCircle2,
  Clock
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useToast } from "@/hooks/use-toast";
import JobApplicationDialog from "@/components/JobApplicationDialog";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Job } from "@/types/job";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("all");
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  
  const [isLoggedIn] = useState(() => {
    return localStorage.getItem('userLoggedIn') === 'true';
  });
  const [userRole] = useState<'student' | 'admin' | null>(() => {
    if (!isLoggedIn) return null;
    return localStorage.getItem('userRole') as 'student' | 'admin' || 'student';
  });

  const { data: jobListings, isLoading, error } = useQuery<Job[]>({
    queryKey: ['jobs', 'visible'],
    queryFn: async () => {
      const jobsCollection = collection(db, "jobs");
      const q = query(jobsCollection, where("status", "in", ["Active", "Pending"]), orderBy("postedDate", "desc"));
      const jobSnapshot = await getDocs(q);
      return jobSnapshot.docs.map(doc => ({ ...(doc.data() as Omit<Job, 'id'>), id: doc.id }));
    },
  });
  
  const filteredJobs = jobListings?.filter(job => {
    const matchesSearch = 
      (job.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (job.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesType = jobType === "all" || job.type === jobType;
    
    return matchesSearch && matchesType;
  }) ?? [];

  const applyForJob = (job: Job) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login as a student to apply for jobs.",
        variant: "destructive"
      });
      return;
    }
    setSelectedJob(job);
    setApplicationDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-4 md:mb-0">Job Listings</h1>
          <div className="flex gap-3">
            <Link to="/applications">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Briefcase className="mr-2 h-4 w-4" />
                My Applications
              </Button>
            </Link>
            <Link to="/recommendations">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Star className="mr-2 h-4 w-4" />
                Career Recommendations
              </Button>
            </Link>
            {userRole === 'admin' && (
              <Link to="/admin/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Input 
              placeholder="Search jobs, companies, or locations..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Job Listings */}
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /></CardContent>
                <CardFooter><Skeleton className="h-8 w-24" /></CardFooter>
              </Card>
            ))
          ) : error ? (
             <div className="text-center py-12 text-destructive">
              <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-1">Error loading jobs</h3>
              <p className="text-gray-500">Could not fetch job listings. Please try again later.</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-unisphere-darkBlue">{job.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building className="h-4 w-4 mr-1" />
                        <span className="text-unisphere-blue">{job.company}</span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {job.type && (
                        <Badge variant="outline" className="text-unisphere-darkBlue">
                          {job.type}
                        </Badge>
                      )}
                      {job.status === 'Pending' && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location || 'Not specified'}</span>
                  </div>
                  <p className="text-gray-700">
                    {job.description || 'No description available.'}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-4">
                  <div className="flex items-center text-gray-500 mb-2 sm:mb-0">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Deadline: {job.deadline.toDate().toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
                      onClick={() => applyForJob(job)}
                      disabled={job.status !== 'Active'}
                    >
                      {job.status !== 'Active' ? 'Pending Approval' : (isLoggedIn ? "Apply Now" : "Login to Apply")}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-1">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
        
        {/* Pagination removed as it's not connected to Firestore yet */}

        {/* Application Dialog */}
        {selectedJob && (
          <JobApplicationDialog 
            job={{
              id: selectedJob.id,
              title: selectedJob.title,
              company: selectedJob.company,
              location: selectedJob.location || 'Not specified',
            }}
            open={applicationDialogOpen}
            onOpenChange={setApplicationDialogOpen}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Jobs;
