
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
  Users, 
  Building, 
  Briefcase, 
  TrendingUp, 
  CheckCircle,
  XCircle,
  Calendar
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

// Mock data
const analyticsData = {
  totalStudents: 1250,
  activeStudents: 892,
  inactiveStudents: 358,
  totalJobs: 45,
  totalCompanies: 23
};

const studentActivityData = [
  { month: "Jan", active: 820, inactive: 430 },
  { month: "Feb", active: 845, inactive: 405 },
  { month: "Mar", active: 867, inactive: 383 },
  { month: "Apr", active: 878, inactive: 372 },
  { month: "May", active: 885, inactive: 365 },
  { month: "Jun", active: 892, inactive: 358 }
];

const jobApplicationsData = [
  { company: "TechCorp", applications: 145 },
  { company: "Analytics Pro", applications: 89 },
  { company: "Creative Solutions", applications: 67 },
  { company: "Brand Masters", applications: 54 },
  { company: "Global Finance", applications: 43 }
];

const studentStatusData = [
  { name: "Active", value: 892, color: "#10b981" },
  { name: "Inactive", value: 358, color: "#ef4444" }
];

const monthlyJobPostings = [
  { month: "Jan", jobs: 35 },
  { month: "Feb", jobs: 42 },
  { month: "Mar", jobs: 38 },
  { month: "Apr", jobs: 45 },
  { month: "May", jobs: 41 },
  { month: "Jun", jobs: 45 }
];

const chartConfig = {
  active: {
    label: "Active Students",
    color: "#10b981",
  },
  inactive: {
    label: "Inactive Students", 
    color: "#ef4444",
  },
  applications: {
    label: "Applications",
    color: "#3b82f6",
  },
  jobs: {
    label: "Job Postings",
    color: "#8b5cf6",
  }
};

const inactiveStudents = [
  { id: 1, name: "Ahmad Rahman", email: "ahmad@student.edu", lastActivity: "Career Fair 2024", lastActivityDate: "2024-11-15", status: "Inactive" },
  { id: 2, name: "Siti Nurhaliza", email: "siti@student.edu", lastActivity: "Resume Workshop", lastActivityDate: "2024-10-20", status: "Inactive" },
  { id: 3, name: "Raj Kumar", email: "raj@student.edu", lastActivity: "Tech Symposium", lastActivityDate: "2024-09-25", status: "Inactive" }
];

const topCompanies = [
  { id: 1, name: "TechCorp Malaysia", applications: 145, hires: 23 },
  { id: 2, name: "Analytics Pro", applications: 89, hires: 15 },
  { id: 3, name: "Creative Solutions", applications: 67, hires: 12 }
];

const jobListings = [
  { id: 1, title: "Software Engineer Intern", company: "TechCorp Malaysia", status: "Active", applications: 23, postedDate: "2025-06-01" },
  { id: 2, title: "Data Analyst", company: "Analytics Pro", status: "Active", applications: 18, postedDate: "2025-06-05" },
  { id: 3, title: "Marketing Assistant", company: "Brand Masters", status: "Pending", applications: 8, postedDate: "2025-06-10" }
];

const AdminDashboard = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Analytics and insights for student activity and job management</p>
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
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-unisphere-blue" />
                    <div className="text-2xl font-bold">{analyticsData.totalStudents}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">{analyticsData.activeStudents}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Inactive Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-red-600" />
                    <div className="text-2xl font-bold text-red-600">{analyticsData.inactiveStudents}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Activity Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Activity Trend</CardTitle>
                  <CardDescription>Monthly active vs inactive students</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={studentActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="active" fill="var(--color-active)" name="Active Students" />
                        <Bar dataKey="inactive" fill="var(--color-inactive)" name="Inactive Students" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Status Distribution</CardTitle>
                  <CardDescription>Current active vs inactive breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
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
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
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
            </div>

            {/* Inactive Students Details */}
            <Card>
              <CardHeader>
                <CardTitle>Students with Low Activity</CardTitle>
                <CardDescription>Students who haven't participated in recent activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inactiveStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.lastActivity}</div>
                            <div className="text-sm text-gray-500">{new Date(student.lastActivityDate).toLocaleDateString()}</div>
                          </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs-companies" className="space-y-6">
            {/* Jobs & Companies Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-unisphere-blue" />
                    <div className="text-2xl font-bold">{analyticsData.totalJobs}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-unisphere-blue" />
                    <div className="text-2xl font-bold">{analyticsData.totalCompanies}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Jobs & Companies Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Applications by Company</CardTitle>
                  <CardDescription>Top companies by application volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jobApplicationsData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="company" type="category" width={120} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="applications" fill="var(--color-applications)" name="Applications" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Job Postings</CardTitle>
                  <CardDescription>Job posting trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyJobPostings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="jobs" 
                          stroke="var(--color-jobs)" 
                          strokeWidth={3}
                          dot={{ fill: "var(--color-jobs)", strokeWidth: 2, r: 6 }}
                          name="Job Postings"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Companies and Recent Jobs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Companies by Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Hires</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.applications}</TableCell>
                          <TableCell>{company.hires}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Listings</CardTitle>
                  <CardDescription>Latest job postings overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Applications</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobListings.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.applications}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
