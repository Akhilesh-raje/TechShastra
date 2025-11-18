import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already subscribed",
          description: "This email is already on our mailing list.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to subscribe. Please try again.",
        });
      }
    } else {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Stay in the Loop</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Subscribe to our newsletter for updates on events, projects, and opportunities
        </p>
        <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;