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
  Loader2,
  Mail,
  Zap,
  Clock,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
  ResponsiveContainer,
  Legend
} from "recharts";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const chartConfig = {
  highlyActive: {
    label: "Highly Active",
    color: "hsl(142, 76%, 36%)",
  },
  active: {
    label: "Active",
    color: "hsl(217, 91%, 60%)",
  },
  lowActivity: {
    label: "Low Activity",
    color: "hsl(38, 92%, 50%)",
  },
  inactive: {
    label: "Inactive", 
    color: "hsl(0, 84%, 60%)",
  },
  applications: {
    label: "Applications",
    color: "hsl(217, 91%, 60%)",
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
  userId?: string;
  studentId?: string;
  appliedAt?: any;
  company?: string;
}

interface EventRegistration {
  id: string;
  userId?: string;
  studentId?: string;
  registeredAt?: any;
}

// Activity levels based on recency
type ActivityLevel = 'highlyActive' | 'active' | 'lowActivity' | 'inactive';

interface StudentActivity {
  student: Student;
  level: ActivityLevel;
  lastActivityDate: Date | null;
  activityCount: number;
}

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000;
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const { toast } = useToast();

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

  // Calculate enhanced activity levels for each student
  const calculateStudentActivities = (): StudentActivity[] => {
    const now = new Date();
    
    return students.map(student => {
      // Get all activities for this student
      const studentApps = applications.filter(app => 
        app.userId === student.id || app.studentId === student.id
      );
      const studentRegs = eventRegistrations.filter(reg => 
        reg.userId === student.id || reg.studentId === student.id
      );
      
      // Find the most recent activity
      const allActivityDates: Date[] = [];
      
      studentApps.forEach(app => {
        if (app.appliedAt) {
          const date = app.appliedAt.toDate ? app.appliedAt.toDate() : new Date(app.appliedAt);
          allActivityDates.push(date);
        }
      });
      
      studentRegs.forEach(reg => {
        if (reg.registeredAt) {
          const date = reg.registeredAt.toDate ? reg.registeredAt.toDate() : new Date(reg.registeredAt);
          allActivityDates.push(date);
        }
      });
      
      const lastActivityDate = allActivityDates.length > 0 
        ? new Date(Math.max(...allActivityDates.map(d => d.getTime())))
        : null;
      
      const activityCount = studentApps.length + studentRegs.length;
      
      // Determine activity level based on recency and count
      let level: ActivityLevel;
      
      if (lastActivityDate === null) {
        level = 'inactive';
      } else {
        const daysSinceActivity = now.getTime() - lastActivityDate.getTime();
        
        if (daysSinceActivity <= THIRTY_DAYS && activityCount >= 3) {
          level = 'highlyActive';
        } else if (daysSinceActivity <= THIRTY_DAYS) {
          level = 'active';
        } else if (daysSinceActivity <= SIXTY_DAYS) {
          level = 'lowActivity';
        } else {
          level = 'inactive';
        }
      }
      
      return {
        student,
        level,
        lastActivityDate,
        activityCount
      };
    });
  };

  const studentActivities = calculateStudentActivities();
  
  // Count by activity level
  const highlyActiveCount = studentActivities.filter(sa => sa.level === 'highlyActive').length;
  const activeCount = studentActivities.filter(sa => sa.level === 'active').length;
  const lowActivityCount = studentActivities.filter(sa => sa.level === 'lowActivity').length;
  const inactiveCount = studentActivities.filter(sa => sa.level === 'inactive').length;

  const totalStudents = students.length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === "Active").length;
  const pendingJobs = jobs.filter(job => job.status === "Pending").length;
  
  // Unique companies from jobs
  const uniqueCompanies = new Set(jobs.map(job => job.company));
  const totalCompanies = uniqueCompanies.size;

  // Student activity data for pie chart with 4 levels
  const studentActivityData = [
    { name: "Highly Active", value: highlyActiveCount, color: "hsl(142, 76%, 36%)" },
    { name: "Active", value: activeCount, color: "hsl(217, 91%, 60%)" },
    { name: "Low Activity", value: lowActivityCount, color: "hsl(38, 92%, 50%)" },
    { name: "Inactive", value: inactiveCount, color: "hsl(0, 84%, 60%)" }
  ].filter(d => d.value > 0);

  // Job status data for pie chart
  const jobStatusData = [
    { name: "Active", value: activeJobs, color: "hsl(142, 76%, 36%)" },
    { name: "Pending", value: pendingJobs, color: "hsl(38, 92%, 50%)" }
  ].filter(d => d.value > 0);

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

  // Students needing attention (inactive or low activity)
  const studentsNeedingAttention = studentActivities
    .filter(sa => sa.level === 'inactive' || sa.level === 'lowActivity')
    .sort((a, b) => {
      // Inactive first, then by activity count
      if (a.level === 'inactive' && b.level !== 'inactive') return -1;
      if (a.level !== 'inactive' && b.level === 'inactive') return 1;
      return a.activityCount - b.activityCount;
    })
    .slice(0, 8);

  // Recent jobs
  const recentJobs = [...jobs]
    .sort((a, b) => {
      const dateA = a.postedDate?.toDate?.() || new Date(0);
      const dateB = b.postedDate?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  const handleContactStudent = (student: Student) => {
    // Open email client
    window.location.href = `mailto:${student.email}?subject=UniSphere - We'd love to see you more active!&body=Hi ${student.name || 'there'},%0D%0A%0D%0AWe noticed you haven't been active on UniSphere recently. We have some exciting job opportunities and events that might interest you!%0D%0A%0D%0ABest regards,%0D%0AUniSphere Team`;
    
    toast({
      title: "Opening Email Client",
      description: `Composing email to ${student.email}`,
    });
  };

  const getActivityBadge = (level: ActivityLevel) => {
    switch (level) {
      case 'highlyActive':
        return <Badge className="bg-green-100 text-green-800"><Zap className="h-3 w-3 mr-1" />Highly Active</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800"><TrendingUp className="h-3 w-3 mr-1" />Active</Badge>;
      case 'lowActivity':
        return <Badge className="bg-amber-100 text-amber-800"><Clock className="h-3 w-3 mr-1" />Low Activity</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
    }
  };

  const formatLastActivity = (date: Date | null) => {
    if (!date) return "Never";
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

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
            {/* Student Analytics Overview - 4 Level System */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    Highly Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{highlyActiveCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">3+ activities in 30 days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{activeCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">Activity within 30 days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Low Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{lowActivityCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">30-60 days since activity</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Inactive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{inactiveCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">No activity in 60+ days</p>
                </CardContent>
              </Card>
            </div>

            {/* Total Students Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Registered Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="text-3xl font-bold">{totalStudents}</div>
                </div>
              </CardContent>
            </Card>

            {/* Student Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement Distribution</CardTitle>
                <CardDescription>Activity levels based on job applications and event registrations in the last 60 days</CardDescription>
              </CardHeader>
              <CardContent>
                {studentActivityData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={studentActivityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, value, percent }) => 
                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                          }
                        >
                          {studentActivityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No student data available</p>
                )}
              </CardContent>
            </Card>

            {/* Students Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle>Students Needing Attention</CardTitle>
                <CardDescription>Students with low or no activity - consider reaching out</CardDescription>
              </CardHeader>
              <CardContent>
                {studentsNeedingAttention.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsNeedingAttention.map((sa) => (
                        <TableRow key={sa.student.id}>
                          <TableCell className="font-medium">
                            {sa.student.name || "No name"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {sa.student.email}
                          </TableCell>
                          <TableCell>
                            {getActivityBadge(sa.level)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatLastActivity(sa.lastActivityDate)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleContactStudent(sa.student)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">All students are engaged!</p>
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
                  {jobStatusData.length > 0 ? (
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
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {jobStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No jobs yet</p>
                  )}
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
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span>{company.company}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary">{company.applications}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No companies yet</p>
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
                          <TableHead>Job</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentJobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{job.title}</p>
                                <p className="text-sm text-muted-foreground">{job.company}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={job.status === 'Active' ? 'default' : 'secondary'}
                                className={job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
                              >
                                {job.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No jobs yet</p>
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
