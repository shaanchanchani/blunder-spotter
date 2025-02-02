import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function PremiumBanner() {
  return (
    <Card className="p-6 mt-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
      <div className="flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-center mb-2">
        Upgrade to Premium
      </h3>
      <p className="text-sm text-center text-muted-foreground mb-4">
        Get access to all your common blunders and detailed analysis
      </p>
      <Button className="w-full" variant="default">
        Upgrade Now
      </Button>
    </Card>
  );
}