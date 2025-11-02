import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface HoldingFormProps {
  portfolioId: string;
  onSuccess: () => void;
}

export const HoldingForm = ({ portfolioId, onSuccess }: HoldingFormProps) => {
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [averagePrice, setAveragePrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("holdings")
        .insert([{
          portfolio_id: portfolioId,
          ticker: ticker.toUpperCase(),
          shares: parseFloat(shares),
          average_price: parseFloat(averagePrice),
        }]);

      if (error) throw error;

      toast({
        title: "Succes",
        description: "Holding toegevoegd",
      });
      
      setTicker("");
      setShares("");
      setAveragePrice("");
      onSuccess();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="ticker">Ticker Symbol</Label>
        <Input
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          required
          placeholder="AAPL"
        />
      </div>
      <div>
        <Label htmlFor="shares">Aantal Aandelen</Label>
        <Input
          id="shares"
          type="number"
          step="0.001"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          required
          placeholder="10"
        />
      </div>
      <div>
        <Label htmlFor="price">Gemiddelde Prijs</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={averagePrice}
          onChange={(e) => setAveragePrice(e.target.value)}
          required
          placeholder="150.00"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Toevoegen..." : "Holding Toevoegen"}
      </Button>
    </form>
  );
};
