import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced mock event data with more examples
const mockEvents = [
  {
    id: 1,
    name: "Spring Career Fair 2025",
    type: "career",
    date: "2025-04-15",
    time: "09:00",
    location: "Main Hall",
    status: "upcoming",
    participants: 234,
    description: "Annual career fair with 50+ companies including tech giants, startups, and local businesses"
  },
  {
    id: 2,
    name: "Tech Innovation Workshop",
    type: "workshop",
    date: "2025-03-20",
    time: "14:00",
    location: "Computer Lab 1",
    status: "ongoing",
    participants: 45,
    description: "Learn about the latest technologies in software development, AI, and machine learning"
  },
  {
    id: 3,
    name: "Alumni Networking Event",
    type: "networking",
    date: "2025-02-28",
    time: "18:00",
    location: "Conference Room A",
    status: "completed",
    participants: 89,
    description: "Connect with successful alumni from various industries and build professional relationships"
  },
  {
    id: 4,
    name: "Resume Building Seminar",
    type: "seminar",
    date: "2025-06-10",
    time: "10:00",
    location: "Lecture Hall 2",
    status: "upcoming",
    participants: 67,
    description: "Professional resume writing tips and strategies for landing your dream job"
  },
  {
    id: 5,
    name: "Coding Bootcamp",
    type: "workshop",
    date: "2025-03-25",
    time: "09:00",
    location: "Computer Lab 2",
    status: "upcoming",
    participants: 32,
    description: "Intensive 3-day coding workshop covering modern web development frameworks"
  },
  {
    id: 6,
    name: "Industry Visit - Microsoft Malaysia",
    type: "visit",
    date: "2025-04-08",
    time: "13:00",
    location: "Microsoft Office, KL",
    status: "upcoming",
    participants: 25,
    description: "Exclusive visit to Microsoft Malaysia headquarters with office tour and tech talks"
  },
  {
    id: 7,
    name: "Entrepreneurship Summit",
    type: "seminar",
    date: "2025-03-15",
    time: "08:30",
    location: "Auditorium",
    status: "ongoing",
    participants: 156,
    description: "Learn from successful entrepreneurs and startup founders about building businesses"
  },
  {
    id: 8,
    name: "Mock Interview Session",
    type: "interview",
    date: "2025-02-20",
    time: "14:30",
    location: "Meeting Room B",
    status: "completed",
    participants: 78,
    description: "Practice interviews with industry professionals and receive valuable feedback"
  },
  {
    id: 9,
    name: "Data Science Workshop",
    type: "workshop",
    date: "2025-05-12",
    time: "10:00",
    location: "Lab 3",
    status: "upcoming",
    participants: 42,
    description: "Hands-on workshop on data analysis, visualization, and machine learning basics"
  },
  {
    id: 10,
    name: "Graduate School Information Session",
    type: "orientation",
    date: "2025-03-30",
    time: "15:00",
    location: "Lecture Hall 1",
    status: "upcoming",
    participants: 95,
    description: "Information about postgraduate programs, scholarships, and application processes"
  }
];

const EventManagement = () => {
  const [events, setEvents] = useState(mockEvents);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newEvent, setNewEvent] = useState({
    name: "",
    type: "",
    date: "",
    time: "",
    location: "",
    description: "",
    status: "upcoming"
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'career': return <Users className="h-4 w-4" />;
      case 'workshop': return <Calendar className="h-4 w-4" />;
      case 'networking': return <Users className="h-4 w-4" />;
      case 'seminar': return <Clock className="h-4 w-4" />;
      case 'visit': return <MapPin className="h-4 w-4" />;
      case 'interview': return <Clock className="h-4 w-4" />;
      case 'orientation': return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.type || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const eventToAdd = {
      ...newEvent,
      id: events.length + 1,
      participants: 0
    };

    setEvents([...events, eventToAdd]);
    setNewEvent({ name: "", type: "", date: "", time: "", location: "", description: "", status: "upcoming" });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Event Created",
      description: "New event has been successfully created.",
    });
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id ? selectedEvent : event
    );
    
    setEvents(updatedEvents);
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    
    toast({
      title: "Event Updated",
      description: "Event details have been successfully updated.",
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "Event has been successfully deleted.",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Event Management</h1>
          <p className="text-gray-600">Create and manage student activities and events</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-unisphere-blue" />
                <div className="text-2xl font-bold">{events.length}</div>
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
                <div className="text-2xl font-bold text-blue-600">
                  {events.filter(e => e.status === 'upcoming').length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-600" />
                <div className="text-2xl font-bold text-green-600">
                  {events.filter(e => e.status === 'ongoing').length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-unisphere-blue" />
                <div className="text-2xl font-bold">
                  {events.reduce((sum, event) => sum + event.participants, 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Events Management</CardTitle>
                <CardDescription>Manage all student events and activities</CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new student event or activity.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Event Name</Label>
                        <Input
                          id="name"
                          value={newEvent.name}
                          onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                          placeholder="Enter event name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Event Type</Label>
                        <Select onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="career">Career Fair</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="orientation">Orientation</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="visit">Industry Visit</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                          placeholder="Enter location"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Enter event description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvent}>Create Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-gray-500">{event.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(event.type)}
                        <span className="capitalize">{event.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{new Date(event.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{event.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.participants}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update the event details.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Event Name</Label>
                    <Input
                      id="edit-name"
                      value={selectedEvent.name}
                      onChange={(e) => setSelectedEvent({...selectedEvent, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={selectedEvent.status}
                      onValueChange={(value) => setSelectedEvent({...selectedEvent, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedEvent.description}
                    onChange={(e) => setSelectedEvent({...selectedEvent, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditEvent}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default EventManagement;
