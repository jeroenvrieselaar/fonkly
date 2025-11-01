import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        navigate('/auth');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-teal-600 dark:from-blue-100 dark:to-teal-400 bg-clip-text text-transparent">
            Portfolio Analyzer
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Uitloggen
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welkom bij Portfolio Analyzer</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Hier kun je straks je portefeuille analyseren op risicospreiding, sectoren, regio's en market cap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Regio's</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-slate-500">Portfolio's</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Sectoren</h3>
              <p className="text-3xl font-bold text-teal-600">0</p>
              <p className="text-sm text-slate-500">Spreiding</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Market Cap</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-slate-500">Analyse</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Risk Profile</h3>
              <p className="text-3xl font-bold text-orange-600">0</p>
              <p className="text-sm text-slate-500">Beoordeling</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
