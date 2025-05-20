
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Calendar, CheckCircle, FileText, Search } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-unisphere-darkBlue to-unisphere-blue py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Your Career Journey <br />Starts with UniSphere
              </h1>
              <p className="text-lg md:text-xl text-unisphere-lightBlue/90 mb-8 md:pr-12">
                Connect with top employers, get AI-powered career recommendations,
                and manage your job applications all in one place.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Student accessing career platform" 
                className="rounded-lg shadow-xl max-w-full md:max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-unisphere-darkBlue mb-12">
            Everything You Need to Launch Your Career
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-unisphere-blue/10 p-3 rounded-full inline-block mb-4">
                <FileText className="text-unisphere-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-unisphere-darkBlue mb-3">AI-Powered Resume Screening</h3>
              <p className="text-gray-600">
                Get instant feedback on your resume and learn how to improve it for better results with employers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-unisphere-blue/10 p-3 rounded-full inline-block mb-4">
                <Search className="text-unisphere-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-unisphere-darkBlue mb-3">Personalized Job Recommendations</h3>
              <p className="text-gray-600">
                Our AI analyzes your skills and experience to recommend the most relevant job opportunities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-unisphere-blue/10 p-3 rounded-full inline-block mb-4">
                <Calendar className="text-unisphere-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-unisphere-darkBlue mb-3">Application Tracking</h3>
              <p className="text-gray-600">
                Easily track application deadlines, interviews, and follow-ups with our intuitive calendar.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-unisphere-blue/10 p-3 rounded-full inline-block mb-4">
                <CheckCircle className="text-unisphere-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-unisphere-darkBlue mb-3">Career Path Recommendations</h3>
              <p className="text-gray-600">
                Discover potential career paths based on your strengths, interests, and educational background.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-unisphere-blue/10 p-3 rounded-full inline-block mb-4">
                <FileText className="text-unisphere-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-unisphere-darkBlue mb-3">Professional Profile</h3>
              <p className="text-gray-600">
                Create a standout professional profile that showcases your skills and experience to potential employers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="bg-unisphere-blue/10 p-3 rounded-full inline-block mb-4">
                <Calendar className="text-unisphere-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-unisphere-darkBlue mb-3">Reminder Alerts</h3>
              <p className="text-gray-600">
                Never miss a deadline with timely notifications for applications, interviews and follow-ups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Image */}
      <section className="bg-unisphere-darkBlue py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Take the Next Step in Your Career?
              </h2>
              <p className="text-lg text-unisphere-lightBlue/90 mb-8 max-w-2xl mx-auto md:mx-0">
                Join thousands of students who have found their dream jobs through UniSphere.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                alt="Career Technology" 
                className="rounded-lg shadow-xl max-w-full md:max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
