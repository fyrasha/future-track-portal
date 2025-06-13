
import { useState } from "react";
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
  XCircle
} from "lucide-react";

const employers = [
  { id: 1, company: "TechCorp Malaysia", contact: "hr@techcorp.my", status: "Verified", joinDate: "2025-01-15", jobsPosted: 8 },
  { id: 2, company: "Analytics Pro", contact: "careers@analyticspro.my", status: "Pending", joinDate: "2025-02-10", jobsPosted: 0 },
  { id: 3, company: "Brand Masters", contact: "jobs@brandmasters.my", status: "Verified", joinDate: "2025-01-20", jobsPosted: 5 },
  { id: 4, company: "Creative Solutions", contact: "hr@creativesolutions.my", status: "Pending", joinDate: "2025-06-12", jobsPosted: 0 },
  { id: 5, company: "Global Finance", contact: "careers@globalfinance.my", status: "Rejected", joinDate: "2025-02-05", jobsPosted: 0 }
];

const AdminEmployerReview = () => {
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
                {employers.map((employer) => (
                  <TableRow key={employer.id}>
                    <TableCell className="font-medium">{employer.company}</TableCell>
                    <TableCell>{employer.contact}</TableCell>
                    <TableCell>
                      <Badge className={
                        employer.status === 'Verified' ? 'bg-green-100 text-green-800' : 
                        employer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {employer.status === 'Verified' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : employer.status === 'Pending' ? (
                          <XCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {employer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(employer.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{employer.jobsPosted}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {employer.status === 'Pending' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminEmployerReview;
