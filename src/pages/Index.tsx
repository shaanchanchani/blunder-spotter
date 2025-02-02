import { useEffect, useState } from "react";
import { AnalysisBoard } from "../components/AnalysisBoard";
import { AnalysisPanel } from "../components/AnalysisPanel";
import { PremiumBanner } from "../components/PremiumBanner";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChessComService } from "../services/ChessComService";

export default function Index() {
  const [username, setUsername] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [currentPosition, setCurrentPosition] = useState("start");
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter a Chess.com username",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Analysis Started",
      description: "Fetching games from Chess.com...",
    });

    try {
      const games = await ChessComService.getPlayerGames(username);
      const results = await ChessComService.analyzeBlunders(games);
      console.log("Analysis results:", results);
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${games.length} games`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze games",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden shadow-xl bg-card p-4">
              <AnalysisBoard 
                fen={currentPosition}
                onMove={(move) => console.log("Move made:", move)}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="rounded-lg bg-card p-4 shadow-xl mb-4">
                <h2 className="text-xl font-bold mb-4">Analysis Controls</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Chess.com Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-2 rounded bg-secondary text-foreground"
                    />
                  </div>
                  <Button 
                    onClick={handleAnalyze}
                    className="w-full"
                  >
                    Analyze Games
                  </Button>
                </div>
              </div>

              <AnalysisPanel isPremium={isPremium} />
              
              {!isPremium && <PremiumBanner />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}