
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LogIn, Download, Edit, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Resume = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(loggedIn);
      setUserRole(role);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

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
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-unisphere-darkBlue">My Resume</CardTitle>
              <CardDescription>
                Your current resume - Last updated 2 days ago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">John Doe</h4>
                  <p className="text-sm text-gray-600">Software Engineering Student</p>
                  <p className="text-xs text-gray-500 mt-2">University of Malaya • Expected 2025</p>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1 border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  onClick={() => setShowBuilder(true)}
                >
                  Create Resume
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

      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-unisphere-darkBlue">Create Your Resume</DialogTitle>
          </DialogHeader>
          <ResumeBuilder />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Resume;
