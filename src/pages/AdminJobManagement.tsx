
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  query,
  orderBy
} from "firebase/firestore";
import { Job, JobFormValues } from "@/types/job";

const AdminJobManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const queryClient = useQueryClient();

  const { data: jobListings, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async (): Promise<Job[]> => {
      const jobsCollection = collection(db, "jobs");
      const q = query(jobsCollection, orderBy("postedDate", "desc"));
      const jobSnapshot = await getDocs(q);
      return jobSnapshot.docs.map(doc => ({ ...(doc.data() as Omit<Job, 'id'>), id: doc.id }));
    },
  });

  const addJobMutation = useMutation({
    mutationFn: async (newJob: JobFormValues) => {
      return await addDoc(collection(db, "jobs"), {
        ...newJob,
        postedDate: Timestamp.now(),
        deadline: Timestamp.fromDate(newJob.deadline),
        applications: 0,
      });
    },
    onMutate: async (newJob: JobFormValues) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      const previousJobs = queryClient.getQueryData<Job[]>(["jobs"]);
      queryClient.setQueryData<Job[]>(["jobs"], (old) => {
        const optimisticJob: Job = {
          id: `temp-${Date.now()}`,
          ...newJob,
          postedDate: Timestamp.now(),
          deadline: Timestamp.fromDate(newJob.deadline),
          applications: 0,
        };
        return old ? [optimisticJob, ...old] : [optimisticJob];
      });
      return { previousJobs };
    },
    onError: (error: Error, variables, context) => {
      toast.error(`Failed to create job: ${error.message}`);
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      if (!error) {
        toast.success(`Job "${variables.title}" has been created.`);
        setIsFormOpen(false);
      }
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, ...jobData }: { id: string } & JobFormValues) => {
      if (!id) throw new Error("Job ID is missing");
      const jobRef = doc(db, "jobs", id);
      await updateDoc(jobRef, {
        ...jobData,
        deadline: Timestamp.fromDate(jobData.deadline),
      });
      return { id, ...jobData };
    },
    onMutate: async (updatedJob) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      const previousJobs = queryClient.getQueryData<Job[]>(["jobs"]);
      queryClient.setQueryData<Job[]>(["jobs"], (old) =>
        old?.map(job => {
          if (job.id === updatedJob.id) {
            const originalJob = old.find(j => j.id === updatedJob.id);
            return {
              ...originalJob,
              ...updatedJob,
              deadline: Timestamp.fromDate(updatedJob.deadline),
            } as Job;
          }
          return job;
        }) ?? []
      );
      return { previousJobs };
    },
    onError: (error: Error, variables, context) => {
      toast.error(`Failed to update job: ${error.message}`);
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      if (!error) {
        toast.success(`Job "${variables.title}" has been updated.`);
        setIsFormOpen(false);
        setSelectedJob(null);
      }
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (job: Job) => {
      await deleteDoc(doc(db, "jobs", job.id));
      return job;
    },
    onMutate: async (jobToDelete) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      const previousJobs = queryClient.getQueryData<Job[]>(["jobs"]);
      queryClient.setQueryData<Job[]>(["jobs"], (old) =>
        old?.filter(job => job.id !== jobToDelete.id) ?? []
      );
      return { previousJobs };
    },
    onError: (error: Error, variables, context) => {
      toast.error(`Failed to delete job: ${error.message}`);
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      if (!error) {
        toast.success(`Job "${variables.title}" has been deleted.`);
      }
      setIsDeleteConfirmOpen(false);
      setJobToDelete(null);
    },
  });

  const handleAddNewJob = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
      if (!jobToDelete) return;
      deleteJobMutation.mutate(jobToDelete);
  }

  const handleSaveJob = (data: JobFormValues) => {
    if (selectedJob) {
      updateJobMutation.mutate({ ...data, id: selectedJob.id });
    } else {
      addJobMutation.mutate(data);
    }
  };
  
  const isSaving = addJobMutation.isPending || updateJobMutation.isPending;

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
            {isLoading && <div className="text-center p-8">Loading jobs...</div>}
            {error && <div className="text-center p-8 text-destructive">Error: {error.message}</div>}
            {!isLoading && !error && (
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
                  {jobListings && jobListings.length > 0 ? (
                    jobListings.map((job) => (
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
                        <TableCell>{job.postedDate.toDate().toLocaleDateString()}</TableCell>
                        <TableCell>{job.deadline.toDate().toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteJob(job)} disabled={deleteJobMutation.isPending && jobToDelete?.id === job.id}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        No job listings found. Start by adding a new one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <JobFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        job={selectedJob}
        onSave={handleSaveJob}
        isSaving={isSaving}
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
                  <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteJobMutation.isPending}>
                      {deleteJobMutation.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AdminJobManagement;
