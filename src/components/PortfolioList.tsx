import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HoldingForm } from "./HoldingForm";
import { toast } from "@/components/ui/use-toast";

interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface Holding {
  id: string;
  ticker: string;
  shares: number;
  average_price: number;
}

export const PortfolioList = ({ refresh }: { refresh: number }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [holdings, setHoldings] = useState<Record<string, Holding[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const { data: portfoliosData, error: portfoliosError } = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false });

      if (portfoliosError) throw portfoliosError;

      setPortfolios(portfoliosData || []);

      // Fetch holdings for each portfolio
      if (portfoliosData && portfoliosData.length > 0) {
        const holdingsData: Record<string, Holding[]> = {};
        
        for (const portfolio of portfoliosData) {
          const { data, error } = await supabase
            .from("holdings")
            .select("*")
            .eq("portfolio_id", portfolio.id);

          if (!error && data) {
            holdingsData[portfolio.id] = data;
          }
        }
        
        setHoldings(holdingsData);
      }
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading) {
    return <p>Laden...</p>;
  }

  if (portfolios.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Nog geen portfolio's. Voeg er een toe!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {portfolios.map((portfolio) => (
        <Card key={portfolio.id}>
          <CardHeader>
            <CardTitle>{portfolio.name}</CardTitle>
            {portfolio.description && (
              <CardDescription>{portfolio.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Holdings:</h4>
                {holdings[portfolio.id]?.length > 0 ? (
                  <div className="space-y-2">
                    {holdings[portfolio.id].map((holding) => (
                      <div
                        key={holding.id}
                        className="flex justify-between items-center p-2 bg-muted rounded"
                      >
                        <span className="font-medium">{holding.ticker}</span>
                        <span className="text-sm text-muted-foreground">
                          {holding.shares} @ €{holding.average_price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Geen holdings</p>
                )}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedPortfolio(portfolio.id)}>
                    Holding Toevoegen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Holding Toevoegen aan {portfolio.name}</DialogTitle>
                  </DialogHeader>
                  <HoldingForm
                    portfolioId={portfolio.id}
                    onSuccess={() => {
                      fetchData();
                      setSelectedPortfolio(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
