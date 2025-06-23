import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Users, Calendar, Briefcase, ExternalLink, Building2 } from 'lucide-react';
import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Job } from '@/types/job';
import MainLayout from '@/components/MainLayout';

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  employeeCount: number;
  foundedDate: string;
  website: string;
  logoUrl: string;
}

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useQuery(['company', id], async () => {
    if (!id) {
      return null;
    }

    const companyDocRef = doc(db, 'companies', id);
    const companyDocSnap = await getDoc(companyDocRef);

    if (companyDocSnap.exists()) {
      const companyData = companyDocSnap.data() as Company;
      setCompany({ id: companyDocSnap.id, ...companyData });
    } else {
      console.log('No such company!');
      setCompany(null);
    }

    const jobsQuery = query(collection(db, 'jobs'), where('companyId', '==', id), orderBy('createdAt', 'desc'));
    const jobsSnapshot = await getDocs(jobsQuery);
    const jobsList: Job[] = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    setJobs(jobsList);

    return companyDocSnap.exists() ? companyDocSnap.data() : null;
  });

  if (!company) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
            <p>The company you are looking for does not exist.</p>
            <Link to="/jobs" className="text-blue-500 hover:underline">
              Back to Jobs
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <img src={company.logoUrl} alt={`${company.name} Logo`} className="h-20 w-20 rounded-full object-cover" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">{company.name}</CardTitle>
            <CardDescription className="text-center">{company.industry}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <p className="text-lg font-semibold">About</p>
              <p className="text-muted-foreground">{company.description}</p>
            </div>
            <Separator />
            <div className="grid gap-2">
              <p className="text-lg font-semibold">Company Details</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{company.employeeCount} employees</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Founded on {new Date(company.foundedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <Link to={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Visit Website
                </Link>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <p className="text-lg font-semibold">Open Positions</p>
              {jobs.length > 0 ? (
                <div className="grid gap-4">
                  {jobs.map(job => (
                    <Card key={job.id} className="border">
                      <CardHeader>
                        <CardTitle>
                          <Link to={`/jobs/${job.id}`} className="hover:underline">
                            {job.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{company.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{job.type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No open positions at this time.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CompanyDetails;
