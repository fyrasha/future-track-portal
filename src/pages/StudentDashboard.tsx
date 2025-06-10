
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Briefcase, Trophy, Clock, MapPin, Users } from "lucide-react";

// Mock data for student activities
const mockActivities = {
  first: [
    { id: 1, name: "University Orientation", type: "orientation", date: "2022-09-15", status: "completed" },
    { id: 2, name: "Programming Workshop", type: "workshop", date: "2022-10-20", status: "completed" },
    { id: 3, name: "Career Fair 2022", type: "career", date: "2022-11-15", status: "completed" }
  ],
  second: [
    { id: 4, name: "Tech Symposium", type: "seminar", date: "2023-03-10", status: "completed" },
    { id: 5, name: "Internship Application Workshop", type: "workshop", date: "2023-04-22", status: "completed" },
    { id: 6, name: "Study Group Formation", type: "academic", date: "2023-05-15", status: "completed" }
  ],
  third: [
    { id: 7, name: "Industry Visit - TechCorp", type: "visit", date: "2024-02-28", status: "completed" },
    { id: 8, name: "Resume Building Workshop", type: "workshop", date: "2024-03-15", status: "completed" },
    { id: 9, name: "Mock Interview Session", type: "interview", date: "2024-04-10", status: "completed" }
  ],
  final: [
    { id: 10, name: "Final Year Project Presentation", type: "academic", date: "2025-01-20", status: "completed" },
    { id: 11, name: "Job Application Bootcamp", type: "workshop", date: "2025-02-15", status: "completed" },
    { id: 12, name: "Networking Event", type: "networking", date: "2025-03-05", status: "upcoming" },
    { id: 13, name: "Graduate Job Fair", type: "career", date: "2025-04-12", status: "upcoming" }
  ]
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'workshop': return <Briefcase className="h-4 w-4" />;
    case 'career': return <Trophy className="h-4 w-4" />;
    case 'seminar': return <Users className="h-4 w-4" />;
    case 'interview': return <Clock className="h-4 w-4" />;
    case 'visit': return <MapPin className="h-4 w-4" />;
    default: return <Calendar className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'upcoming': return 'bg-blue-100 text-blue-800';
    case 'missed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const StudentDashboard = () => {
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

  if (!isLoggedIn || userRole !== 'student') {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-xl text-unisphere-darkBlue">Access Denied</CardTitle>
              <CardDescription>
                Please log in as a student to access your dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const totalActivities = Object.values(mockActivities).flat().length;
  const completedActivities = Object.values(mockActivities).flat().filter(a => a.status === 'completed').length;
  const upcomingActivities = Object.values(mockActivities).flat().filter(a => a.status === 'upcoming').length;

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Track your academic journey and activities</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-unisphere-blue" />
                <div className="text-2xl font-bold">{totalActivities}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{completedActivities}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{upcomingActivities}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activities by Year */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Years</TabsTrigger>
            <TabsTrigger value="first">First Year</TabsTrigger>
            <TabsTrigger value="second">Second Year</TabsTrigger>
            <TabsTrigger value="third">Third Year</TabsTrigger>
            <TabsTrigger value="final">Final Year</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {Object.entries(mockActivities).map(([year, activities]) => (
                <Card key={year}>
                  <CardHeader>
                    <CardTitle className="capitalize">{year} Year Activities</CardTitle>
                    <CardDescription>{activities.length} activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-unisphere-blue/10 rounded-full">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{activity.name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {Object.entries(mockActivities).map(([year, activities]) => (
            <TabsContent key={year} value={year}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{year} Year Activities</CardTitle>
                  <CardDescription>{activities.length} activities during this academic year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-unisphere-blue/10 rounded-full">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">
                              {activity.type} • {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
