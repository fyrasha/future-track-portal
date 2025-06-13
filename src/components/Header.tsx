import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, LayoutDashboard, Calendar, Briefcase, FileText, Users, BarChart3, CalendarDays, EllipsisVertical, Building } from 'lucide-react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName') || '';
      setIsLoggedIn(loggedIn);
      setUserRole(role);
      setUserName(name);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-950 border-blue-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/c1fefc4a-0150-49c5-b734-f2588b1e8d79.png" alt="UniSphere Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-white">UniSphere</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              {userRole === 'student' && (
                <>
                  <Link to="/dashboard" className="text-gray-200 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/jobs" className="text-gray-200 hover:text-white transition-colors">
                    Jobs
                  </Link>
                  <Link to="/events" className="text-gray-200 hover:text-white transition-colors">
                    Events
                  </Link>
                  <Link to="/calendar" className="text-gray-200 hover:text-white transition-colors">
                    Calendar
                  </Link>
                  <Link to="/resume" className="text-gray-200 hover:text-white transition-colors">
                    Resume
                  </Link>
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-200 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/admin/jobs" className="text-gray-200 hover:text-white transition-colors">
                    Job Management
                  </Link>
                  <Link to="/admin/employers" className="text-gray-200 hover:text-white transition-colors">
                    Employer Review
                  </Link>
                  <Link to="/admin/events" className="text-gray-200 hover:text-white transition-colors">
                    Events
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/jobs" className="text-gray-200 hover:text-white transition-colors">
                Jobs
              </Link>
              <Link to="/events" className="text-gray-200 hover:text-white transition-colors">
                Events
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-blue-800">
                  <EllipsisVertical className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground capitalize">
                      {userRole}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                
                {userRole === 'student' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/jobs" className="cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Jobs
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/applications" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        Applications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/calendar" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Calendar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/recommendations" className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        Recommendations
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {userRole === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/jobs" className="cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Job Management
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/employers" className="cursor-pointer">
                        <Building className="mr-2 h-4 w-4" />
                        Employer Review
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/events" className="cursor-pointer">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Event Management
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="text-white hover:bg-blue-800 hover:text-white" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-white text-blue-900 hover:bg-gray-100" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
