import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Download,
  Search
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { supabase } from "@/integrations/supabase/client";

interface Resume {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  education: any[];
  experience: any[];
  skills: string[];
  projects: any[];
}

interface AnalysisResult {
  score: number;
  matchScore: number;
  strengths: string[];
  improvements: string[];
  keywordMatches: string[];
  missingKeywords: string[];
}

const AIResumeScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>("Software Engineer Intern");
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const jobPositions = [
    // Software & Technology
    "Software Engineer", "Software Engineer Intern", "Senior Software Engineer", "Lead Software Engineer", "Principal Software Engineer",
    "Frontend Developer", "Senior Frontend Developer", "Frontend Engineer", "React Developer", "Vue.js Developer", "Angular Developer",
    "Backend Developer", "Senior Backend Developer", "Backend Engineer", "Node.js Developer", "Python Developer", "Java Developer", "Go Developer",
    "Full Stack Developer", "Senior Full Stack Developer", "Full Stack Engineer", "MEAN Stack Developer", "MERN Stack Developer",
    "Mobile App Developer", "iOS Developer", "Android Developer", "React Native Developer", "Flutter Developer", "Mobile Engineer",
    "DevOps Engineer", "Senior DevOps Engineer", "DevOps Specialist", "Cloud DevOps Engineer", "Platform Engineer", "Site Reliability Engineer",
    "Cloud Architect", "Cloud Engineer", "AWS Engineer", "Azure Engineer", "Google Cloud Engineer", "Cloud Solutions Architect",
    "Data Engineer", "Senior Data Engineer", "Big Data Engineer", "Data Platform Engineer", "ETL Developer",
    "Machine Learning Engineer", "Senior ML Engineer", "AI Engineer", "Deep Learning Engineer", "Computer Vision Engineer", "NLP Engineer",
    "Data Scientist", "Senior Data Scientist", "Lead Data Scientist", "Applied Scientist", "Research Scientist",
    "Quality Assurance Engineer", "QA Engineer", "QA Automation Engineer", "Test Engineer", "SDET", "QA Lead",
    "Cybersecurity Analyst", "Security Engineer", "Information Security Analyst", "Penetration Tester", "Security Consultant",
    "Database Administrator", "DBA", "Database Engineer", "SQL Developer", "Database Architect",
    "Systems Engineer", "Systems Administrator", "Linux Administrator", "Windows Administrator", "Infrastructure Engineer",
    "Network Engineer", "Network Administrator", "Network Architect", "Network Security Engineer",
    "Solutions Architect", "Enterprise Architect", "Technical Architect", "IT Architect",
    "Game Developer", "Game Programmer", "Unity Developer", "Unreal Engine Developer", "Game Designer",
    "Blockchain Developer", "Smart Contract Developer", "Web3 Developer", "Cryptocurrency Developer",
    "Embedded Systems Engineer", "Firmware Engineer", "IoT Engineer", "Hardware Engineer",
    "Robotics Engineer", "Automation Engineer", "Control Systems Engineer",
    "IT Support Specialist", "IT Support Engineer", "Help Desk Technician", "Technical Support Engineer",
    
    // Product & Design
    "Product Manager", "Senior Product Manager", "Lead Product Manager", "Principal Product Manager", "Associate Product Manager",
    "Product Owner", "Technical Product Manager", "Growth Product Manager", "Product Marketing Manager",
    "Product Designer", "Senior Product Designer", "Lead Product Designer",
    "UI/UX Designer", "UI Designer", "UX Designer", "Senior UX Designer", "UX Researcher", "User Experience Designer",
    "Graphic Designer", "Senior Graphic Designer", "Visual Designer", "Brand Designer", "Illustrator",
    "Motion Graphics Designer", "Animator", "3D Artist", "Video Editor",
    "Industrial Designer", "Interaction Designer", "Service Designer",
    
    // Data & Analytics
    "Data Analyst", "Senior Data Analyst", "Business Intelligence Analyst", "Analytics Engineer",
    "Business Analyst", "Senior Business Analyst", "Systems Analyst", "Process Analyst",
    "Market Research Analyst", "Research Analyst", "Insights Analyst",
    "Financial Analyst", "Senior Financial Analyst", "Investment Analyst", "Budget Analyst", "Credit Analyst",
    "Risk Analyst", "Quantitative Analyst", "Actuarial Analyst",
    
    // Marketing & Sales
    "Marketing Manager", "Senior Marketing Manager", "Marketing Director", "Chief Marketing Officer",
    "Digital Marketing Specialist", "Digital Marketing Manager", "Performance Marketing Manager",
    "Content Marketing Manager", "Content Strategist", "Content Writer", "Copywriter", "SEO Content Writer",
    "SEO Specialist", "SEO Manager", "SEM Specialist", "Search Marketing Manager",
    "Social Media Manager", "Social Media Specialist", "Community Manager", "Social Media Coordinator",
    "Email Marketing Specialist", "Marketing Automation Specialist", "CRM Manager",
    "Brand Manager", "Brand Strategist", "Brand Marketing Manager",
    "Growth Marketing Manager", "Growth Hacker", "Acquisition Manager",
    "Sales Executive", "Account Executive", "Sales Representative", "Inside Sales Representative",
    "Sales Manager", "Sales Director", "Regional Sales Manager", "VP of Sales",
    "Account Manager", "Senior Account Manager", "Key Account Manager", "Client Success Manager",
    "Business Development Manager", "Business Development Representative", "Partnership Manager",
    "Customer Success Manager", "Customer Support Manager", "Client Relations Manager",
    
    // Operations & Management
    "Operations Manager", "Operations Director", "Chief Operations Officer", "Operations Analyst",
    "Supply Chain Manager", "Supply Chain Analyst", "Logistics Manager", "Procurement Manager",
    "Project Manager", "Senior Project Manager", "Program Manager (Operations)", "Portfolio Manager",
    "Scrum Master", "Agile Coach", "Product Owner", "Release Manager", "Delivery Manager",
    "Change Manager", "Organizational Change Manager", "Transformation Manager",
    "General Manager", "Operations Lead", "Team Lead", "Department Manager",
    
    // Finance & Accounting
    "Accountant", "Senior Accountant", "Staff Accountant", "Public Accountant",
    "Financial Controller", "Finance Manager", "Chief Financial Officer", "Finance Director",
    "Investment Banker", "Investment Associate", "Equity Research Analyst",
    "Portfolio Manager", "Asset Manager", "Wealth Manager", "Financial Advisor",
    "Tax Consultant", "Tax Analyst", "Tax Manager", "Auditor", "Internal Auditor",
    "Treasurer", "Cash Manager", "Financial Planning Analyst",
    
    // Human Resources
    "HR Manager", "HR Director", "Chief People Officer", "HR Business Partner",
    "Recruiter", "Technical Recruiter", "Talent Acquisition Specialist", "Recruitment Manager",
    "HR Generalist", "HR Specialist", "HR Coordinator", "HR Assistant",
    "Compensation & Benefits Specialist", "Payroll Specialist", "HRIS Analyst",
    "Learning & Development Manager", "Training Manager", "Organizational Development Specialist",
    "Employee Relations Specialist", "People Operations Manager",
    
    // Legal & Compliance
    "Legal Counsel", "Corporate Lawyer", "Attorney", "Senior Associate",
    "Paralegal", "Legal Assistant", "Legal Secretary",
    "Compliance Officer", "Compliance Manager", "Compliance Analyst", "Regulatory Affairs Specialist",
    "Contract Manager", "Contract Specialist", "Legal Operations Manager",
    
    // Healthcare & Medical
    "Registered Nurse", "Nurse Practitioner", "Clinical Nurse", "ER Nurse",
    "Medical Assistant", "Physician Assistant", "Healthcare Administrator",
    "Medical Coder", "Medical Biller", "Health Information Technician",
    "Clinical Research Coordinator", "Clinical Data Manager", "Pharmacist",
    
    // Engineering (Non-Software)
    "Mechanical Engineer", "Senior Mechanical Engineer", "Mechanical Design Engineer",
    "Civil Engineer", "Structural Engineer", "Construction Engineer",
    "Electrical Engineer", "Electronics Engineer", "Power Systems Engineer",
    "Chemical Engineer", "Process Engineer", "Manufacturing Engineer",
    "Aerospace Engineer", "Aeronautical Engineer", "Aviation Engineer",
    "Biomedical Engineer", "Environmental Engineer", "Sustainability Engineer",
    
    // Creative & Media
    "Creative Director", "Art Director", "Design Director",
    "Photographer", "Videographer", "Film Editor", "Producer",
    "Content Creator", "Influencer Marketing Manager", "Podcast Producer",
    "Journalist", "Editor", "Technical Writer", "Documentation Specialist",
    "Public Relations Specialist", "PR Manager", "Communications Manager",
    
    // Education & Training
    "Teacher", "Professor", "Instructor", "Tutor", "Academic Advisor",
    "Curriculum Developer", "Instructional Designer", "Educational Consultant",
    "Corporate Trainer", "Training Coordinator", "Learning Specialist",
    
    // Customer Service & Support
    "Customer Service Representative", "Customer Support Specialist", "Call Center Agent",
    "Technical Support Specialist", "Customer Experience Manager",
    "Client Services Coordinator", "Service Desk Analyst",
    
    // Hospitality & Tourism
    "Hotel Manager", "Front Desk Manager", "Event Coordinator", "Event Planner",
    "Restaurant Manager", "Chef", "Sous Chef", "Catering Manager",
    "Travel Consultant", "Tour Guide", "Hospitality Manager",
    
    // Retail & E-commerce
    "Store Manager", "Retail Manager", "Assistant Store Manager",
    "E-commerce Manager", "Merchandising Manager", "Buyer", "Category Manager",
    "Retail Analyst", "Inventory Manager", "Visual Merchandiser",
    
    // Real Estate
    "Real Estate Agent", "Real Estate Broker", "Property Manager",
    "Leasing Consultant", "Real Estate Analyst", "Commercial Real Estate Manager",
    
    // Nonprofit & Social Services
    "Program Manager (Nonprofit)", "Program Coordinator", "Grant Writer",
    "Social Worker", "Case Manager", "Counselor", "Therapist",
    "Fundraising Manager", "Development Director", "Volunteer Coordinator",
    
    // Manufacturing & Production
    "Production Manager", "Plant Manager", "Production Supervisor",
    "Quality Control Inspector", "Quality Manager", "Lean Manufacturing Specialist",
    "Maintenance Technician", "Industrial Engineer", "Process Improvement Specialist",
    
    // Administrative
    "Executive Assistant", "Administrative Assistant", "Office Manager",
    "Receptionist", "Secretary", "Personal Assistant", "Virtual Assistant",
    "Office Coordinator", "Administrative Coordinator",
    
    // Consulting
    "Management Consultant", "Strategy Consultant", "Business Consultant",
    "IT Consultant", "Technology Consultant", "Digital Transformation Consultant",
    "Financial Consultant", "Marketing Consultant", "HR Consultant",
    
    // Startups & Entrepreneurship
    "Founder", "Co-Founder", "Chief Executive Officer", "Chief Technology Officer", "Chief Operating Officer", "Chief Finance Officer",
    "Startup Consultant", "Venture Capital Analyst", "Angel Investor",
    
    // Internships & Entry Level
    "Software Engineering Intern", "Data Science Intern", "Marketing Intern",
    "Finance Intern", "HR Intern", "Business Development Intern",
    "Legal Intern", "Research Intern", "Operations Intern",
    "Graduate Trainee", "Management Trainee", "Associate",
  ];

  const filteredJobs = jobPositions.filter(job =>
    job.toLowerCase().includes(jobSearchQuery.toLowerCase())
  );

  // Fetch resumes from Firestore when component mounts
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Not Logged In",
          description: "Please log in to view your resumes.",
          variant: "destructive"
        });
        return;
      }

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
      toast({
        title: "Error",
        description: "Failed to load resumes from database.",
        variant: "destructive"
      });
    }
  };

  const startScan = async () => {
    if (!selectedResume) {
      toast({
        title: "No Resume Selected",
        description: "Please select a resume before scanning.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedJob) {
      toast({
        title: "No Job Selected",
        description: "Please select a job position.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    try {
      // Call the edge function to analyze the resume
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeData: selectedResume,
          jobDescription: selectedJob
        }
      });

      if (error) throw error;

      setAnalysisResult(data);
      setScanComplete(true);
      toast({
        title: "Scan Complete",
        description: "AI has finished analyzing your resume."
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setScanComplete(false);
    setSelectedResume(null);
    setAnalysisResult(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-4 md:mb-0">AI Resume Screening</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-unisphere-darkBlue">Select Resume</CardTitle>
                <CardDescription>Choose a resume from your saved resumes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {resumes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-600 mb-4">No resumes found</p>
                    <Button 
                      variant="outline"
                      className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
                      onClick={() => window.location.href = "/resume"}
                    >
                      Create Resume
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  resumes.map((resume) => (
                    <div 
                      key={resume.id}
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedResume?.id === resume.id ? 'border-unisphere-blue bg-unisphere-blue/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedResume(resume)}
                    >
                      <p className="font-medium">{resume.personalInfo?.name || 'Unnamed Resume'}</p>
                      <p className="text-xs text-gray-500">{resume.personalInfo?.email}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-unisphere-darkBlue">Select Job</CardTitle>
                <CardDescription>Choose a job to match your resume against</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search job positions..."
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {filteredJobs.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No jobs found</p>
                  ) : (
                    filteredJobs.map((job) => (
                      <div 
                        key={job}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedJob === job ? 'border-unisphere-blue bg-unisphere-blue/10' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        <p className="font-medium">{job}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
                  onClick={startScan}
                  disabled={isScanning}
                >
                  {isScanning ? "Scanning..." : "Match Resume to Job"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2">
            {isScanning ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <div className="animate-pulse mb-6">
                    <FileText className="h-16 w-16 mx-auto text-unisphere-blue" />
                  </div>
                  <h2 className="text-xl font-medium mb-3 text-unisphere-darkBlue">Analyzing Resume</h2>
                  <Progress value={65} className="max-w-xs mx-auto mb-6" />
                  <p className="text-gray-600 max-w-sm mx-auto">
                    Our AI is analyzing your resume against the selected job requirements. This will just take a moment...
                  </p>
                </CardContent>
              </Card>
            ) : scanComplete ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-unisphere-darkBlue">AI Analysis Results</CardTitle>
                    <Badge className="bg-unisphere-blue text-white">
                      {selectedJob}
                    </Badge>
                  </div>
                  <CardDescription>
                    Here's how your resume matches the selected job position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analysisResult && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Overall Score</p>
                          <div className="flex items-center mt-1">
                            <div className="h-10 w-10 rounded-full bg-unisphere-blue flex items-center justify-center text-white font-bold mr-3">
                              {analysisResult.score}%
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-unisphere-blue" 
                                style={{ width: `${analysisResult.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Job Match Score</p>
                          <div className="flex items-center mt-1">
                            <div className="h-10 w-10 rounded-full bg-unisphere-darkBlue flex items-center justify-center text-white font-bold mr-3">
                              {analysisResult.matchScore}%
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-unisphere-darkBlue" 
                                style={{ width: `${analysisResult.matchScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium mb-2 text-unisphere-darkBlue flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                            Strengths
                          </h3>
                          <ul className="space-y-2">
                            {analysisResult.strengths.map((strength, index) => (
                              <li key={index} className="bg-green-50 border border-green-100 p-2 rounded text-sm text-green-800">
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2 text-unisphere-darkBlue flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                            Areas for Improvement
                          </h3>
                          <ul className="space-y-2">
                            {analysisResult.improvements.map((improvement, index) => (
                              <li key={index} className="bg-amber-50 border border-amber-100 p-2 rounded text-sm text-amber-800">
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 text-unisphere-darkBlue">Keyword Analysis</h3>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">Found in your resume:</p>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.keywordMatches.map((keyword, index) => (
                              <Badge 
                                key={index}
                                className="bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Missing keywords:</p>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.missingKeywords.map((keyword, index) => (
                              <Badge 
                                key={index}
                                variant="outline"
                                className="border-amber-200 text-amber-800 hover:bg-amber-100"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
                    onClick={resetScan}
                  >
                    Scan Another Resume
                  </Button>
                  <Button 
                    className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h2 className="text-xl font-medium mb-2 text-gray-700">Ready to Analyze Your Resume</h2>
                  <p className="text-gray-600 max-w-sm mx-auto mb-6">
                    Upload your resume and select a job position to get AI-powered feedback on how well your resume matches the job requirements.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
                    onClick={() => window.location.href = "/resume"}
                  >
                    Create Resume
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIResumeScreen;
