export type Cell = {
    row: number;
    column: number;
    mineCount: number;
    isMine: boolean;
    isFlagged: boolean;
    isRevealed: boolean;
}
export type Grid = Cell[][];

export type GameStatus = {
    status: 'playing' | 'won' | 'lost';
}
