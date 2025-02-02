import { Chessboard } from "react-chessboard";
import { Card } from "@/components/ui/card";

interface AnalysisBoardProps {
  fen: string;
  onMove?: (move: { from: string; to: string }) => void;
}

export function AnalysisBoard({ fen, onMove }: AnalysisBoardProps) {
  return (
    <Card className="p-4 bg-card">
      <div className="aspect-square">
        <Chessboard 
          position={fen}
          onPieceDrop={(source: string, target: string) => {
            onMove?.({ from: source, to: target });
            return true;
          }}
          customBoardStyle={{
            borderRadius: "0.5rem",
          }}
          customDarkSquareStyle={{ backgroundColor: "#4a5568" }}
          customLightSquareStyle={{ backgroundColor: "#718096" }}
        />
      </div>
    </Card>
  );
}