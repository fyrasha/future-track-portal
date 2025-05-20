
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
                  <Link to="/calendar" className="px-4 py-3 text-unisphere-darkBlue hover:bg-gray-100">
                    Calendar
                  </Link>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link to="/login" className="px-4 py-3 text-unisphere-blue hover:bg-gray-100 block">
                      Login
                    </Link>
                    <Link to="/signup" className="px-4 py-3 text-unisphere-blue hover:bg-gray-100 block">
                      Sign Up
                    </Link>
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
              <Link to="/calendar" className="text-unisphere-darkBlue hover:text-unisphere-blue transition-colors">
                Calendar
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
