
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
import { toast } from "sonner";
import JobFormDialog from "@/components/admin/JobFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialJobListings = [
  { id: 1, title: "Software Engineer Intern", company: "TechCorp Malaysia", status: "Active", applications: 23, postedDate: "2025-06-01", deadline: "2025-06-30" },
  { id: 2, title: "Data Analyst", company: "Analytics Pro", status: "Active", applications: 18, postedDate: "2025-06-05", deadline: "2025-06-15" },
  { id: 3, title: "Marketing Assistant", company: "Brand Masters", status: "Pending", applications: 8, postedDate: "2025-06-10", deadline: "2025-06-20" },
  { id: 4, title: "UX/UI Design Intern", company: "Creative Solutions", status: "Active", applications: 15, postedDate: "2025-06-12", deadline: "2025-07-01" },
  { id: 5, title: "Finance Analyst", company: "Global Finance", status: "Expired", applications: 12, postedDate: "2025-05-14", deadline: "2025-05-25" }
];

const AdminJobManagement = () => {
  const [jobListings, setJobListings] = useState(initialJobListings.map(j => ({...j, postedDate: new Date(j.postedDate), deadline: new Date(j.deadline)})));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleAddNewJob = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
    setIsDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
      if (!jobToDelete) return;
      setJobListings(jobListings.filter(j => j.id !== jobToDelete.id));
      toast.success(`Job "${jobToDelete.title}" has been deleted.`);
      setIsDeleteConfirmOpen(false);
      setJobToDelete(null);
  }

  const handleSaveJob = (data) => {
    if (selectedJob) {
      // Update
      setJobListings(jobListings.map(j => j.id === selectedJob.id ? { ...j, ...data } : j));
      toast.success(`Job "${data.title}" has been updated.`);
    } else {
      // Create
      const newJob = {
        ...data,
        id: jobListings.length > 0 ? Math.max(...jobListings.map(j => j.id)) + 1 : 1,
        applications: 0,
        postedDate: new Date(),
      };
      setJobListings([...jobListings, newJob]);
      toast.success(`Job "${data.title}" has been created.`);
    }
    setIsFormOpen(false);
    setSelectedJob(null);
  };

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
              <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white" onClick={handleAddNewJob}>
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
                    <TableCell>{job.postedDate.toLocaleDateString()}</TableCell>
                    <TableCell>{job.deadline.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteJob(job)}>
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

      <JobFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        job={selectedJob}
        onSave={handleSaveJob}
      />
      
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the job listing for "{jobToDelete?.title}".
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AdminJobManagement;

