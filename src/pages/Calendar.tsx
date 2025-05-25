
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  Building,
  Plus,
  LogIn
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import ReminderSystem from "@/components/ReminderSystem";
import { Link } from "react-router-dom";

// Mock calendar events
const mockEvents = [
  {
    id: 1,
    title: "Technical Interview",
    company: "TechCorp Malaysia",
    date: "2025-05-30",
    time: "14:00 - 15:30",
    type: "interview",
    location: "Zoom Meeting",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Application Deadline",
    company: "Analytics Pro",
    date: "2025-06-15", 
    time: "23:59",
    type: "deadline",
    location: "Online",
    status: "pending"
  },
  {
    id: 3,
    title: "Career Fair",
    company: "University of Malaya",
    date: "2025-06-20",
    time: "09:00 - 17:00",
    type: "event",
    location: "Main Hall, UM",
    status: "registered"
  }
];

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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

  const events = isLoggedIn ? mockEvents : [];

  // Get events for selected date
  const selectedDateEvents = selectedDate 
    ? events.filter(event => 
        new Date(event.date).toDateString() === selectedDate.toDateString()
      )
    : [];

  // Get upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= today && eventDate <= nextWeek;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get dates that have events for calendar highlighting
  const eventDates = events.map(event => new Date(event.date));

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'event':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'registered':
        return <Badge className="bg-blue-100 text-blue-800">Registered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Calendar</h1>
            <p className="text-gray-600">Keep track of interviews, deadlines, and important events</p>
          </div>

          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-unisphere-blue/10 p-4 rounded-full">
                  <CalendarIcon className="h-12 w-12 text-unisphere-blue" />
                </div>
              </div>
              <CardTitle className="text-xl text-unisphere-darkBlue">Access Your Calendar</CardTitle>
              <CardDescription>
                Please log in to view your personalized calendar with interviews and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login to Access Calendar
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="w-full border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Calendar</h1>
          <p className="text-gray-600">Keep track of interviews, deadlines, and important events</p>
        </div>

        {/* Reminder System */}
        <ReminderSystem />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Calendar View</CardTitle>
                  <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    eventDay: eventDates
                  }}
                  modifiersStyles={{
                    eventDay: { 
                      backgroundColor: '#dbeafe', 
                      color: '#1e40af',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Selected Date Events */}
            {selectedDate && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    Events for {selectedDate.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateEvents.map((event) => (
                        <div key={event.id} className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{event.title}</h4>
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              {event.company}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No events scheduled for this date</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="border-l-4 border-unisphere-blue pl-4 py-2">
                        <h5 className="font-medium text-sm">{event.title}</h5>
                        <p className="text-xs text-gray-600 mb-1">{event.company}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleDateString()} at {event.time.split(' - ')[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/applications">
                  <Button variant="outline" className="w-full border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                    View Applications
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="w-full border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                    Browse Jobs
                  </Button>
                </Link>
                <Link to="/resume">
                  <Button variant="outline" className="w-full border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                    Update Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
