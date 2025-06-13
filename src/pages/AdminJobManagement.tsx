
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { 
  Card, 
  CardContent, 
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
  Edit, 
  Trash2,
  Plus
} from "lucide-react";

const jobListings = [
  { id: 1, title: "Software Engineer Intern", company: "TechCorp Malaysia", status: "Active", applications: 23, postedDate: "2025-06-01", deadline: "2025-06-30" },
  { id: 2, title: "Data Analyst", company: "Analytics Pro", status: "Active", applications: 18, postedDate: "2025-06-05", deadline: "2025-06-15" },
  { id: 3, title: "Marketing Assistant", company: "Brand Masters", status: "Pending", applications: 8, postedDate: "2025-06-10", deadline: "2025-06-20" },
  { id: 4, title: "UX/UI Design Intern", company: "Creative Solutions", status: "Active", applications: 15, postedDate: "2025-06-12", deadline: "2025-07-01" },
  { id: 5, title: "Finance Analyst", company: "Global Finance", status: "Expired", applications: 12, postedDate: "2025-05-14", deadline: "2025-05-25" }
];

const AdminJobManagement = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Job Management</h1>
          <p className="text-gray-600">Manage and oversee all job listings</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Job Listings</CardTitle>
              <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add New Job
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobListings.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>
                      <Badge className={
                        job.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.applications}</TableCell>
                    <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(job.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminJobManagement;
