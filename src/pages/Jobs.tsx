
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
import { Briefcase, MapPin, Building, Calendar } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Mock job data
const jobListings = [
  {
    id: 1,
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

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("");
  
  // Filter jobs based on search term and job type
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = jobType === "" || job.type === jobType;
    
    return matchesSearch && matchesType;
  });

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-4 md:mb-0">Job Listings</h1>
          <Link to="/calendar">
            <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
              <Calendar className="mr-2 h-4 w-4" />
              View Application Deadlines
            </Button>
          </Link>
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
                <SelectItem value="">All Types</SelectItem>
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
                    <span className="bg-unisphere-lightBlue/20 text-unisphere-darkBlue px-3 py-1 rounded-full text-sm font-medium">
                      {job.type}
                    </span>
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
                  <Link to={`/jobs/${job.id}`}>
                    <Button>View Details</Button>
                  </Link>
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
      </div>
    </MainLayout>
  );
};

export default Jobs;
