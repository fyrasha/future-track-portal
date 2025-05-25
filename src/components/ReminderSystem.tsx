
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Calendar, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reminder {
  id: number;
  title: string;
  type: 'interview' | 'application_deadline' | 'follow_up';
  date: string;
  time: string;
  company: string;
  priority: 'high' | 'medium' | 'low';
}

const mockReminders: Reminder[] = [
  {
    id: 1,
    title: "Technical Interview",
    type: "interview",
    date: "2025-05-30",
    time: "14:00",
    company: "TechCorp Malaysia",
    priority: "high"
  },
  {
    id: 2,
    title: "Application Deadline",
    type: "application_deadline",
    date: "2025-06-15",
    time: "23:59",
    company: "Analytics Pro",
    priority: "medium"
  },
  {
    id: 3,
    title: "Follow-up Email",
    type: "follow_up",
    date: "2025-05-28",
    time: "09:00",
    company: "Creative Solutions",
    priority: "low"
  }
];

const ReminderSystem = () => {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Check for upcoming reminders
    const checkReminders = () => {
      const now = new Date();
      const upcoming = reminders.filter(reminder => {
        const reminderDate = new Date(`${reminder.date} ${reminder.time}`);
        const timeDiff = reminderDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        
        // Show notification for reminders within 24 hours
        return hoursDiff > 0 && hoursDiff <= 24;
      });

      upcoming.forEach(reminder => {
        const reminderDate = new Date(`${reminder.date} ${reminder.time}`);
        const timeDiff = reminderDate.getTime() - now.getTime();
        const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
        
        if (hoursDiff <= 1) {
          toast({
            title: "Upcoming Reminder",
            description: `${reminder.title} with ${reminder.company} in ${hoursDiff === 0 ? 'less than an hour' : '1 hour'}`,
          });
        }
      });
    };

    // Check reminders every 30 minutes
    const interval = setInterval(checkReminders, 30 * 60 * 1000);
    
    // Check immediately
    checkReminders();

    return () => clearInterval(interval);
  }, [isLoggedIn, reminders, toast]);

  const dismissReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({
      title: "Reminder Dismissed",
      description: "Reminder has been removed from your list.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Bell className="h-4 w-4" />;
      case 'application_deadline':
        return <Clock className="h-4 w-4" />;
      case 'follow_up':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  const upcomingReminders = reminders.filter(reminder => {
    const reminderDate = new Date(`${reminder.date} ${reminder.time}`);
    return reminderDate.getTime() > new Date().getTime();
  }).slice(0, 3);

  if (upcomingReminders.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-unisphere-blue" />
          Upcoming Reminders
        </CardTitle>
        <CardDescription>
          You have {upcomingReminders.length} upcoming reminder{upcomingReminders.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-unisphere-blue/10 rounded-full">
                  {getTypeIcon(reminder.type)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{reminder.title}</h4>
                  <p className="text-sm text-gray-600">
                    {reminder.company} • {new Date(`${reminder.date} ${reminder.time}`).toLocaleDateString()} at {reminder.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(reminder.priority)}>
                  {reminder.priority}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissReminder(reminder.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderSystem;
