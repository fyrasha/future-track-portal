import { useState, useEffect } from "react";
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
  Users, 
  Building, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";

const chartConfig = {
  active: {
    label: "Active Students",
    color: "hsl(142, 76%, 36%)",
  },
  inactive: {
    label: "Inactive Students", 
    color: "hsl(0, 84%, 60%)",
  },
  applications: {
    label: "Applications",
    color: "hsl(217, 91%, 60%)",
  },
  jobs: {
    label: "Job Postings",
    color: "hsl(262, 83%, 58%)",
  },
  pending: {
    label: "Pending Jobs",
    color: "hsl(38, 92%, 50%)",
  }
};

interface Student {
  id: string;
  name?: string;
  email: string;
  lastActivity?: string;
  lastActivityDate?: any;
  createdAt?: any;
}

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  postedDate?: any;
}

interface Application {
  id: string;
  jobId: string;
  userId: string;
  appliedAt?: any;
  company?: string;
}

interface EventRegistration {
  id: string;
  userId: string;
  registeredAt?: any;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);

  // Real-time listeners
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Listen to users (students)
    const usersRef = collection(db, "users");
    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(usersData);
      setLoading(false);
    });
    unsubscribers.push(unsubUsers);

    // Listen to jobs
    const jobsRef = collection(db, "jobs");
    const unsubJobs = onSnapshot(jobsRef, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      setJobs(jobsData);
    });
    unsubscribers.push(unsubJobs);

    // Listen to applications
    const appsRef = collection(db, "applications");
    const unsubApps = onSnapshot(appsRef, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      setApplications(appsData);
    });
    unsubscribers.push(unsubApps);

    // Listen to event registrations
    const regsRef = collection(db, "eventRegistrations");
    const unsubRegs = onSnapshot(regsRef, (snapshot) => {
      const regsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EventRegistration[];
      setEventRegistrations(regsData);
    });
    unsubscribers.push(unsubRegs);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // Calculate analytics
  const totalStudents = students.length;
  
  // Active students = students who have applied or registered for events
  const activeStudentIds = new Set([
    ...applications.map(app => app.userId),
    ...eventRegistrations.map(reg => reg.userId)
  ]);
  const activeStudents = activeStudentIds.size;
  const inactiveStudents = Math.max(0, totalStudents - activeStudents);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === "Active").length;
  const pendingJobs = jobs.filter(job => job.status === "Pending").length;
  
  // Unique companies from jobs
  const uniqueCompanies = new Set(jobs.map(job => job.company));
  const totalCompanies = uniqueCompanies.size;

  // Student status data for pie chart
  const studentStatusData = [
    { name: "Active", value: activeStudents, color: "hsl(142, 76%, 36%)" },
    { name: "Inactive", value: inactiveStudents, color: "hsl(0, 84%, 60%)" }
  ];

  // Job status data for pie chart
  const jobStatusData = [
    { name: "Active", value: activeJobs, color: "hsl(142, 76%, 36%)" },
    { name: "Pending", value: pendingJobs, color: "hsl(38, 92%, 50%)" }
  ];

  // Applications by company
  const appsByCompany = jobs.reduce((acc, job) => {
    const jobApps = applications.filter(app => app.jobId === job.id).length;
    if (jobApps > 0) {
      const existing = acc.find(item => item.company === job.company);
      if (existing) {
        existing.applications += jobApps;
      } else {
        acc.push({ company: job.company, applications: jobApps });
      }
    }
    return acc;
  }, [] as { company: string; applications: number }[]);
  
  const topCompaniesData = appsByCompany
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5);

  // Inactive students list (students with no applications or registrations)
  const inactiveStudentsList = students
    .filter(student => !activeStudentIds.has(student.id))
    .slice(0, 5);

  // Recent jobs
  const recentJobs = [...jobs]
    .sort((a, b) => {
      const dateA = a.postedDate?.toDate?.() || new Date(0);
      const dateB = b.postedDate?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics and insights</p>
        </div>

        <Tabs defaultValue="student-activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student-activity">Student Activity</TabsTrigger>
            <TabsTrigger value="jobs-companies">Jobs & Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="student-activity" className="space-y-6">
            {/* Student Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="text-3xl font-bold">{totalStudents}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div className="text-3xl font-bold text-green-600">{activeStudents}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Applied or registered for events</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-red-500" />
                    <div className="text-3xl font-bold text-red-600">{inactiveStudents}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">No recent activity</p>
                </CardContent>
              </Card>
            </div>

            {/* Student Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Student Status Distribution</CardTitle>
                <CardDescription>Current active vs inactive breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value, percent }) => 
                          value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : null
                        }
                      >
                        {studentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Inactive Students Details */}
            <Card>
              <CardHeader>
                <CardTitle>Students with No Activity</CardTitle>
                <CardDescription>Students who haven't applied to jobs or registered for events</CardDescription>
              </CardHeader>
              <CardContent>
                {inactiveStudentsList.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inactiveStudentsList.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.name || "No name"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {student.email}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Contact
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">All students are active!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs-companies" className="space-y-6">
            {/* Jobs & Companies Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div className="text-3xl font-bold">{totalJobs}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <div className="text-3xl font-bold">{totalCompanies}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div className="text-3xl font-bold">{applications.length}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Status Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Status Distribution</CardTitle>
                  <CardDescription>Active vs pending job postings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={jobStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => value > 0 ? `${name}: ${value}` : null}
                        >
                          {jobStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Applications by Company */}
              <Card>
                <CardHeader>
                  <CardTitle>Applications by Company</CardTitle>
                  <CardDescription>Top companies by application volume</CardDescription>
                </CardHeader>
                <CardContent>
                  {topCompaniesData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCompaniesData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis 
                            dataKey="company" 
                            type="category" 
                            width={100} 
                            tick={{ fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar 
                            dataKey="applications" 
                            fill="hsl(217, 91%, 60%)" 
                            name="Applications"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No applications yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Companies</CardTitle>
                  <CardDescription>Companies with most applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {topCompaniesData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Company</TableHead>
                          <TableHead className="text-right">Applications</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topCompaniesData.map((company, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{company.company}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary">{company.applications}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No applications yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Listings</CardTitle>
                  <CardDescription>Latest job postings</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentJobs.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentJobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{job.title}</div>
                                <div className="text-sm text-muted-foreground">{job.company}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={job.status === "Active" ? "default" : "secondary"}
                                className={job.status === "Active" ? "bg-green-500" : "bg-yellow-500"}
                              >
                                {job.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No jobs posted yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
