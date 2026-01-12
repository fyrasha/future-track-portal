
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Building,
  Briefcase,
  Clock,
  CheckCircle2
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

// Mock analytics data
const jobViewsData = [
  { name: 'Mon', views: 120, applications: 15 },
  { name: 'Tue', views: 150, applications: 22 },
  { name: 'Wed', views: 180, applications: 28 },
  { name: 'Thu', views: 160, applications: 20 },
  { name: 'Fri', views: 200, applications: 35 },
  { name: 'Sat', views: 90, applications: 8 },
  { name: 'Sun', views: 70, applications: 5 }
];

const jobTypeData = [
  { name: 'Full-time', value: 45, color: '#3B82F6' },
  { name: 'Internship', value: 30, color: '#10B981' },
  { name: 'Part-time', value: 15, color: '#F59E0B' },
  { name: 'Contract', value: 10, color: '#EF4444' }
];

const topCompanies = [
  { name: 'TechCorp Malaysia', jobs: 15, applications: 120, avgViews: 85 },
  { name: 'Analytics Pro', jobs: 8, applications: 95, avgViews: 72 },
  { name: 'Creative Solutions', jobs: 12, applications: 88, avgViews: 68 },
  { name: 'StartupKL', jobs: 6, applications: 45, avgViews: 55 },
  { name: 'Global Finance', jobs: 4, applications: 32, avgViews: 48 }
];

const applicationTrends = [
  { month: 'Jan', applications: 280 },
  { month: 'Feb', applications: 320 },
  { month: 'Mar', applications: 380 },
  { month: 'Apr', applications: 420 },
  { month: 'May', applications: 485 }
];

const AdminAnalytics = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(loggedIn);
      setUserRole(role);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (!isLoggedIn || userRole !== 'admin') {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-xl text-unisphere-darkBlue">Access Denied</CardTitle>
              <CardDescription>
                Admin access required to view analytics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Job Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into job postings, applications, and platform engagement</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Job Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,847</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +3 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Job Posts</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12 new this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Views & Applications Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Job Views & Applications</CardTitle>
              <CardDescription>Job engagement metrics for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3B82F6" name="Views" />
                  <Bar dataKey="applications" fill="#10B981" name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Job Type Distribution</CardTitle>
              <CardDescription>Breakdown of job types on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {jobTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {jobTypeData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}: {entry.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Trends */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>Monthly application volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Companies</CardTitle>
            <CardDescription>Companies ranked by job posting activity and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-unisphere-blue/10 rounded-full">
                      <span className="font-bold text-unisphere-blue">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{company.name}</h4>
                      <p className="text-sm text-gray-600">{company.jobs} active jobs</p>
                    </div>
                  </div>
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="font-medium">{company.applications}</span>
                      </div>
                      <p className="text-xs text-gray-500">Applications</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="font-medium">{company.avgViews}</span>
                      </div>
                      <p className="text-xs text-gray-500">Avg Views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminAnalytics;
