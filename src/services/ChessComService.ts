import ChessWebAPI from 'chess-web-api';
import { Chess } from 'chess.js';

const chessAPI = new ChessWebAPI({ queue: true });

export interface Game {
    url: string;
    pgn: string;
    time_control: string;
    end_time: number;
    rated: boolean;
    fen: string;
    white: { username: string; rating: number };
    black: { username: string; rating: number };
    time_class: string;
}

interface BlunderAnalysis {
    position: string;
    move: string;
    evaluation: number;
}

export class ChessComService {
    static async getPlayerGames(username: string): Promise<Game[]> {
        try {
            const archives = await this.getPlayerArchives(username);
            
            // Get current date and date from a year ago
            const currentDate = new Date();
            const lastYear = new Date();
            lastYear.setFullYear(currentDate.getFullYear() - 1);
            
            // Filter archives to only include those from the last year
            const yearlyArchives = archives.filter(archive => {
                const components = archive.split('/');
                const archiveDate = new Date(
                    parseInt(components[components.length - 2]),
                    parseInt(components[components.length - 1]) - 1
                );
                return archiveDate >= lastYear;
            });

            console.log(`Fetching ${yearlyArchives.length} months of games...`);
            
            const games: Game[] = [];
            let completedArchives = 0;

            for (const archive of yearlyArchives) {
                const components = archive.split('/');
                const year = components[components.length - 2];
                const month = components[components.length - 1];
                
                try {
                    const response = await chessAPI.getPlayerCompleteMonthlyArchives(
                        username,
                        parseInt(year),
                        parseInt(month)
                    );
                    
                    if (response?.body?.games) {
                        games.push(...response.body.games);
                    }
                    
                    completedArchives++;
                    console.log(`Fetched games from ${year}/${month} (${completedArchives}/${yearlyArchives.length})`);
                } catch (error) {
                    console.error(`Error fetching games for ${year}/${month}:`, error);
                }
            }
            
            console.log(`Total games fetched: ${games.length}`);
            return games;
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    }

    private static async getPlayerArchives(username: string): Promise<string[]> {
        try {
            const response = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.archives;
        } catch (error) {
            console.error('Error fetching archives:', error);
            throw error;
        }
    }

    static async analyzeBlunders(games: Game[]): Promise<Array<{url: string, pgn: string, blunders: BlunderAnalysis[]}>> {
        console.log('Starting blunder analysis...');
        const results = games.map((game, index) => {
            const chess = new Chess();
            const blunders: BlunderAnalysis[] = [];
            
            try {
                chess.loadPgn(game.pgn);
                const history = chess.history({ verbose: true });
                
                let previousEval = 0;
                history.forEach((move, moveIndex) => {
                    const currentEval = this.evaluatePosition(chess);
                    const evalDiff = Math.abs(currentEval - previousEval);
                    
                    if (evalDiff >= 2) {
                        blunders.push({
                            position: chess.fen(),
                            move: `${Math.floor(moveIndex/2) + 1}${moveIndex % 2 === 0 ? '.' : '...'} ${move.san}`,
                            evaluation: evalDiff
                        });
                    }
                    
                    previousEval = currentEval;
                });
            } catch (error) {
                console.error('Error analyzing game:', error);
            }

            if ((index + 1) % 10 === 0) {
                console.log(`Analyzed ${index + 1}/${games.length} games`);
            }
            
            return {
                url: game.url,
                pgn: game.pgn,
                blunders
            };
        });

        console.log('Blunder analysis complete');
        return results;
    }

    private static evaluatePosition(chess: Chess): number {
        const pieceValues = {
            p: 1,
            n: 3,
            b: 3,
            r: 5,
            q: 9,
            k: 0
        };
        
        const fen = chess.fen();
        const position = fen.split(' ')[0];
        let evaluation = 0;
        
        for (const char of position) {
            if (char in pieceValues) {
                evaluation -= pieceValues[char as keyof typeof pieceValues];
            } else if (char.toLowerCase() in pieceValues) {
                evaluation += pieceValues[char.toLowerCase() as keyof typeof pieceValues];
            }
        }
        
        return evaluation;
    }
}