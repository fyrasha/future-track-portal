
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
  Star,
  FileText,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/MainLayout";
import { Link } from "react-router-dom";

const Applications = () => {
  // Simulate no user logged in
  const isLoggedIn = false;
  const applications: any[] = [];

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
