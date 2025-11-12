import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/MainLayout";
import EmployerDetailsDialog from "@/components/EmployerDetailsDialog";
import { useState } from "react";
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
                              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleUpdateStatus(employer.id, 'Verified')}>
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleUpdateStatus(employer.id, 'Rejected')}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(employer)}>
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

        <EmployerDetailsDialog
          employer={selectedEmployer}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onUpdateStatus={handleUpdateStatus}
          onDeleteEmployer={handleDeleteEmployer}
        />
      </div>
    </MainLayout>
  );
};

export default AdminEmployerReview;
