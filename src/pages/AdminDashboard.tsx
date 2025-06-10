
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
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const analyticsData = {
  totalStudents: 1250,
  activeStudents: 892,
  inactiveStudents: 358,
  totalJobs: 45,
  totalCompanies: 23
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
  { id: 1, title: "Software Engineer Intern", company: "TechCorp Malaysia", status: "Active", applications: 23 },
  { id: 2, title: "Data Analyst", company: "Analytics Pro", status: "Active", applications: 18 },
  { id: 3, title: "Marketing Assistant", company: "Brand Masters", status: "Pending", applications: 8 }
];

const employers = [
  { id: 1, company: "TechCorp Malaysia", contact: "hr@techcorp.my", status: "Verified", joinDate: "2025-01-15" },
  { id: 2, company: "Analytics Pro", contact: "careers@analyticspro.my", status: "Pending", joinDate: "2025-02-10" },
  { id: 3, company: "Brand Masters", contact: "jobs@brandmasters.my", status: "Verified", joinDate: "2025-01-20" }
];

const AdminDashboard = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage students, jobs, and employers</p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="jobs">Job Management</TabsTrigger>
            <TabsTrigger value="employers">Employer Review</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
            <TabsTrigger value="events">Event Management</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

            {/* Top Companies and Inactive Students */}
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
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Job Listings Management</CardTitle>
                  <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobListings.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>
                          <Badge className={job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.applications}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
          </TabsContent>

          <TabsContent value="employers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employer Review</CardTitle>
                <CardDescription>Review and manage employer registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employers.map((employer) => (
                      <TableRow key={employer.id}>
                        <TableCell className="font-medium">{employer.company}</TableCell>
                        <TableCell>{employer.contact}</TableCell>
                        <TableCell>
                          <Badge className={employer.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {employer.status === 'Verified' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {employer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(employer.joinDate).toLocaleDateString()}</TableCell>
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
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage student accounts and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Student Management</h3>
                  <p className="text-gray-500">Student management features will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
