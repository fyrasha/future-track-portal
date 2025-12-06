
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Briefcase, Trophy, Clock, MapPin, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface EventRegistration {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: Timestamp;
  registeredAt: Timestamp;
  type?: string;
  status?: string;
}

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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      const id = localStorage.getItem('userId');
      setIsLoggedIn(loggedIn);
      setUserRole(role);
      setUserId(id);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const { data: registrations, isLoading } = useQuery<EventRegistration[]>({
    queryKey: ['studentRegistrations', userId],
    queryFn: async () => {
      if (!userId) return [];
      // Simple query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, "eventRegistrations"),
        where("studentId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const regs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as EventRegistration));
      // Sort client-side by registeredAt descending
      return regs.sort((a, b) => b.registeredAt.toMillis() - a.registeredAt.toMillis());
    },
    enabled: !!userId,
  });

  const { data: events } = useQuery({
    queryKey: ['allEvents'],
    queryFn: async () => {
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const eventsMap: { [key: string]: any } = {};
      eventsSnapshot.docs.forEach(doc => {
        eventsMap[doc.id] = doc.data();
      });
      return eventsMap;
    },
  });

  const enrichedRegistrations = registrations?.map(reg => {
    const event = events?.[reg.eventId];
    return {
      ...reg,
      type: event?.type || 'event',
      status: event?.date && event.date.toDate() < new Date() ? 'completed' : 'upcoming'
    };
  }) || [];

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

  const totalActivities = enrichedRegistrations.length;
  const completedActivities = enrichedRegistrations.filter(a => a.status === 'completed').length;
  const upcomingActivities = enrichedRegistrations.filter(a => a.status === 'upcoming').length;
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  // Chart data for activity types with colors
  const activityTypeData = enrichedRegistrations.reduce((acc: any[], reg) => {
    const existing = acc.find(item => item.type === reg.type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ type: reg.type || 'event', count: 1, name: reg.type || 'event' });
    }
    return acc;
  }, []);

  // Chart data for monthly registrations
  const monthlyData = enrichedRegistrations.reduce((acc: any[], reg) => {
    const month = reg.registeredAt.toDate().toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, []).slice(-6);

  const COLORS = ['#8B5CF6', '#F97316', '#10B981', '#3B82F6', '#EC4899', '#F59E0B'];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Track your academic journey and activities</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">{totalActivities}</div>
                <Calendar className="h-8 w-8 text-primary/20" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">All registered events</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">{completedActivities}</div>
                <Trophy className="h-8 w-8 text-green-500/20" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{completionRate}% completion rate</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">{upcomingActivities}</div>
                <Clock className="h-8 w-8 text-blue-500/20" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Events to attend</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">{completionRate}%</div>
                <TrendingUp className="h-8 w-8 text-purple-500/20" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Overall completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-full bg-purple-100">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                Activity by Type
              </CardTitle>
              <CardDescription>Distribution of your registered events</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {activityTypeData.length > 0 ? (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="type"
                        label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: '#888', strokeWidth: 1 }}
                      >
                        {activityTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-3">
                                <p className="font-medium capitalize">{payload[0].name}</p>
                                <p className="text-sm text-muted-foreground">{payload[0].value} events</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        formatter={(value) => <span className="capitalize text-sm">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No activity data yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-full bg-blue-100">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                Registration Trend
              </CardTitle>
              <CardDescription>Your event registrations over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {monthlyData.length > 0 ? (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        allowDecimals={false}
                      />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-3">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-muted-foreground">{payload[0].value} registrations</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="url(#barGradient)" 
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No registration data yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activities List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Registered Events</CardTitle>
                <CardDescription>{enrichedRegistrations.length} total registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {enrichedRegistrations.length > 0 ? (
                  <div className="space-y-3">
                    {enrichedRegistrations.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{activity.eventName}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {activity.type} • {activity.eventDate.toDate().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No event registrations yet. Visit the Events page to register!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>{upcomingActivities} events</CardDescription>
              </CardHeader>
              <CardContent>
                {enrichedRegistrations.filter(a => a.status === 'upcoming').length > 0 ? (
                  <div className="space-y-3">
                    {enrichedRegistrations.filter(a => a.status === 'upcoming').map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{activity.eventName}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {activity.type} • {activity.eventDate.toDate().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Events</CardTitle>
                <CardDescription>{completedActivities} events</CardDescription>
              </CardHeader>
              <CardContent>
                {enrichedRegistrations.filter(a => a.status === 'completed').length > 0 ? (
                  <div className="space-y-3">
                    {enrichedRegistrations.filter(a => a.status === 'completed').map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{activity.eventName}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {activity.type} • {activity.eventDate.toDate().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No completed events yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
