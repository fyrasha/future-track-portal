
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Briefcase } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, runTransaction, Timestamp, increment } from 'firebase/firestore';
import { Event } from '@/types/event';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const Events = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const id = localStorage.getItem('userId');
      setIsLoggedIn(loggedIn);
      setUserId(id);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events', 'public'],
    queryFn: async () => {
        const eventsCollection = collection(db, "events");
        const q = query(eventsCollection, where("status", "in", ["upcoming", "ongoing"]), orderBy("date", "asc"));
        const eventSnapshot = await getDocs(q);
        return eventSnapshot.docs.map(doc => ({ ...(doc.data() as Omit<Event, 'id'>), id: doc.id }));
    }
  });

  const { data: registeredEventIds } = useQuery<string[]>({
    queryKey: ['myRegistrations', userId],
    queryFn: async () => {
      if (!userId) return [];
      const q = query(collection(db, "eventRegistrations"), where("studentId", "==", userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data().eventId);
    },
    enabled: !!userId,
  });

  const registerMutation = useMutation({
    mutationFn: async (event: Event) => {
      if (!userId) throw new Error("You must be logged in to register.");
      
      const eventRef = doc(db, "events", event.id);
      const registrationId = `${event.id}_${userId}`;
      const registrationRef = doc(db, "eventRegistrations", registrationId);

      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) {
          throw new Error("Event does not exist!");
        }

        const registrationDoc = await transaction.get(registrationRef);
        if (registrationDoc.exists()) {
          throw new Error("You are already registered for this event.");
        }

        const eventData = eventDoc.data();
        if (eventData.participants >= eventData.capacity) {
          throw new Error("This event is already full.");
        }

        transaction.set(registrationRef, {
            eventId: event.id,
            studentId: userId,
            eventName: eventData.name,
            eventDate: eventData.date,
            registeredAt: Timestamp.now(),
        });
        
        transaction.update(eventRef, { participants: increment(1) });
      });
    },
    onSuccess: () => {
      toast({ title: "Registration Successful", description: "You are now registered for the event." });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myRegistrations', userId] });
      queryClient.invalidateQueries({ queryKey: ['studentRegistrations', userId] });
    },
    onError: (error: Error) => {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    }
  });

  const handleRegister = (event: Event) => {
    if (!isLoggedIn) {
      toast({ title: "Login Required", description: "Please log in to register for events.", variant: "destructive" });
      return;
    }
    if(registeredEventIds?.includes(event.id)) {
        toast({ title: "Already Registered", description: "You have already registered for this event." });
        return;
    }
    registerMutation.mutate(event);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'career': return 'bg-blue-100 text-blue-800';
      case 'workshop': return 'bg-green-100 text-green-800';
      case 'networking': return 'bg-purple-100 text-purple-800';
      case 'seminar': return 'bg-orange-100 text-orange-800';
      case 'lecture': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailabilityColor = (registered: number, capacity: number) => {
    if (capacity <= 0) return 'text-gray-600';
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };
  
  const renderEvents = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /></CardContent>
        </Card>
      ));
    }
    
    if (error) {
        return <div className="text-center text-destructive py-10 md:col-span-3">Could not load events.</div>;
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12 md:col-span-3">
              <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-1">No upcoming events</h3>
              <p className="text-gray-500">Please check back later for new events.</p>
            </div>
        )
    }

    return events.map((event) => {
      const isFull = event.participants >= event.capacity;
      const isRegistered = registeredEventIds?.includes(event.id) ?? false;
      const isRegistering = registerMutation.isPending && registerMutation.variables?.id === event.id;

      return (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge className={getCategoryColor(event.type)}>
                <span className="capitalize">{event.type}</span>
              </Badge>
              <span className={`text-sm font-medium ${getAvailabilityColor(event.participants, event.capacity)}`}>
                {isFull ? 'Full' : `${event.capacity - event.participants} spots left`}
              </span>
            </div>
            <CardTitle className="text-xl">{event.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{event.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(event.date.toDate())}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                {event.participants}/{event.capacity} registered
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="default"
                className="flex-1"
                disabled={isFull || isRegistered || isRegistering}
                onClick={() => handleRegister(event)}
              >
                {isRegistering ? 'Registering...' : (isRegistered ? 'Registered' : (isFull ? 'Full' : 'Register'))}
              </Button>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    });
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
          <p className="text-gray-600">Discover and register for upcoming events and activities</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {renderEvents()}
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;
