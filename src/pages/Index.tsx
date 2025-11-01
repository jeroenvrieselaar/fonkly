import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-6 p-8 max-w-4xl">
        <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-teal-600 dark:from-blue-100 dark:to-teal-400 bg-clip-text text-transparent">
          Portfolio Analyzer
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Analyseer je beleggingsportefeuille op risicospreiding, sectoren, regio's en market cap
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          >
            Login
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
