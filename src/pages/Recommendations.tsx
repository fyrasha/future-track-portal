import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Star, 
  Calendar,
  ArrowRight,
  LogIn,
  Target,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CareerPath {
  title: string;
  description: string;
  matchScore: number;
  skills: string[];
  roles: string[];
  growthRate: string;
}

interface RecommendedJob {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  postedDate: string;
}

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState<"careers" | "jobs">("careers");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(loggedIn);
      setUserRole(role);
      
      if (loggedIn) {
        await fetchRecommendations();
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      // Fetch user's resumes
      const resumesRef = collection(db, "resumes");
      const q = query(resumesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setHasResume(false);
        setIsLoading(false);
        return;
      }

      setHasResume(true);
      
      // Get the most recent resume
      const resumes: any[] = [];
      querySnapshot.forEach((doc) => {
        resumes.push({ id: doc.id, ...doc.data() });
      });
      
      const latestResume = resumes[0]; // Use first resume for recommendations

      // Call edge function to generate recommendations
      const { data, error } = await supabase.functions.invoke('generate-career-recommendations', {
        body: {
          skills: latestResume.skills || [],
          education: latestResume.education || [],
          experience: latestResume.experience || []
        }
      });

      if (error) throw error;

      if (data.careerPaths) {
        setCareerPaths(data.careerPaths);
      }
      if (data.recommendedJobs) {
        setRecommendedJobs(data.recommendedJobs);
      }

      toast.success("Recommendations generated based on your resume!");
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Career Recommendations</h1>
            <p className="text-gray-600">Personalized career paths and job recommendations based on your skills and preferences</p>
          </div>

          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-unisphere-blue/10 p-4 rounded-full">
                  <Target className="h-12 w-12 text-unisphere-blue" />
                </div>
              </div>
              <CardTitle className="text-xl text-unisphere-darkBlue">Get Personalized Recommendations</CardTitle>
              <CardDescription>
                Log in to receive career path suggestions and job recommendations tailored to your skills and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login for Recommendations
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="w-full border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                    Browse All Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!hasResume && isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Career Recommendations</h1>
            <p className="text-gray-600">Personalized career paths and job recommendations based on your skills</p>
          </div>

          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-unisphere-blue/10 p-4 rounded-full">
                  <Target className="h-12 w-12 text-unisphere-blue" />
                </div>
              </div>
              <CardTitle className="text-xl text-unisphere-darkBlue">Upload Your Resume First</CardTitle>
              <CardDescription>
                To get personalized career recommendations, please upload or create your resume first
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/resume">
                  <Button className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Go to Resume Builder
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="w-full border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                    Browse All Jobs
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
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Career Recommendations</h1>
          <p className="text-gray-600">Personalized career paths and job recommendations based on your skills</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-unisphere-blue mb-4" />
            <p className="text-gray-600">Analyzing your resume and generating recommendations...</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b mb-8">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "careers" 
              ? "text-unisphere-darkBlue border-b-2 border-unisphere-darkBlue" 
              : "text-gray-500 hover:text-unisphere-darkBlue"}`}
            onClick={() => setActiveTab("careers")}
          >
            Career Paths
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "jobs" 
              ? "text-unisphere-darkBlue border-b-2 border-unisphere-darkBlue" 
              : "text-gray-500 hover:text-unisphere-darkBlue"}`}
            onClick={() => setActiveTab("jobs")}
          >
            Recommended Jobs
          </button>
        </div>

            {/* Career Paths Section */}
            {activeTab === "careers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {careerPaths.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <Target className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600">No career recommendations available yet.</p>
                  </div>
                ) : (
                  careerPaths.map((path, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-unisphere-darkBlue">{path.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      <Star className="h-3 w-3 mr-1" /> 
                      {path.matchScore}% Match
                    </Badge>
                  </div>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Common Roles</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-sm">
                        {path.roles.map((role, index) => (
                          <li key={index}>{role}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2">
                      <Button className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                        Explore Career Path
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

            {/* Recommended Jobs Section */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                {recommendedJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600">No job recommendations available yet.</p>
                  </div>
                ) : (
                  recommendedJobs.map((job, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-unisphere-darkBlue">{job.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        {job.company} · {job.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <Star className="h-3 w-3 mr-1" /> 
                      {job.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                      <div className="flex justify-end space-x-3">
                        <Link to="/jobs">
                          <Button variant="outline" className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                            View Details
                          </Button>
                        </Link>
                        <Link to="/jobs">
                          <Button className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
                <div className="flex justify-center mt-6">
                  <Link to="/jobs">
                    <Button variant="outline" className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                      View All Jobs
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Recommendations;
