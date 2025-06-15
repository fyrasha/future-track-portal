
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building, MapPin } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  location?: string;
  appliedAt: Timestamp;
  status: string;
  nextSteps?: string;
}

interface ApplicationDetailsDialogProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplicationDetailsDialog = ({
  application,
  open,
  onOpenChange,
}: ApplicationDetailsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setNextSteps(application.nextSteps || "");
    }
  }, [application]);

  const updateMutation = useMutation({
    mutationFn: async (data: { status: string; nextSteps: string }) => {
      if (!application) throw new Error("No application selected");
      const appRef = doc(db, "applications", application.id);
      await updateDoc(appRef, {
        status: data.status,
        nextSteps: data.nextSteps,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", localStorage.getItem('userId')] });
      toast({
        title: "Application Updated",
        description: "Your application details have been saved.",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ status, nextSteps });
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Application Details</DialogTitle>
          <DialogDescription>
            Update the status and next steps for your application.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <h3 className="font-semibold text-unisphere-darkBlue mb-2 text-lg">
            {application.jobTitle}
          </h3>
          <div className="flex items-center text-gray-600 mb-1">
            <Building className="h-4 w-4 mr-2" />
            {application.companyName}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {application.location || 'N/A'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={setStatus} value={status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Offer Received">Offer Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="nextSteps" className="text-right pt-2">
                Next Steps
              </Label>
              <Textarea
                id="nextSteps"
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                placeholder="e.g., Technical interview on June 20th at 10 AM"
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
