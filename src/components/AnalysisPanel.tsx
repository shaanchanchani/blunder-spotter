import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisPanelProps {
  isPremium: boolean;
}

export function AnalysisPanel({ isPremium }: AnalysisPanelProps) {
  const commonBlunders = [
    { position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", move: "e4", frequency: 10 },
    { position: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", move: "e5", frequency: 8 },
    { position: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", move: "Nf3", frequency: 6 },
  ];

  return (
    <Card className="p-4 analysis-panel">
      <h2 className="text-xl font-bold mb-4">Common Blunders</h2>
      
      <div className="space-y-4">
        {commonBlunders.slice(0, isPremium ? undefined : 1).map((blunder, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg bg-secondary ${
              !isPremium && index > 0 ? "premium-blur" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="chess-move">
                {blunder.move}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {blunder.frequency} occurrences
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Position: {blunder.position.slice(0, 20)}...
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}