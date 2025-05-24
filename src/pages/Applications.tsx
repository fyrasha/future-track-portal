
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle2, 
  Clock,
  Building,
  MapPin,
  Briefcase,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

// Mock application data with Malaysia locations
const applicationData = [
  {
    id: 1,
    jobTitle: "Software Engineer Intern",
    company: "TechCorp Malaysia",
    location: "Kuala Lumpur, Malaysia",
    appliedDate: "2025-05-15",
    status: "Applied",
    nextStep: "Waiting for review",
    interviewDate: null
  },
  {
    id: 2,
    jobTitle: "Data Analyst",
    company: "Analytics Pro",
    location: "Petaling Jaya, Malaysia",
    appliedDate: "2025-05-10",
    status: "Under Review",
    nextStep: "Technical assessment",
    interviewDate: null
  },
  {
    id: 3,
    jobTitle: "Marketing Assistant",
    company: "Brand Masters",
    location: "Penang, Malaysia",
    appliedDate: "2025-05-01",
    status: "Interview Scheduled",
    nextStep: "Interview preparation",
    interviewDate: "2025-05-25"
  },
  {
    id: 4,
    jobTitle: "UX/UI Design Intern",
    company: "Creative Solutions",
    location: "Johor Bahru, Malaysia",
    appliedDate: "2025-05-07",
    status: "Rejected",
    nextStep: null,
    interviewDate: null
  },
  {
    id: 5,
    jobTitle: "Finance Analyst",
    company: "Global Finance",
    location: "Cyberjaya, Malaysia",
    appliedDate: "2025-05-14",
    status: "Offer Received",
    nextStep: "Review offer details",
    interviewDate: "2025-05-18"
  }
];

const Applications = () => {
  const [applications] = useState(applicationData);

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

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your job applications and their current status</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableCaption>List of your job applications</TableCaption>
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
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.jobTitle}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1 text-gray-500" />
                      {application.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {application.location}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>{application.nextStep || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Applications;
