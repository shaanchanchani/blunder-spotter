import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlunderAnalysis {
  position: string;
  move: string;
  evaluation: number;
  frequency: number;
}

interface AnalysisPanelProps {
  isPremium: boolean;
  blunders?: BlunderAnalysis[];
  onPositionSelect?: (position: string) => void;
}

export function AnalysisPanel({ isPremium, blunders = [], onPositionSelect }: AnalysisPanelProps) {
  return (
    <Card className="p-4 analysis-panel">
      <h2 className="text-xl font-bold mb-4">Common Blunders</h2>
      
      <div className="space-y-4">
        {blunders.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No analysis results yet. Enter a username and click "Analyze Games" to start.
          </div>
        ) : (
          blunders.slice(0, isPremium ? undefined : 1).map((blunder, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors ${
                !isPremium && index > 0 ? "premium-blur" : ""
              }`}
              onClick={() => onPositionSelect?.(blunder.position)}
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
              <div className="text-sm text-muted-foreground mt-1">
                Evaluation change: {blunder.evaluation.toFixed(1)}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}