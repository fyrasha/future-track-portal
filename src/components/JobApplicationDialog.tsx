
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building, Briefcase, MapPin } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc, increment, Timestamp } from "firebase/firestore";

interface JobApplicationDialogProps {
  job: {
    id: string; // Changed from number
    title: string;
    company: string;
    location: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobApplicationDialog = ({
  job,
  open,
  onOpenChange,
}: JobApplicationDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
  });

  const applyMutation = useMutation({
    mutationFn: async (applicationData: { name: string, email: string, phone: string, coverLetter: string, resumeName: string }) => {
        // 1. Add application to 'applications' collection
        await addDoc(collection(db, "applications"), {
            jobId: job.id,
            jobTitle: job.title,
            companyName: job.company,
            studentId: localStorage.getItem('userId') || "temp-student-id", // Using localStorage or placeholder
            studentName: applicationData.name,
            studentEmail: applicationData.email,
            studentPhone: applicationData.phone,
            coverLetter: applicationData.coverLetter,
            resumeFile: applicationData.resumeName,
            status: "Submitted",
            appliedAt: Timestamp.now(),
        });

        // 2. Increment application count on the job document
        const jobRef = doc(db, "jobs", job.id);
        await updateDoc(jobRef, {
            applications: increment(1)
        });
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
        
        toast({
            title: "Application Submitted",
            description: "Your application has been successfully submitted.",
        });
        
        onOpenChange(false); // Close dialog on success
    },
    onError: (error: Error) => {
        toast({
            title: "Submission Failed",
            description: error.message || "Could not submit your application. Please try again.",
            variant: "destructive",
        });
    },
    onSettled: () => {
      // Reset form after submission attempt
      setFormData({ name: "", email: "", phone: "", coverLetter: "", resume: null });
    }
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume) {
      toast({
        title: "Resume is required",
        description: "Please upload your resume before submitting.",
        variant: "destructive",
      });
      return;
    }
    applyMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      coverLetter: formData.coverLetter,
      resumeName: formData.resume.name, // Storing file name for now
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Apply for Position</DialogTitle>
          <DialogDescription>
            Complete the form below to apply for this job opportunity.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <h3 className="font-semibold text-unisphere-darkBlue mb-2 text-lg">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-1">
            <Building className="h-4 w-4 mr-2" />
            {job.company}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {job.location}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="resume" className="text-right pt-2">
                Resume
              </Label>
              <div className="col-span-3">
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  PDF, DOC, or DOCX format (max 5MB)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="coverLetter" className="text-right pt-2">
                Cover Letter
              </Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Tell us why you're interested in this position..."
                className="col-span-3"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
              disabled={applyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
