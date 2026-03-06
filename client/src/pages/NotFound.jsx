import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => { document.title = "Not Found"; }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center max-w-md">
        
        <div className="bg-primary/10 p-6 rounded-full mb-6 border border-primary/20 shadow-inner">
          <FileQuestion size={64} className="text-primary" />
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground mb-4 tracking-tighter drop-shadow-sm">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Page not found
        </h2>
        
        <p className="text-muted-foreground mb-10 text-base md:text-lg px-4">
          Oops! The presentation or page you are looking for doesn't exist, has been deleted, or was moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-8 sm:px-0">
          <Button 
            variant="outline" 
            size="lg" 
            className="gap-2 w-full sm:w-auto font-semibold"
            onClick={() => navigate(-1)} 
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>
          
          <Link to="/" className="w-full sm:w-auto">
            <Button size="lg" className="gap-2 w-full font-semibold shadow-lg">
              <Home size={18} />
              Back to Dashboard
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;