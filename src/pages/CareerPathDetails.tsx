import { useLocation, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, TrendingUp, Briefcase, GraduationCap, Target, BookOpen } from "lucide-react";

interface CareerPath {
  title: string;
  description: string;
  matchScore: number;
  skills: string[];
  roles: string[];
  growthRate: string;
}

const CareerPathDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const careerPath = location.state?.careerPath as CareerPath | undefined;

  if (!careerPath) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <Target className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Career Path Not Found</h2>
            <p className="text-gray-500 mb-6">The career path information is not available.</p>
            <Button onClick={() => navigate("/recommendations")} className="bg-unisphere-darkBlue hover:bg-unisphere-blue">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recommendations
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/recommendations")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recommendations
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">{careerPath.title}</h1>
              <p className="text-gray-600 max-w-2xl">{careerPath.description}</p>
            </div>
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2 self-start">
              <Star className="h-4 w-4 mr-2" />
              {careerPath.matchScore}% Match
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-unisphere-blue" />
                  Career Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  A career in <strong>{careerPath.title}</strong> offers exciting opportunities for growth and development.
                  This field is experiencing <strong>{careerPath.growthRate}</strong> growth, making it an excellent choice
                  for professionals looking to build a sustainable and rewarding career.
                </p>
                <p className="text-gray-700">
                  Based on your resume and skills, you have a <strong>{careerPath.matchScore}% compatibility</strong> with this career path.
                  With some additional skill development and experience, you can excel in this field.
                </p>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-unisphere-blue" />
                  Key Skills Required
                </CardTitle>
                <CardDescription>Skills that will help you succeed in this career</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {careerPath.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 px-4 py-2 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-unisphere-darkBlue mb-2">💡 Tip</h4>
                  <p className="text-sm text-gray-700">
                    Focus on developing these skills through online courses, projects, and practical experience.
                    Consider getting certifications in relevant areas to boost your profile.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Common Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-unisphere-blue" />
                  Common Job Roles
                </CardTitle>
                <CardDescription>Positions you can target in this career path</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careerPath.roles.map((role, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-unisphere-blue/10 p-2 rounded-full">
                        <Briefcase className="h-4 w-4 text-unisphere-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{role}</p>
                        <p className="text-sm text-gray-500">Entry to senior level positions available</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Growth Rate Card */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <TrendingUp className="h-5 w-5" />
                  Growth Outlook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-700 mb-2">{careerPath.growthRate}</p>
                <p className="text-sm text-green-800">
                  This career is experiencing strong growth with increasing demand for skilled professionals.
                </p>
              </CardContent>
            </Card>

            {/* Next Steps Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-unisphere-blue" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">1</div>
                  <p className="text-sm text-gray-700">Update your resume to highlight relevant skills</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">2</div>
                  <p className="text-sm text-gray-700">Take online courses to fill skill gaps</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">3</div>
                  <p className="text-sm text-gray-700">Build projects to demonstrate your abilities</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">4</div>
                  <p className="text-sm text-gray-700">Apply to entry-level positions in this field</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to="/jobs" className="block">
                <Button className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Related Jobs
                </Button>
              </Link>
              <Link to="/resume" className="block">
                <Button variant="outline" className="w-full border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                  Update My Resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CareerPathDetails;
