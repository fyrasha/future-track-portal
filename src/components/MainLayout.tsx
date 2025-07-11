
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default MainLayout;
