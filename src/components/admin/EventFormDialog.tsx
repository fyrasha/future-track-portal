
import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Event, EventFormValues } from '@/types/event';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSuccess?: () => void;
}

const EventFormDialog = ({ open, onOpenChange, event, onSuccess }: EventFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<Partial<EventFormValues>>({});

  useEffect(() => {
    if (event) {
      setFormValues({
        ...event,
        date: format(event.date.toDate(), 'yyyy-MM-dd'),
      });
    } else {
      setFormValues({
        name: '',
        description: '',
        type: 'workshop',
        date: '',
        time: '',
        location: '',
        capacity: 0,
        status: 'upcoming',
      });
    }
  }, [event, open]);

  const { mutate: saveEvent, isPending } = useMutation({
    mutationFn: async (values: EventFormValues) => {
      const eventData = {
        ...values,
        date: Timestamp.fromDate(new Date(values.date)),
        capacity: Number(values.capacity),
      };

      if (event) {
        // Update existing event
        const eventRef = doc(db, 'events', event.id);
        await updateDoc(eventRef, eventData);
      } else {
        // Create new event
        await addDoc(collection(db, 'events'), {
          ...eventData,
          participants: 0,
          createdAt: Timestamp.now(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: `Event ${event ? 'updated' : 'created'}`,
        description: `The event has been successfully ${event ? 'updated' : 'saved'}.`,
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save event: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEvent(formValues as EventFormValues);
  };

  const handleValueChange = (field: keyof EventFormValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {event
              ? 'Update the details for this event.'
              : 'Fill in the details to create a new event.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Event Name</Label>
                    <Input id="name" value={formValues.name} onChange={(e) => handleValueChange('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={formValues.type} onValueChange={(value) => handleValueChange('type', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formValues.description} onChange={(e) => handleValueChange('description', e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={formValues.date} onChange={(e) => handleValueChange('date', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" value={formValues.time} onChange={(e) => handleValueChange('time', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={formValues.location} onChange={(e) => handleValueChange('location', e.target.value)} required />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" value={formValues.capacity} onChange={(e) => handleValueChange('capacity', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                     <Select value={formValues.status} onValueChange={(value) => handleValueChange('status', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormDialog;
