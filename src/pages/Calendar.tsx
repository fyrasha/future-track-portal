import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  Building,
  Plus,
  LogIn,
  Trash2,
  Edit
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import ReminderSystem from "@/components/ReminderSystem";
import { Link } from "react-router-dom";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  company: string;
  date: Timestamp;
  time: string;
  type: "interview" | "event" | "deadline";
  location: string;
  status: string;
  description?: string;
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState(false);
  const { toast } = useToast();

  // Form state for adding/editing events
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    date: "",
    time: "",
    type: "event" as "interview" | "event" | "deadline",
    location: "",
    status: "pending",
    description: ""
  });

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

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  const fetchEvents = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch manually created calendar events
      const eventsRef = collection(db, "calendar_events");
      const q = query(eventsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const fetchedEvents: CalendarEvent[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as CalendarEvent);
      });

      // Fetch registered events from event registrations
      const registrationsRef = collection(db, "eventRegistrations");
      const regQuery = query(registrationsRef, where("studentId", "==", user.uid));
      const regSnapshot = await getDocs(regQuery);
      
      regSnapshot.forEach((doc) => {
        const regData = doc.data();
        // Transform registered event into calendar event format
        fetchedEvents.push({
          id: `reg_${doc.id}`,
          userId: user.uid,
          title: regData.eventName,
          company: "University Event",
          date: regData.eventDate,
          time: "TBD",
          type: "event",
          location: "Check Events page for details",
          status: "registered",
          description: "Event registration from Events page"
        } as CalendarEvent);
      });
      
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load calendar events.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Not Logged In",
          description: "Please log in to add events.",
          variant: "destructive"
        });
        return;
      }

      if (!formData.title || !formData.date || !formData.time) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      const eventData = {
        userId: user.uid,
        title: formData.title,
        company: formData.company,
        date: Timestamp.fromDate(new Date(formData.date)),
        time: formData.time,
        type: formData.type,
        location: formData.location,
        status: formData.status,
        description: formData.description,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, "calendar_events"), eventData);
      
      toast({
        title: "Event Added",
        description: "Your event has been added to the calendar."
      });

      setAddEventDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: "Failed to add event.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      const eventRef = doc(db, "calendar_events", selectedEvent.id);
      await updateDoc(eventRef, {
        title: formData.title,
        company: formData.company,
        date: Timestamp.fromDate(new Date(formData.date)),
        time: formData.time,
        type: formData.type,
        location: formData.location,
        status: formData.status,
        description: formData.description,
        updatedAt: Timestamp.now()
      });

      toast({
        title: "Event Updated",
        description: "Your event has been updated."
      });

      setEventDetailsDialogOpen(false);
      setEditingEvent(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "calendar_events", eventId));
      
      toast({
        title: "Event Deleted",
        description: "The event has been removed from your calendar."
      });

      setEventDetailsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      date: "",
      time: "",
      type: "event",
      location: "",
      status: "pending",
      description: ""
    });
  };

  const openAddEventDialog = () => {
    resetForm();
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd")
      }));
    }
    setAddEventDialogOpen(true);
  };

  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      company: event.company,
      date: format(event.date.toDate(), "yyyy-MM-dd"),
      time: event.time,
      type: event.type,
      location: event.location,
      status: event.status,
      description: event.description || ""
    });
    setEventDetailsDialogOpen(true);
  };

  // Get events for selected date
  const selectedDateEvents = selectedDate 
    ? events.filter(event => 
        event.date.toDate().toDateString() === selectedDate.toDateString()
      )
    : [];

  // Get upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    const eventDate = event.date.toDate();
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= today && eventDate <= nextWeek;
  }).sort((a, b) => a.date.toMillis() - b.date.toMillis());

  // Group event dates by type for calendar color coding
  const eventDatesByType = events.reduce((acc, event) => {
    const dateStr = event.date.toDate().toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event.type);
    return acc;
  }, {} as Record<string, string[]>);

  // Custom day content to show colored dots for events
  const getDayModifiers = () => {
    const interviewDates: Date[] = [];
    const eventDates: Date[] = [];
    const deadlineDates: Date[] = [];

    events.forEach(event => {
      const date = event.date.toDate();
      if (event.type === "interview") {
        interviewDates.push(date);
      } else if (event.type === "event") {
        eventDates.push(date);
      } else if (event.type === "deadline") {
        deadlineDates.push(date);
      }
    });

    return { interviewDates, eventDates, deadlineDates };
  };

  const { interviewDates, eventDates: eventDateList, deadlineDates } = getDayModifiers();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'event':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
                  <Button 
                    className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white"
                    onClick={openAddEventDialog}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
                <CardDescription className="mt-2 flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm">Interviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm">Deadlines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Events</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full pointer-events-auto"
                  modifiers={{
                    interview: interviewDates,
                    event: eventDateList,
                    deadline: deadlineDates
                  }}
                  modifiersStyles={{
                    interview: { 
                      backgroundColor: '#10b981', 
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '50%'
                    },
                    event: { 
                      backgroundColor: '#3b82f6', 
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '50%'
                    },
                    deadline: { 
                      backgroundColor: '#ef4444', 
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '50%'
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
                        <div 
                          key={event.id} 
                          className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getEventTypeColor(event.type)}`}
                          onClick={() => openEventDetails(event)}
                        >
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
                          <p className="text-xs mt-2 opacity-70">Click to view details</p>
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
                      <div 
                        key={event.id} 
                        className="border-l-4 border-unisphere-blue pl-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => openEventDetails(event)}
                      >
                        <h5 className="font-medium text-sm">{event.title}</h5>
                        <p className="text-xs text-gray-600 mb-1">{event.company}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {event.date.toDate().toLocaleDateString()} at {event.time.split(' - ')[0]}
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

        {/* Add Event Dialog */}
        <Dialog open={addEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Create a new calendar event, interview, or deadline</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Technical Interview"
                />
              </div>
              <div>
                <Label htmlFor="type">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., TechCorp Malaysia"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 14:00 - 15:30"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Zoom Meeting or Office Address"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes or details..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setAddEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white"
                  onClick={handleAddEvent}
                >
                  Add Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Event Details Dialog */}
        {selectedEvent && (
          <Dialog open={eventDetailsDialogOpen} onOpenChange={setEventDetailsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingEvent ? "Edit Event" : "Event Details"}</DialogTitle>
                <DialogDescription>
                  {editingEvent ? "Update event information" : "View and manage your event"}
                </DialogDescription>
              </DialogHeader>
              {editingEvent ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-type">Event Type *</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-company">Company/Organization</Label>
                    <Input
                      id="edit-company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-date">Date *</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-time">Time *</Label>
                      <Input
                        id="edit-time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setEditingEvent(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white"
                      onClick={handleUpdateEvent}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${getEventTypeColor(selectedEvent.type)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                      {getStatusBadge(selectedEvent.status)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{selectedEvent.company || "No company specified"}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{selectedEvent.date.toDate().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{selectedEvent.location || "No location specified"}</span>
                      </div>
                    </div>
                    {selectedEvent.description && (
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <p className="text-sm whitespace-pre-wrap">{selectedEvent.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between gap-3 pt-4">
                    <Button 
                      variant="destructive"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => setEditingEvent(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button onClick={() => setEventDetailsDialogOpen(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
