import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, User } from "lucide-react";
import { Event } from "@/types/event";

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isRegistered: boolean;
  onRegister: () => void;
  isRegistering: boolean;
}

const EventDetailsDialog = ({
  event,
  open,
  onOpenChange,
  isRegistered,
  onRegister,
  isRegistering
}: EventDetailsDialogProps) => {
  if (!event) return null;

  const isFull = event.participants >= event.capacity;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getCategoryColor(event.type)}>
              <span className="capitalize">{event.type}</span>
            </Badge>
            {isFull && <Badge variant="destructive">Full</Badge>}
          </div>
          <DialogTitle className="text-xl">{event.name}</DialogTitle>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(event.date.toDate())}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{event.participants}/{event.capacity} registered</span>
            </div>
          </div>

          {event.organizer && (
            <div className="flex items-center gap-2 text-sm border-t pt-4">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Organized by: {event.organizer}</span>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button 
              className="w-full"
              disabled={isFull || isRegistered || isRegistering}
              onClick={onRegister}
            >
              {isRegistering ? 'Registering...' : (isRegistered ? 'Already Registered' : (isFull ? 'Event Full' : 'Register Now'))}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
