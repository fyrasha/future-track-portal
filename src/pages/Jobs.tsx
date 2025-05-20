
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
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Building, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Trash 
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import JobApplicationDialog from "@/components/JobApplicationDialog";

// Mock job data
const jobListings = [
  {
    id: A1,
    title: "Software Engineer Intern",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Internship",
    postedDate: "2025-05-15",
    deadline: "2025-06-30",
    description: "Great opportunity for students to gain hands-on experience with modern web technologies and agile development practices."
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Analytics Pro",
    location: "Remote",
    type: "Full-time",
    postedDate: "2025-05-10",
    deadline: "2025-06-15",
    description: "Join our data team to help transform complex data into actionable insights for business decisions."
  },
  {
    id: 3,
    title: "Marketing Assistant",
    company: "Brand Masters",
    location: "New York, NY",
    type: "Part-time",
    postedDate: "2025-05-17",
    deadline: "2025-06-20",
    description: "Support our marketing team in creating engaging content and managing social media campaigns."
  },
  {
    id: 4,
    title: "UX/UI Design Intern",
    company: "Creative Solutions",
    location: "Chicago, IL",
    type: "Internship",
    postedDate: "2025-05-12",
    deadline: "2025-07-01",
    description: "Help design intuitive and beautiful user interfaces for our web and mobile applications."
  },
  {
    id: 5,
    title: "Finance Analyst",
    company: "Global Finance",
    location: "Boston, MA",
    type: "Full-time",
    postedDate: "2025-05-14",
    deadline: "2025-06-25",
    description: "Analyze financial data and prepare reports to support strategic business decisions."
  }
];

// Application statuses for tracking
const applicationStatuses = {
  1: "Applied",
  2: "Under Review",
  3: "Not Started",
  4: "Under Review",
  5: "Interview Scheduled"
};

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for admin view
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<typeof jobListings[0] | null>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  
  // Filter jobs based on search term and job type
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = jobType === "all" || job.type === jobType;
    
    return matchesSearch && matchesType;
  });

  const applyForJob = (job: typeof jobListings[0]) => {
    setSelectedJob(job);
    setApplicationDialogOpen(true);
  };

  const handleApplicationSubmitted = (jobId: number) => {
    // In a real app, this would update the backend
    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted.",
    });
  };

  const deleteJob = (jobId: number) => {
    toast({
      title: "Job Deleted",
      description: "The job posting has been removed.",
    });
  };

  const toggleAdminView = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-4 md:mb-0">Job Listings</h1>
          <div className="flex gap-3">
            <Link to="/applications">
              <Button className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                <Briefcase className="mr-2 h-4 w-4" />
                My Applications
              </Button>
            </Link>
            <Link to="/recommendations">
              <Button className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                <Star className="mr-2 h-4 w-4" />
                Career Recommendations
              </Button>
            </Link>
            <Button 
              onClick={toggleAdminView} 
              variant="outline"
              className="border-unisphere-darkBlue text-unisphere-darkBlue hover:bg-unisphere-darkBlue/10"
            >
              {isAdmin ? "Switch to Student View" : "Switch to Admin View"}
            </Button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Input 
              placeholder="Search jobs, companies, or locations..." 
              value={searchTerm}
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
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-unisphere-darkBlue">{job.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-unisphere-lightBlue/20 text-unisphere-darkBlue px-3 py-1 rounded-full text-sm font-medium">
                        {job.type}
                      </span>
                      {!isAdmin && applicationStatuses[job.id as keyof typeof applicationStatuses] && (
                        <Badge className={
                          applicationStatuses[job.id as keyof typeof applicationStatuses] === "Applied" ? "bg-green-100 text-green-800" :
                          applicationStatuses[job.id as keyof typeof applicationStatuses] === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                          applicationStatuses[job.id as keyof typeof applicationStatuses] === "Interview Scheduled" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }>
                          {applicationStatuses[job.id as keyof typeof applicationStatuses] === "Applied" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : applicationStatuses[job.id as keyof typeof applicationStatuses] === "Under Review" ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : null}
                          {applicationStatuses[job.id as keyof typeof applicationStatuses]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <p className="text-gray-700">{job.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-4">
                  <div className="flex items-center text-gray-500 mb-2 sm:mb-0">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Job
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => deleteJob(job.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Job
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link to={`/jobs/${job.id}`}>
                        <Button 
                          variant="outline" 
                          className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
                        >
                          View Details
                        </Button>
                      </Link>
                      <Button 
                        className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
                        onClick={() => applyForJob(job)}
                        disabled={applicationStatuses[job.id as keyof typeof applicationStatuses] === "Applied" || applicationStatuses[job.id as keyof typeof applicationStatuses] === "Under Review"}
                      >
                        {applicationStatuses[job.id as keyof typeof applicationStatuses] === "Applied" || applicationStatuses[job.id as keyof typeof applicationStatuses] === "Under Review" ? "Applied" : "Apply Now"}
                      </Button>
                    </div>
                  )}
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
        
        {/* Pagination */}
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Application Dialog */}
        {selectedJob && (
          <JobApplicationDialog 
            job={selectedJob}
            open={applicationDialogOpen}
            onOpenChange={setApplicationDialogOpen}
            onApplied={handleApplicationSubmitted}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Jobs;
