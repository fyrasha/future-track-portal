
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import Chatbot from './Chatbot';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(loggedIn);
      setUserRole(role);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/fdfe74bd-5402-4868-80e2-8f40c49af094.png" alt="UniSphere Logo" className="h-10" />
          <span className="text-unisphere-darkBlue font-bold text-xl ml-2">UniSphere</span>
        </Link>

        {isMobile ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>

            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white shadow-md z-50 animate-fade-in">
                <nav className="flex flex-col py-4">
                  <Link to="/" className="px-4 py-3 text-unisphere-darkBlue hover:bg-gray-100">
                    Home
                  </Link>
                  <Link to="/jobs" className="px-4 py-3 text-unisphere-darkBlue hover:bg-gray-100">
                    Jobs
                  </Link>
                  <Link to="/resume" className="px-4 py-3 text-unisphere-darkBlue hover:bg-gray-100">
                    Resume Builder
                  </Link>
                  <Link to="/calendar" className="px-4 py-3 text-unisphere-darkBlue hover:bg-gray-100">
                    Calendar
                  </Link>
                  {isLoggedIn && userRole === 'student' && (
                    <>
                      <Link to="/applications" className="px-4 py-3 text-unisphere-darkBlue hover:bg-gray-100">
                        Applications
                      </Link>
                      <Link to="/recommendations" className="px-4 py-3 text-unisphere-darkBlue hover:bg-gray-100">
                        Recommendations
                      </Link>
                    </>
                  )}
                  {isLoggedIn && userRole === 'admin' && (
                    <Link to="/admin/dashboard" className="px-4 py-3 text-unisphere-darkBlue hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    {isLoggedIn ? (
                      <div className="px-4 py-3">
                        <div className="flex items-center text-unisphere-darkBlue mb-2">
                          <User className="h-4 w-4 mr-2" />
                          <span className="capitalize">{userRole}</span>
                        </div>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Link to="/login" className="px-4 py-3 text-unisphere-blue hover:bg-gray-100 block">
                          Login
                        </Link>
                        <Link to="/signup" className="px-4 py-3 text-unisphere-blue hover:bg-gray-100 block">
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-8">
            <nav className="flex space-x-6">
              <Link to="/" className="text-unisphere-darkBlue hover:text-unisphere-blue transition-colors">
                Home
              </Link>
              <Link to="/jobs" className="text-unisphere-darkBlue hover:text-unisphere-blue transition-colors">
                Jobs
              </Link>
              <Link to="/resume" className="text-unisphere-darkBlue hover:text-unisphere-blue transition-colors">
                Resume Builder
              </Link>
              <Link to="/calendar" className="text-unisphere-darkBlue hover:text-unisphere-blue transition-colors">
                Calendar
              </Link>
              {isLoggedIn && userRole === 'student' && (
                <>
                  <Link to="/applications" className="text-unisphere-darkBlue hover:text-unisphere-blue transition-colors">
                    Applications
                  </Link>
                  <Link to="/recommendations" className="text-unisphere-darkBlue hover:text-unisphere-blue transition-colors">
                    Recommendations
                  </Link>
                </>
              )}
              {isLoggedIn && userRole === 'admin' && (
                <Link to="/admin/dashboard" className="text-unisphere-darkBlue hover:text-unisphere-blue transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-unisphere-darkBlue">
                    <User className="h-4 w-4 mr-1" />
                    <span className="capitalize text-sm">{userRole}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="border-unisphere-blue text-unisphere-blue hover:bg-unisphere-blue/10">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-unisphere-blue hover:bg-unisphere-darkBlue text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Chatbot />
    </header>
  );
};

export default Header;
