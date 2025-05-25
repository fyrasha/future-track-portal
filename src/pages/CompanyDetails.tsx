
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  Briefcase,
  Star,
  ArrowLeft
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

// Mock company data
const mockCompanies = {
  "1": {
    id: 1,
    name: "TechCorp Malaysia",
    logo: "/placeholder.svg",
    description: "Leading technology company specializing in innovative software solutions and digital transformation services.",
    industry: "Technology",
    size: "500-1000 employees",
    founded: "2010",
    website: "https://techcorp.my",
    email: "careers@techcorp.my",
    phone: "+60 3-1234 5678",
    location: "Kuala Lumpur, Malaysia",
    rating: 4.5,
    benefits: ["Health Insurance", "Flexible Working Hours", "Professional Development", "Performance Bonus"],
    culture: "We foster innovation, collaboration, and continuous learning in a dynamic work environment.",
    openPositions: [
      { id: 1, title: "Software Engineer Intern", type: "Internship", posted: "2025-05-15" },
      { id: 6, title: "Senior Developer", type: "Full-time", posted: "2025-05-10" }
    ]
  },
  "2": {
    id: 2,
    name: "Analytics Pro",
    logo: "/placeholder.svg",
    description: "Data analytics and business intelligence company helping organizations make data-driven decisions.",
    industry: "Data Analytics",
    size: "100-500 employees",
    founded: "2015",
    website: "https://analyticspro.my",
    email: "hr@analyticspro.my",
    phone: "+60 3-8765 4321",
    location: "Petaling Jaya, Malaysia",
    rating: 4.2,
    benefits: ["Remote Work", "Learning Budget", "Health Coverage", "Stock Options"],
    culture: "Data-driven culture with emphasis on analytical thinking and innovation.",
    openPositions: [
      { id: 2, title: "Data Analyst", type: "Full-time", posted: "2025-05-10" }
    ]
  }
};

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (id && mockCompanies[id as keyof typeof mockCompanies]) {
      setCompany(mockCompanies[id as keyof typeof mockCompanies]);
    }
  }, [id]);

  if (!company) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>Company Not Found</CardTitle>
              <CardDescription>The requested company could not be found.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/jobs">
                <Button className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white">
                  Back to Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/jobs">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-unisphere-blue/10 rounded-lg flex items-center justify-center">
                    <Building className="h-8 w-8 text-unisphere-blue" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-unisphere-darkBlue">{company.name}</CardTitle>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-gray-600">{company.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="text-gray-600">{company.rating}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{company.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Industry</h4>
                    <p className="text-gray-600">{company.industry}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Company Size</h4>
                    <p className="text-gray-600">{company.size}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Founded</h4>
                    <p className="text-gray-600">{company.founded}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Website</h4>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-unisphere-blue hover:underline">
                      Visit Website
                    </a>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Company Culture</h4>
                  <p className="text-gray-700">{company.culture}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Benefits & Perks</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.benefits.map((benefit: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Open Positions */}
            <Card>
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
                <CardDescription>Current job openings at {company.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {company.openPositions.map((position: any) => (
                    <div key={position.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{position.title}</h5>
                          <div className="flex items-center mt-1 space-x-4">
                            <Badge variant="outline">{position.type}</Badge>
                            <span className="text-sm text-gray-500">Posted: {new Date(position.posted).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Link to={`/jobs/${position.id}`}>
                          <Button size="sm" className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-500" />
                  <a href={`mailto:${company.email}`} className="text-unisphere-blue hover:underline">
                    {company.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-500" />
                  <span className="text-gray-700">{company.phone}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-3 text-gray-500" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-unisphere-blue hover:underline">
                    Company Website
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Open Positions</span>
                  <span className="font-medium">{company.openPositions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company Rating</span>
                  <span className="font-medium">{company.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Years in Business</span>
                  <span className="font-medium">{new Date().getFullYear() - parseInt(company.founded)} years</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyDetails;
