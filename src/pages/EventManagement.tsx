
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, query, orderBy, updateDoc } from "firebase/firestore";
import { Event } from "@/types/event";
import EventFormDialog from "@/components/admin/EventFormDialog";
import { Skeleton } from "@/components/ui/skeleton";

const EventManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const eventsCollection = collection(db, "events");
      const q = query(eventsCollection, orderBy("date", "desc"));
      const eventSnapshot = await getDocs(q);
      return eventSnapshot.docs.map(doc => ({ ...(doc.data() as Omit<Event, 'id'>), id: doc.id }));
    },
  });

  const { mutate: deleteEvent } = useMutation({
    mutationFn: (eventId: string) => {
      const eventRef = doc(db, 'events', eventId);
      return deleteDoc(eventRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event Deleted",
        description: "Event has been successfully deleted.",
      });
    },
    onError: (error) => {
        toast({
            title: "Error deleting event",
            description: error.message,
            variant: "destructive"
        })
    }
  });

  const { mutate: approveEvent } = useMutation({
    mutationFn: (eventId: string) => {
      const eventRef = doc(db, 'events', eventId);
      return updateDoc(eventRef, { status: 'upcoming' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event Approved",
        description: "Event has been approved and is now visible to students.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error approving event",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const { mutate: rejectEvent } = useMutation({
    mutationFn: (eventId: string) => {
      const eventRef = doc(db, 'events', eventId);
      return deleteDoc(eventRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event Rejected",
        description: "Event submission has been rejected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error rejecting event",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const pendingEvents = events.filter(e => e.status === 'pending');
  const activeEvents = events.filter(e => e.status !== 'pending');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleCreateNew = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Event Management</h1>
          <p className="text-gray-600">Create and manage student activities and events</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Events</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-unisphere-blue" />
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-10"/> : activeEvents.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-amber-800">Pending Approval</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <div className="text-2xl font-bold text-amber-600">
                  {isLoading ? <Skeleton className="h-8 w-10"/> : pendingEvents.length}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Upcoming</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">
                  {isLoading ? <Skeleton className="h-8 w-10"/> : activeEvents.filter(e => e.status === 'upcoming').length}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ongoing</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-600" />
                <div className="text-2xl font-bold text-green-600">
                  {isLoading ? <Skeleton className="h-8 w-10"/> : activeEvents.filter(e => e.status === 'ongoing').length}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Participants</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-unisphere-blue" />
                <div className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-10"/> : activeEvents.reduce((sum, event) => sum + event.participants, 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Events Section */}
        {pendingEvents.length > 0 && (
          <Card className="mb-8 border-amber-200">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-800">Pending Event Submissions</CardTitle>
              <CardDescription>Review and approve student-submitted events</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{event.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{event.date.toDate().toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{event.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{event.capacity}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => approveEvent(event.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 border-red-200"
                            onClick={() => rejectEvent(event.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Events Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Events List</CardTitle>
                <CardDescription>Manage all student events and activities</CardDescription>
              </div>
              <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white" onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                   <TableRow><TableCell colSpan={6} className="text-center text-destructive">Error loading events.</TableCell></TableRow>
                ) : events.filter(e => e.status !== 'pending').map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{event.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{event.date.toDate().toLocaleDateString()}</div>
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
                    <TableCell>{event.participants} / {event.capacity}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteEvent(event.id)}
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

        <EventFormDialog 
            open={isFormOpen} 
            onOpenChange={setIsFormOpen} 
            event={selectedEvent}
        />
      </div>
    </MainLayout>
  );
};

export default EventManagement;
