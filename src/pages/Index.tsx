
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100">
          <ClipboardList className="h-10 w-10 text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-slate-800">Aviation Incident Reporting System</h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Streamline your incident documentation process with our AI-powered reporting system.
          Create, manage, and review aviation incidents with ease.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/create-incident')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create New Incident
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            View All Incidents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
