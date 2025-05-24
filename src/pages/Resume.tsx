
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, PlusCircle, XCircle, Check, LogIn } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Link } from "react-router-dom";

const Resume = () => {
  // Simulate no user logged in
  const isLoggedIn = false;
  
  const [skills, setSkills] = useState<string[]>([
    "React", "TypeScript", "Node.js", "Python"
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [feedbackItems, setFeedbackItems] = useState([
    { id: 1, type: "improvement", message: "Consider adding more quantifiable achievements" },
    { id: 2, type: "positive", message: "Strong technical skills section" },
    { id: 3, type: "improvement", message: "Education section could be more detailed" }
  ]);

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-2">Resume Builder</h1>
            <p className="text-gray-600">Create and build your professional resume</p>
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
                Please log in to access the resume builder and create your professional resume
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-unisphere-darkBlue mb-4 md:mb-0">Resume Builder</h1>
          <div className="flex gap-3">
            <Button variant="outline" className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
              <Upload className="mr-2 h-4 w-4" />
              Import Resume
            </Button>
            <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          </div>
        </div>

        <Tabs defaultValue="builder">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="builder">Resume Builder</TabsTrigger>
            <TabsTrigger value="ai-feedback">AI Feedback</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-unisphere-darkBlue">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="john.doe@example.com" type="email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="(123) 456-7890" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="City, State" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-unisphere-darkBlue">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input id="institution" placeholder="University Name" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree</Label>
                        <Input id="degree" placeholder="Bachelor of Science" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field">Field of Study</Label>
                        <Input id="field" placeholder="Computer Science" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" placeholder="MM/YYYY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date (or Expected)</Label>
                        <Input id="endDate" placeholder="MM/YYYY" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="achievements">Achievements/Activities</Label>
                      <Textarea id="achievements" placeholder="Dean's List, Relevant Coursework, etc." rows={3} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Another Education
                    </Button>
                  </CardFooter>
                </Card>

                {/* Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-unisphere-darkBlue">Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Company Name" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" placeholder="Software Engineer" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="City, State" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDateJob">Start Date</Label>
                        <Input id="startDateJob" placeholder="MM/YYYY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDateJob">End Date (or Current)</Label>
                        <Input id="endDateJob" placeholder="MM/YYYY" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="• Developed and maintained web applications using React and TypeScript
• Collaborated with product managers to define product requirements
• Improved application performance by 30% through code optimization" 
                        rows={5} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Another Experience
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-8">
                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-unisphere-darkBlue">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.map(skill => (
                        <Badge key={skill} className="flex items-center gap-1 px-3 py-1.5 bg-unisphere-blue text-white">
                          {skill}
                          <XCircle 
                            className="h-4 w-4 cursor-pointer hover:text-red-200 ml-1" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <Button onClick={addSkill} type="button">Add</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-unisphere-darkBlue">Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input id="projectName" placeholder="E-commerce Website" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Description</Label>
                      <Textarea 
                        id="projectDescription" 
                        placeholder="• Built a responsive e-commerce website with React
• Implemented user authentication and shopping cart functionality
• Integrated payment processing with Stripe API"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="technologies">Technologies Used</Label>
                      <Input id="technologies" placeholder="React, Node.js, MongoDB" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectUrl">Project URL (Optional)</Label>
                      <Input id="projectUrl" placeholder="https://project.example.com" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Another Project
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-feedback">
            <div className="space-y-6">
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-unisphere-darkBlue">AI Resume Analysis</CardTitle>
                    <Badge className="bg-unisphere-blue text-white">Scan Complete</Badge>
                  </div>
                  <CardDescription>
                    Our AI has analyzed your resume and provides the following feedback:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded-md border">
                    <h3 className="font-medium text-unisphere-darkBlue mb-2">Overall Score</h3>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-unisphere-blue w-3/4"></div>
                      </div>
                      <span className="font-medium">75%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-unisphere-darkBlue">Detailed Feedback</h3>
                    {feedbackItems.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-3 rounded-md flex items-start ${
                          item.type === "improvement" 
                            ? "bg-amber-50 border border-amber-200" 
                            : "bg-green-50 border border-green-200"
                        }`}
                      >
                        {item.type === "improvement" ? (
                          <div className="mt-0.5 mr-3 text-amber-600">
                            <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                              <span className="text-xs">!</span>
                            </div>
                          </div>
                        ) : (
                          <Check className="h-5 w-5 mt-0.5 mr-3 text-green-600" />
                        )}
                        <p className={`text-sm ${
                          item.type === "improvement" ? "text-amber-800" : "text-green-800"
                        }`}>
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-md border">
                    <h3 className="font-medium text-unisphere-darkBlue mb-2">Keyword Analysis</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Based on the job market trends, consider adding these keywords to your resume:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-unisphere-blue/10 text-unisphere-blue border-unisphere-lightBlue">
                        Docker
                      </Badge>
                      <Badge variant="outline" className="bg-unisphere-blue/10 text-unisphere-blue border-unisphere-lightBlue">
                        AWS
                      </Badge>
                      <Badge variant="outline" className="bg-unisphere-blue/10 text-unisphere-blue border-unisphere-lightBlue">
                        CI/CD
                      </Badge>
                      <Badge variant="outline" className="bg-unisphere-blue/10 text-unisphere-blue border-unisphere-lightBlue">
                        Agile
                      </Badge>
                      <Badge variant="outline" className="bg-unisphere-blue/10 text-unisphere-blue border-unisphere-lightBlue">
                        Team Leadership
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                    Get Detailed Analysis
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardContent className="p-6">
                <div className="border rounded-lg p-8 overflow-auto max-h-[800px]">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-unisphere-darkBlue">John Doe</h1>
                    <p>San Francisco, CA • (123) 456-7890 • john.doe@example.com</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-unisphere-darkBlue">
                      EDUCATION
                    </h2>
                    <div className="mb-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Stanford University</span>
                        <span>Sep 2021 - Jun 2025 (Expected)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>B.S. Computer Science</span>
                        <span>GPA: 3.8/4.0</span>
                      </div>
                      <p className="text-sm">Relevant Coursework: Data Structures, Algorithms, Machine Learning, Web Development</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-unisphere-darkBlue">
                      EXPERIENCE
                    </h2>
                    <div className="mb-4">
                      <div className="flex justify-between">
                        <span className="font-semibold">TechCorp Inc.</span>
                        <span>Jun 2024 - Aug 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="italic">Software Engineer Intern</span>
                        <span>San Francisco, CA</span>
                      </div>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        <li>Developed and maintained web applications using React and TypeScript</li>
                        <li>Collaborated with product managers to define product requirements</li>
                        <li>Improved application performance by 30% through code optimization</li>
                        <li>Participated in daily standup meetings and sprint planning</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between">
                        <span className="font-semibold">University Research Lab</span>
                        <span>Jan 2023 - May 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="italic">Research Assistant</span>
                        <span>Stanford, CA</span>
                      </div>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        <li>Assisted in research on natural language processing algorithms</li>
                        <li>Implemented data collection and analysis tools using Python</li>
                        <li>Co-authored a paper presented at a student research conference</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-unisphere-darkBlue">
                      PROJECTS
                    </h2>
                    <div className="mb-2">
                      <span className="font-semibold">E-commerce Website</span>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        <li>Built a responsive e-commerce website with React</li>
                        <li>Implemented user authentication and shopping cart functionality</li>
                        <li>Integrated payment processing with Stripe API</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-unisphere-darkBlue">
                      SKILLS
                    </h2>
                    <p>
                      <span className="font-semibold">Programming:</span> Python, JavaScript, TypeScript, Java, C++
                    </p>
                    <p>
                      <span className="font-semibold">Web Development:</span> React, Node.js, HTML, CSS, Express
                    </p>
                    <p>
                      <span className="font-semibold">Tools:</span> Git, Docker, AWS, VS Code
                    </p>
                    <p>
                      <span className="font-semibold">Soft Skills:</span> Problem Solving, Communication, Teamwork
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-3">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Edit Resume
                </Button>
                <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Resume;
