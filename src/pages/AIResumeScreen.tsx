
import { useState } from "react";
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
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Download
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const mockFeedback = {
  score: 78,
  matchScore: 82,
  strengths: [
    "Strong technical skills with React and TypeScript",
    "Relevant internship experience",
    "Clear presentation of projects"
  ],
  improvements: [
    "Add more quantifiable achievements",
    "Include certifications section",
    "Expand on leadership experiences"
  ],
  keywordMatches: [
    "React", "TypeScript", "JavaScript", "Web Development"
  ],
  missingKeywords: [
    "Docker", "AWS", "CI/CD", "Agile"
  ]
};

const AIResumeScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>("Software Engineer Intern");
  const { toast } = useToast();

  const handleResumeUpload = () => {
    // Mock resume upload
    setUploadedResume("John_Doe_Resume.pdf");
    toast({
      title: "Resume Uploaded",
      description: "Your resume has been successfully uploaded."
    });
  };

  const startScan = () => {
    if (!uploadedResume) {
      toast({
        title: "No Resume Found",
        description: "Please upload your resume before scanning.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      toast({
        title: "Scan Complete",
        description: "AI has finished analyzing your resume."
      });
    }, 3000);
  };

  const resetScan = () => {
    setScanComplete(false);
    setUploadedResume(null);
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
                <CardTitle className="text-xl text-unisphere-darkBlue">Upload Resume</CardTitle>
                <CardDescription>Upload your resume for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!uploadedResume ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-unisphere-blue transition-colors"
                    onClick={handleResumeUpload}
                  >
                    <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOCX (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-unisphere-darkBlue mr-3" />
                      <div>
                        <p className="font-medium">{uploadedResume}</p>
                        <p className="text-xs text-gray-500">Uploaded just now</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-3 bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
                      onClick={resetScan}
                    >
                      Change Resume
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-unisphere-darkBlue">Select Job</CardTitle>
                <CardDescription>Choose a job to match your resume against</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Software Engineer Intern", "Data Analyst", "Marketing Assistant"].map((job) => (
                  <div 
                    key={job}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedJob === job ? 'border-unisphere-blue bg-unisphere-blue/10' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <p className="font-medium">{job}</p>
                  </div>
                ))}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Overall Score</p>
                      <div className="flex items-center mt-1">
                        <div className="h-10 w-10 rounded-full bg-unisphere-blue flex items-center justify-center text-white font-bold mr-3">
                          {mockFeedback.score}%
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-unisphere-blue" 
                            style={{ width: `${mockFeedback.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Job Match Score</p>
                      <div className="flex items-center mt-1">
                        <div className="h-10 w-10 rounded-full bg-unisphere-darkBlue flex items-center justify-center text-white font-bold mr-3">
                          {mockFeedback.matchScore}%
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-unisphere-darkBlue" 
                            style={{ width: `${mockFeedback.matchScore}%` }}
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
                        {mockFeedback.strengths.map((strength, index) => (
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
                        {mockFeedback.improvements.map((improvement, index) => (
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
                        {mockFeedback.keywordMatches.map((keyword, index) => (
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
                        {mockFeedback.missingKeywords.map((keyword, index) => (
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
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={handleResumeUpload}
                      className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10"
                      onClick={() => window.location.href = "/resume"}
                    >
                      Create Resume
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
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
