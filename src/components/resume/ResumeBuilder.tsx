import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  location?: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string;
}

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    location: ""
  });

  const [education, setEducation] = useState<Education[]>([
    { institution: "", degree: "", field: "", startDate: "", endDate: "" }
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { company: "", position: "", startDate: "", endDate: "", description: "" }
  ]);

  const [skills, setSkills] = useState<string>("");

  const [projects, setProjects] = useState<Project[]>([
    { name: "", description: "", technologies: "" }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const addEducation = () => {
    setEducation([...education, { institution: "", degree: "", field: "", startDate: "", endDate: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience([...experience, { company: "", position: "", startDate: "", endDate: "", description: "" }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects([...projects, { name: "", description: "", technologies: "" }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save a resume",
          variant: "destructive"
        });
        return;
      }

      const resumeData = {
        userId: user.uid,
        personalInfo,
        education: education.filter(edu => edu.institution || edu.degree),
        experience: experience.filter(exp => exp.company || exp.position),
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        projects: projects.filter(proj => proj.name),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, "resumes"), resumeData);

      toast({
        title: "Success",
        description: "Your resume has been saved successfully"
      });
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                placeholder="+60 12-345 6789"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={personalInfo.linkedin}
                onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={personalInfo.location}
                onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                placeholder="Kuala Lumpur, Malaysia"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>Your educational background</CardDescription>
            </div>
            <Button onClick={addEducation} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="border rounded-lg p-4 relative">
              {education.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].institution = e.target.value;
                      setEducation(newEducation);
                    }}
                    placeholder="University of Malaya"
                  />
                </div>
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].degree = e.target.value;
                      setEducation(newEducation);
                    }}
                    placeholder="Bachelor's"
                  />
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].field = e.target.value;
                      setEducation(newEducation);
                    }}
                    placeholder="Computer Science"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].startDate = e.target.value;
                        setEducation(newEducation);
                      }}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].endDate = e.target.value;
                        setEducation(newEducation);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Your professional experience</CardDescription>
            </div>
            <Button onClick={addExperience} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index} className="border rounded-lg p-4 relative">
              {experience.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].company = e.target.value;
                        setExperience(newExperience);
                      }}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].position = e.target.value;
                        setExperience(newExperience);
                      }}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => {
                          const newExperience = [...experience];
                          newExperience[index].startDate = e.target.value;
                          setExperience(newExperience);
                        }}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => {
                          const newExperience = [...experience];
                          newExperience[index].endDate = e.target.value;
                          setExperience(newExperience);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = [...experience];
                      newExperience[index].description = e.target.value;
                      setExperience(newExperience);
                    }}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>List your technical and soft skills (comma-separated)</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Node.js, Communication, Team Leadership..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Showcase your personal or academic projects</CardDescription>
            </div>
            <Button onClick={addProject} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.map((proj, index) => (
            <div key={index} className="border rounded-lg p-4 relative">
              {projects.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeProject(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
              <div className="space-y-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index].name = e.target.value;
                      setProjects(newProjects);
                    }}
                    placeholder="E-commerce Platform"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={proj.description}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index].description = e.target.value;
                      setProjects(newProjects);
                    }}
                    placeholder="Brief description of the project..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Technologies Used</Label>
                  <Input
                    value={proj.technologies}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index].technologies = e.target.value;
                      setProjects(newProjects);
                    }}
                    placeholder="React, Firebase, Tailwind CSS"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-unisphere-darkBlue hover:bg-unisphere-blue text-white"
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Resume"}
        </Button>
      </div>
    </div>
  );
};

export default ResumeBuilder;
