import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Users, Building, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import JobApplicationDialog from "@/components/JobApplicationDialog";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedDate: any;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface Company {
  name: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
}

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  
  const [isLoggedIn] = useState(() => {
    return localStorage.getItem('userLoggedIn') === 'true';
  });

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

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['company-jobs', id],
    queryFn: async () => {
      if (!id) return [];
      const jobsCollection = collection(db, "jobs");
      const q = query(
        jobsCollection, 
        where("companyId", "==", id),
        orderBy("postedDate", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const jobsList: Job[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Job));
      
      return jobsList;
    },
    enabled: !!id
  });

  const company: Company = {
    name: id || "Company",
    description: "Leading professional services firm providing audit, tax, and advisory services.",
    industry: "Professional Services",
    size: "10,000+ employees",
    location: "Global"
  };

  if (jobsLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Company Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                <p className="text-gray-600 mb-4">{company.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {company.industry}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {company.size}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <Card>
            <CardHeader>
              <CardTitle>Open Positions ({jobs?.length || 0})</CardTitle>
              <CardDescription>Current job openings at {company.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {job.postedDate?.toDate?.()?.toLocaleDateString() || 'Recently posted'}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex gap-2">
                        <Link to="/jobs">
                          <Button variant="outline" size="sm">
                            <Briefcase className="mr-1 h-3 w-3" />
                            All Jobs
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          onClick={() => applyForJob(job)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No open positions</h3>
                  <p className="text-gray-500">This company currently has no job openings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Application Dialog */}
        {selectedJob && (
          <JobApplicationDialog 
            job={{
              id: selectedJob.id,
              title: selectedJob.title,
              company: selectedJob.company,
              location: selectedJob.location,
            }}
            open={applicationDialogOpen}
            onOpenChange={setApplicationDialogOpen}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CompanyDetails;
