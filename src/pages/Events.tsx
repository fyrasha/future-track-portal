
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  category: string;
  image?: string;
}

const Events = () => {
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Career Fair 2024",
      description: "Meet with top employers and explore career opportunities across various industries.",
      date: "2024-12-15",
      time: "10:00 AM - 4:00 PM",
      location: "Main Campus - Student Center",
      capacity: 500,
      registered: 342,
      category: "Career"
    },
    {
      id: 2,
      title: "Tech Workshop: React Development",
      description: "Hands-on workshop covering React fundamentals and modern development practices.",
      date: "2024-12-18",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Science Building - Room 201",
      capacity: 50,
      registered: 38,
      category: "Workshop"
    },
    {
      id: 3,
      title: "Networking Mixer",
      description: "Connect with alumni, industry professionals, and fellow students in a relaxed setting.",
      date: "2024-12-20",
      time: "6:00 PM - 8:00 PM",
      location: "University Club",
      capacity: 100,
      registered: 67,
      category: "Networking"
    },
    {
      id: 4,
      title: "Guest Lecture: AI in Modern Business",
      description: "Industry expert discusses the impact of artificial intelligence on business operations.",
      date: "2024-12-22",
      time: "1:00 PM - 2:30 PM",
      location: "Lecture Hall A",
      capacity: 200,
      registered: 156,
      category: "Lecture"
    },
    {
      id: 5,
      title: "Resume Review Session",
      description: "Get your resume reviewed by career counselors and industry professionals.",
      date: "2024-12-25",
      time: "9:00 AM - 12:00 PM",
      location: "Career Services Office",
      capacity: 30,
      registered: 24,
      category: "Career"
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Career': return 'bg-blue-100 text-blue-800';
      case 'Workshop': return 'bg-green-100 text-green-800';
      case 'Networking': return 'bg-purple-100 text-purple-800';
      case 'Lecture': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailabilityColor = (registered: number, capacity: number) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ongoing Events</h1>
          <p className="text-gray-600">Discover and register for upcoming events and activities</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                  <span className={`text-sm font-medium ${getAvailabilityColor(event.registered, event.capacity)}`}>
                    {event.capacity - event.registered} spots left
                  </span>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.date)}
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
                    {event.registered}/{event.capacity} registered
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    className="flex-1"
                    disabled={event.registered >= event.capacity}
                  >
                    {event.registered >= event.capacity ? 'Full' : 'Register'}
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;
