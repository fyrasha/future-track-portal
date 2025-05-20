
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-unisphere-darkBlue text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/lovable-uploads/fdfe74bd-5402-4868-80e2-8f40c49af094.png" alt="Unisphere Logo" className="h-12 mb-4" />
            <p className="text-sm text-gray-300 mt-2">
              Connecting students with opportunities and empowering career growth through technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Students</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-gray-300 hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link to="/resume" className="text-gray-300 hover:text-white transition-colors">Resume Builder</Link></li>
              <li><Link to="/recommendations" className="text-gray-300 hover:text-white transition-colors">Career Recommendations</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Employers</h3>
            <ul className="space-y-2">
              <li><Link to="/employer/register" className="text-gray-300 hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/employer/post-job" className="text-gray-300 hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/employer/talent" className="text-gray-300 hover:text-white transition-colors">Find Talent</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">support@unisphere.com</li>
              <li className="text-gray-300">1-800-UNISPHERE</li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Form</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {currentYear} Unisphere. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
