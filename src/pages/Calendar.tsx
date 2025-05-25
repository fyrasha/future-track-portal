import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, Info, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";

// Mock deadline data - shown when logged in
const mockDeadlines = [
  {
    id: 1,
    title: "Software Engineer Intern Application",
    company: "TechCorp Malaysia",
    type: "application",
    date: new Date(2025, 5, 30), // June 30, 2025
    priority: "high"
  },
  {
    id: 2,
    title: "Data Analyst Application",
    company: "Analytics Pro KL",
    type: "application",
    date: new Date(2025, 5, 15), // June 15, 2025
    priority: "medium"
  },
  {
    id: 3,
    title: "Resume Update",
    company: null,
    type: "task",
    date: new Date(2025, 4, 25), // May 25, 2025
    priority: "low"
  },
  {
    id: 4,
    title: "Career Fair",
    company: "University Malaya Career Center",
    type: "event",
    date: new Date(2025, 6, 10), // July 10, 2025
    priority: "medium"
  },
  {
    id: 5,
    title: "Interview",
    company: "TechCorp Malaysia",
    type: "interview",
    date: new Date(2025, 6, 5), // July 5, 2025
    priority: "high"
  }
];

// Get events for specific date
const getEventsForDate = (date: Date, isLoggedIn: boolean) => {
  if (!isLoggedIn) return [];
  return mockDeadlines.filter(deadline => 
    deadline.date.getDate() === date.getDate() && 
    deadline.date.getMonth() === date.getMonth() && 
    deadline.date.getFullYear() === date.getFullYear()
  );
};

// Function to get upcoming deadlines sorted by date
const getUpcomingDeadlines = (isLoggedIn: boolean) => {
  if (!isLoggedIn) return [];
  const today = new Date();
  return [...mockDeadlines]
    .filter(deadline => deadline.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Function to get highlighted dates for the calendar
const getHighlightedDates = (isLoggedIn: boolean) => {
  if (!isLoggedIn) return {};
  const dates: Record<string, { date: Date; priority: string }[]> = {};
  
  mockDeadlines.forEach(deadline => {
    const dateStr = format(deadline.date, "yyyy-MM-dd");
    if (!dates[dateStr]) {
      dates[dateStr] = [];
    }
    dates[dateStr].push({
      date: deadline.date,
      priority: deadline.priority
    });
  });
  
  return dates;
};

const typeColors: Record<string, string> = {
  application: "bg-blue-100 text-blue-800",
  task: "bg-green-100 text-green-800",
  event: "bg-purple-100 text-purple-800",
  interview: "bg-amber-100 text-amber-800"
};

const priorityColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-green-500"
};

const CalendarPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(loggedIn);
      setUserRole(role);
      setSelectedEvents(getEventsForDate(new Date(), loggedIn));
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const highlightedDates = getHighlightedDates(isLoggedIn);
  const upcomingDeadlines = getUpcomingDeadlines(isLoggedIn);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setSelectedEvents(getEventsForDate(newDate, isLoggedIn));
    }
  };

  // Custom day rendering for the calendar
  const dayRender = (day: Date): React.ReactNode => {
    if (!isLoggedIn) return null;
    
    const dateString = format(day, "yyyy-MM-dd");
    const events = highlightedDates[dateString];
    
    if (!events) return null;
    
    // Find the highest priority
    let highestPriority = "low";
    events.forEach(event => {
      if (event.priority === "high") highestPriority = "high";
      else if (event.priority === "medium" && highestPriority !== "high") highestPriority = "medium";
    });
    
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[highestPriority]}`}></div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-8">Calendar & Deadlines</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Calendar & Date Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-unisphere-darkBlue">Application Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                  <div className="md:col-span-3">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      className="border rounded-md"
                      components={{
                        DayContent: props => (
                          <div className="relative h-9 w-9 p-0 font-normal">
                            {props.date.getDate()}
                            {dayRender(props.date)}
                          </div>
                        ),
                      }}
                    />
                    {isLoggedIn && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-full ${priorityColors.high}`}></div>
                          <span className="text-sm text-gray-600">High Priority</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-full ${priorityColors.medium}`}></div>
                          <span className="text-sm text-gray-600">Medium Priority</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-full ${priorityColors.low}`}></div>
                          <span className="text-sm text-gray-600">Low Priority</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-4">
                    <div className="mb-3 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-unisphere-blue" />
                      <h3 className="text-lg font-medium">
                        {format(date, "MMMM d, yyyy")}
                      </h3>
                    </div>
                    
                    {!isLoggedIn ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <LogIn className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">Login Required</h3>
                        <p className="text-gray-500 mb-4">Please log in to view your calendar events and deadlines.</p>
                        <Link to="/login">
                          <Button className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </Button>
                        </Link>
                      </div>
                    ) : selectedEvents.length > 0 ? (
                      <div className="space-y-4">
                        {selectedEvents.map(event => (
                          <div 
                            key={event.id} 
                            className={`p-4 rounded-md border ${
                              event.priority === "high" 
                                ? "border-red-200 bg-red-50" 
                                : event.priority === "medium"
                                ? "border-amber-200 bg-amber-50"
                                : "border-green-200 bg-green-50"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge className={typeColors[event.type]}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </Badge>
                            </div>
                            {event.company && (
                              <p className="text-sm text-gray-600 mt-1">{event.company}</p>
                            )}
                            <div className="flex items-center mt-3">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {format(event.date, "h:mm a")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No events</h3>
                        <p className="text-gray-500">There are no events scheduled for this day.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-unisphere-darkBlue">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <div className="text-center py-8">
                    <LogIn className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 mb-4">Login to view your deadlines</p>
                    <Link to="/login">
                      <Button className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Tabs defaultValue="all">
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                        <TabsTrigger value="applications" className="flex-1">Applications</TabsTrigger>
                        <TabsTrigger value="interviews" className="flex-1">Interviews</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="space-y-4">
                        {upcomingDeadlines.length > 0 ? (
                          upcomingDeadlines.map(deadline => (
                            <div 
                              key={deadline.id} 
                              className="p-3 border rounded-md flex items-start cursor-pointer hover:bg-gray-50"
                              onClick={() => {
                                setDate(deadline.date);
                                setSelectedEvents(getEventsForDate(deadline.date, isLoggedIn));
                              }}
                            >
                              <div 
                                className={`h-10 w-10 rounded-md ${
                                  deadline.priority === "high" 
                                    ? "bg-red-100" 
                                    : deadline.priority === "medium"
                                    ? "bg-amber-100"
                                    : "bg-green-100"
                                } flex flex-col items-center justify-center mr-3`}
                              >
                                <span className="text-xs font-medium">
                                  {format(deadline.date, "MMM")}
                                </span>
                                <span className="text-base font-bold">
                                  {format(deadline.date, "d")}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium">{deadline.title}</h4>
                                  <Badge className={`ml-2 ${typeColors[deadline.type]}`} variant="outline">
                                    {deadline.type.charAt(0).toUpperCase() + deadline.type.slice(1)}
                                  </Badge>
                                </div>
                                {deadline.company && (
                                  <p className="text-sm text-gray-600">{deadline.company}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  {format(deadline.date, "EEEE, MMMM d")}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Info className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500">No upcoming deadlines</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="applications" className="space-y-4">
                        {upcomingDeadlines
                          .filter(d => d.type === "application")
                          .map(deadline => (
                            <div 
                              key={deadline.id} 
                              className="p-3 border rounded-md flex items-start cursor-pointer hover:bg-gray-50"
                              onClick={() => {
                                setDate(deadline.date);
                                setSelectedEvents(getEventsForDate(deadline.date, isLoggedIn));
                              }}
                            >
                              <div 
                                className={`h-10 w-10 rounded-md ${
                                  deadline.priority === "high" 
                                    ? "bg-red-100" 
                                    : deadline.priority === "medium"
                                    ? "bg-amber-100"
                                    : "bg-green-100"
                                } flex flex-col items-center justify-center mr-3`}
                              >
                                <span className="text-xs font-medium">
                                  {format(deadline.date, "MMM")}
                                </span>
                                <span className="text-base font-bold">
                                  {format(deadline.date, "d")}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium">{deadline.title}</h4>
                                {deadline.company && (
                                  <p className="text-sm text-gray-600">{deadline.company}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  {format(deadline.date, "EEEE, MMMM d")}
                                </p>
                              </div>
                            </div>
                          ))
                        }
                      </TabsContent>
                      
                      <TabsContent value="interviews" className="space-y-4">
                        {upcomingDeadlines
                          .filter(d => d.type === "interview")
                          .map(deadline => (
                            <div 
                              key={deadline.id} 
                              className="p-3 border rounded-md flex items-start cursor-pointer hover:bg-gray-50"
                              onClick={() => {
                                setDate(deadline.date);
                                setSelectedEvents(getEventsForDate(deadline.date, isLoggedIn));
                              }}
                            >
                              <div 
                                className={`h-10 w-10 rounded-md ${
                                  deadline.priority === "high" 
                                    ? "bg-red-100" 
                                    : deadline.priority === "medium"
                                    ? "bg-amber-100"
                                    : "bg-green-100"
                                } flex flex-col items-center justify-center mr-3`}
                              >
                                <span className="text-xs font-medium">
                                  {format(deadline.date, "MMM")}
                                </span>
                                <span className="text-base font-bold">
                                  {format(deadline.date, "d")}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium">{deadline.title}</h4>
                                {deadline.company && (
                                  <p className="text-sm text-gray-600">{deadline.company}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  {format(deadline.date, "EEEE, MMMM d")}
                                </p>
                              </div>
                            </div>
                          ))
                        }
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6 flex justify-center">
                      <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                        Add New Reminder
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-unisphere-darkBlue">Calendar Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Login to access calendar settings</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-unisphere-blue focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-unisphere-blue focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sync with Google Calendar</span>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-unisphere-blue transition-colors focus:outline-none focus:ring-2 focus:ring-unisphere-blue focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
