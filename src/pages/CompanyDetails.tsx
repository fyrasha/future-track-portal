import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  Briefcase,
  Star,
  ArrowLeft,
  Calendar
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types/job";

interface Company {
  id: string;
  companyName: string;
  email: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  createdAt: Timestamp;
  description?: string;
  industry?: string;
  size?: string;
  founded?: string;
  website?: string;
  phone?: string;
  location?: string;
  rating?: number;
  benefits?: string[];
  culture?: string;
}

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: company, isLoading: isLoadingCompany, error: companyError } = useQuery<Company | null>({
    queryKey: ['company', id],
    queryFn: async () => {
      if (!id) return null;
      // First try to get from employers collection
      const employerDocRef = doc(db, 'employers', id);
      const employerDocSnap = await getDoc(employerDocRef);
      if (employerDocSnap.exists()) {
        return { id: employerDocSnap.id, ...employerDocSnap.data() } as Company;
      }
      
      // Fallback: try users collection for backwards compatibility
      const userDocRef = doc(db, 'users', id);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists() && userDocSnap.data().role === 'employer') {
        return { id: userDocSnap.id, ...userDocSnap.data() } as Company;
      }
      
      return null;
    },
    enabled: !!id,
  });

  const { data: openPositions, isLoading: isLoadingJobs } = useQuery<Job[]>({
    queryKey: ['company-jobs', id],
    queryFn: async () => {
      if (!id) return [];
      const jobsCollection = collection(db, "jobs");
      // Only show Active jobs for the company
      const q = query(jobsCollection, where("companyId", "==", id), where("status", "==", "Active"));
      const jobSnapshot = await getDocs(q);
      return jobSnapshot.docs.map(doc => ({ ...(doc.data() as Omit<Job, 'id'>), id: doc.id }));
    },
    enabled: !!id,
  });

  if (isLoadingCompany || isLoadingJobs) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-10 w-40 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                           <Skeleton className="h-5 w-40" />
                           <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-9 w-24 rounded-md" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (companyError || !company) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>Company Not Found</CardTitle>
              <CardDescription>The requested company could not be found.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/jobs">
                <Button className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                  Back to Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/jobs">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-unisphere-blue/10 rounded-lg flex items-center justify-center">
                    <Building className="h-8 w-8 text-unisphere-blue" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-unisphere-darkBlue">{company.companyName}</CardTitle>
                    <div className="flex items-center mt-2 space-x-4">
                      {company.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-gray-600">{company.location}</span>
                        </div>
                      )}
                      {company.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span className="text-gray-600">{company.rating}/5.0</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {company.description && <p className="text-gray-700 mb-4">{company.description}</p>}
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {company.industry && <div>
                    <h4 className="font-medium text-gray-900 mb-1">Industry</h4>
                    <p className="text-gray-600">{company.industry}</p>
                  </div>}
                  {company.size && <div>
                    <h4 className="font-medium text-gray-900 mb-1">Company Size</h4>
                    <p className="text-gray-600">{company.size}</p>
                  </div>}
                  {company.founded && <div>
                    <h4 className="font-medium text-gray-900 mb-1">Founded</h4>
                    <p className="text-gray-600">{company.founded}</p>
                  </div>}
                  {company.website && <div>
                    <h4 className="font-medium text-gray-900 mb-1">Website</h4>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-unisphere-blue hover:underline">
                      Visit Website
                    </a>
                  </div>}
                </div>

                {company.culture && <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Company Culture</h4>
                  <p className="text-gray-700">{company.culture}</p>
                </div>}

                {company.benefits && company.benefits.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Benefits & Perks</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.benefits.map((benefit: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Open Positions */}
            <Card>
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
                <CardDescription>Current job openings at {company.companyName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {openPositions && openPositions.length > 0 ? (
                    openPositions.map((position) => (
                      <div key={position.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">{position.title}</h5>
                            <div className="flex items-center mt-1 space-x-4">
                              <Badge variant="outline">{position.type}</Badge>
                              <span className="text-sm text-gray-500">Posted: {position.postedDate.toDate().toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Link to={`/jobs`}>
                            <Button size="sm" className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                              View Job
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No open positions at this company right now.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-500" />
                  <a href={`mailto:${company.email}`} className="text-unisphere-blue hover:underline">
                    {company.email}
                  </a>
                </div>
                {company.phone && <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-500" />
                  <span className="text-gray-700">{company.phone}</span>
                </div>}
                {company.website && <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-3 text-gray-500" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-unisphere-blue hover:underline">
                    Company Website
                  </a>
                </div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Open Positions</span>
                  <span className="font-medium">{openPositions?.length || 0}</span>
                </div>
                {company.rating && <div className="flex justify-between">
                  <span className="text-gray-600">Company Rating</span>
                  <span className="font-medium">{company.rating}/5.0</span>
                </div>}
                {company.founded && <div className="flex justify-between">
                  <span className="text-gray-600">Years in Business</span>
                  <span className="font-medium">{new Date().getFullYear() - parseInt(company.founded)} years</span>
                </div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyDetails;
