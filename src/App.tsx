
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import Jobs from "./pages/Jobs";
import Resume from "./pages/Resume";
import Calendar from "./pages/Calendar";
import Events from "./pages/Events";
import AIResumeScreen from "./pages/AIResumeScreen";
import Applications from "./pages/Applications";
import Recommendations from "./pages/Recommendations";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import Profile from "./pages/Profile";
import StudentDashboard from "./pages/StudentDashboard";
import EventManagement from "./pages/EventManagement";
import CompanyDetails from "./pages/CompanyDetails";
import NotFound from "./pages/NotFound";
import AdminJobManagement from "./pages/AdminJobManagement";
import AdminEmployerReview from "./pages/AdminEmployerReview";
import EmployerPostJob from "./pages/EmployerPostJob";
import StudentSubmitEvent from "./pages/StudentSubmitEvent";
import CareerPathDetails from "./pages/CareerPathDetails";
import JobDetails from "./pages/JobDetails";

// Create a client outside of the component
const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-recover" element={<AdminForgotPassword />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/jobs" element={<AdminJobManagement />} />
            <Route path="/admin/employers" element={<AdminEmployerReview />} />
            <Route path="/admin/events" element={<EventManagement />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/career-path" element={<CareerPathDetails />} />
            <Route path="/company/:id" element={<CompanyDetails />} />
            <Route path="/employer/post-job" element={<EmployerPostJob />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/events" element={<Events />} />
            <Route path="/student/submit-event" element={<StudentSubmitEvent />} />
            <Route path="/ai-resume-screen" element={<AIResumeScreen />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
