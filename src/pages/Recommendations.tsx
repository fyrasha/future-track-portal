import { useState } from "react";
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
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock career path recommendations
const careerPaths = [
  {
    id: 1,
    title: "Software Development",
    description: "Build a career in creating software applications and systems.",
    matchScore: 95,
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
    roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
    growthRate: "Faster than average"
  },
  {
    id: 2,
    title: "Data Science",
    description: "Analyze and interpret complex data to help organizations make better decisions.",
    matchScore: 88,
    skills: ["Python", "R", "Statistics", "Machine Learning", "SQL"],
    roles: ["Data Analyst", "Data Scientist", "Business Intelligence Analyst"],
    growthRate: "Much faster than average"
  },
  {
    id: 3,
    title: "UX/UI Design",
    description: "Create intuitive, accessible, and visually appealing digital experiences.",
    matchScore: 82,
    skills: ["UI Design", "Wireframing", "User Research", "Figma", "Adobe XD"],
    roles: ["UX Designer", "UI Designer", "Product Designer"],
    growthRate: "Faster than average"
  },
  {
    id: 4,
    title: "Digital Marketing",
    description: "Promote products, services, and brands through digital channels.",
    matchScore: 75,
    skills: ["Social Media Marketing", "SEO", "Content Creation", "Analytics", "Email Marketing"],
    roles: ["Digital Marketing Specialist", "SEO Specialist", "Content Strategist"],
    growthRate: "Average"
  }
];

// Mock recommended jobs based on skills and interests
const recommendedJobs = [
  {
    id: 101,
    title: "Junior React Developer",
    company: "TechSolutions Inc.",
    location: "Remote",
    matchScore: 92,
    postedDate: "2025-05-18"
  },
  {
    id: 102,
    title: "Frontend Developer Intern",
    company: "WebWorks Co.",
    location: "San Francisco, CA",
    matchScore: 89,
    postedDate: "2025-05-16"
  },
  {
    id: 103,
    title: "Junior Data Analyst",
    company: "DataViz Corp",
    location: "Boston, MA",
    matchScore: 85,
    postedDate: "2025-05-17"
  },
  {
    id: 104,
    title: "UI Design Associate",
    company: "Creative Interfaces",
    location: "Chicago, IL",
    matchScore: 82,
    postedDate: "2025-05-15"
  }
];

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState<"careers" | "jobs">("careers");
  
  // Simulate no user logged in
  const isLoggedIn = false;

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

  // This would be the logged-in view (keeping original structure for when login is implemented)
  const careerPaths: any[] = [];
  const recommendedJobs: any[] = [];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Career Recommendations</h1>
          <p className="text-gray-600">Personalized career paths and job recommendations based on your skills and preferences</p>
        </div>

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
            {careerPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-md transition-shadow">
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
            ))}
          </div>
        )}

        {/* Recommended Jobs Section */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            {recommendedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
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
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="outline" className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                        View Details
                      </Button>
                    </Link>
                    <Button className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
      </div>
    </MainLayout>
  );
};

export default Recommendations;
