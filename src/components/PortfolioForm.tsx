import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface PortfolioFormProps {
  onSuccess: () => void;
}

export const PortfolioForm = ({ onSuccess }: PortfolioFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Fout",
          description: "Je moet ingelogd zijn",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("portfolios")
        .insert([{ name, description, user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Succes",
        description: "Portfolio toegevoegd",
      });
      
      setName("");
      setDescription("");
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
        <Label htmlFor="name">Portfolio Naam</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Mijn Portfolio"
        />
      </div>
      <div>
        <Label htmlFor="description">Beschrijving</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optionele beschrijving"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Toevoegen..." : "Portfolio Toevoegen"}
      </Button>
    </form>
  );
};
