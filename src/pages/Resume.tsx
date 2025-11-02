
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LogIn, Download, Edit, Plus, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { supabase } from "@/integrations/supabase/client";

interface Resume {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    location?: string;
  };
  education: any[];
  experience: any[];
  skills: string[];
  projects: any[];
}

const Resume = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(loggedIn);
      setUserRole(role);
      if (loggedIn) {
        fetchResumes();
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const fetchResumes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const resumesRef = collection(db, "resumes");
      const q = query(resumesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const fetchedResumes: Resume[] = [];
      querySnapshot.forEach((doc) => {
        fetchedResumes.push({ id: doc.id, ...doc.data() } as Resume);
      });
      
      setResumes(fetchedResumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF or Word document",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('parse-resume', {
          body: { fileContent: text }
        });

        if (error) throw error;

        const user = auth.currentUser;
        if (!user) throw new Error("Not logged in");

        await addDoc(collection(db, "resumes"), {
          ...data,
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        toast({
          title: "Resume Uploaded",
          description: "Your resume has been successfully uploaded and parsed."
        });

        fetchResumes();
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEdit = (resume: Resume) => {
    setSelectedResume(resume);
    setEditMode(true);
    setShowBuilder(true);
  };

  const handleDownload = (resume: Resume) => {
    const content = `
${resume.personalInfo.name}
${resume.personalInfo.email} | ${resume.personalInfo.phone}
${resume.personalInfo.linkedin || ''} ${resume.personalInfo.location || ''}

EDUCATION
${resume.education.map(edu => `${edu.degree} in ${edu.field}\n${edu.institution} (${edu.startDate} - ${edu.endDate})`).join('\n\n')}

EXPERIENCE
${resume.experience.map(exp => `${exp.position} at ${exp.company}\n${exp.startDate} - ${exp.endDate}\n${exp.description}`).join('\n\n')}

SKILLS
${resume.skills.join(', ')}

PROJECTS
${resume.projects.map(proj => `${proj.name}\n${proj.description}\nTechnologies: ${proj.technologies || 'N/A'}`).join('\n\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Resume Downloaded",
      description: "Your resume has been downloaded successfully."
    });
  };

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Resume Builder</h1>
            <p className="text-gray-600">Create and manage your professional resume</p>
          </div>

          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-unisphere-blue/10 p-4 rounded-full">
                  <FileText className="h-12 w-12 text-unisphere-blue" />
                </div>
              </div>
              <CardTitle className="text-xl text-unisphere-darkBlue">Build Your Resume</CardTitle>
              <CardDescription>
                Please log in to access the resume builder and manage your professional profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login to Build Resume
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
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Resume Builder</h1>
          <p className="text-gray-600">Create and manage your professional resume</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-unisphere-darkBlue">My Resume</CardTitle>
                <CardDescription>
                  {resume.personalInfo.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{resume.personalInfo.name}</h4>
                    <p className="text-sm text-gray-600">{resume.experience[0]?.position || 'Student'}</p>
                    <p className="text-xs text-gray-500 mt-2">{resume.education[0]?.institution || 'University'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
                      onClick={() => handleEdit(resume)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
                      onClick={() => handleDownload(resume)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="hover:shadow-md transition-shadow border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="text-xl text-gray-600">Create New Resume</CardTitle>
              <CardDescription>
                Start building a new resume from scratch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <Button 
                  className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white"
                  onClick={() => {
                    setSelectedResume(null);
                    setEditMode(false);
                    setShowBuilder(true);
                  }}
                >
                  Create Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-dashed border-2 border-unisphere-blue">
            <CardHeader>
              <CardTitle className="text-xl text-unisphere-darkBlue">Upload Resume</CardTitle>
              <CardDescription>
                Upload an existing resume (PDF or Word)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto text-unisphere-blue mb-4" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <Button 
                  className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Resume"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-unisphere-darkBlue">AI Resume Builder</CardTitle>
              <CardDescription>
                Let AI help you create a professional resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="bg-gradient-to-r from-unisphere-blue to-unisphere-darkBlue p-3 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <Link to="/ai-resume-screen">
                  <Button className="bg-gradient-to-r from-unisphere-blue to-unisphere-darkBlue text-white">
                    Use AI Builder
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-unisphere-darkBlue">Resume Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Include your full name, phone number, email address, and LinkedIn profile.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Professional Summary</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Write a brief 2-3 sentence summary highlighting your key skills and experience.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Work Experience</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    List your work experience in reverse chronological order with specific achievements.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Skills & Education</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Include relevant technical and soft skills, plus your educational background.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showBuilder} onOpenChange={(open) => {
        setShowBuilder(open);
        if (!open) {
          setSelectedResume(null);
          setEditMode(false);
          fetchResumes();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-unisphere-darkBlue">
              {editMode ? "Edit Your Resume" : "Create Your Resume"}
            </DialogTitle>
          </DialogHeader>
          <ResumeBuilder initialData={editMode ? selectedResume : undefined} />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Resume;
