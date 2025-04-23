export type Player = 'black' | 'white';

export type Direction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right';

// Axial coordinates for hex grid
export interface Cell {
  readonly q: number;  // axial column
  readonly r: number;  // axial row
}

// Board indexed by cell key "q,r"
export type Board = Record<string, Player | null>;

export type GameStatus =
  | 'ONGOING'
  | 'WIN_BLACK'
  | 'WIN_WHITE'
  | 'DRAW';

export interface Move {
  readonly player: Player;          // the player making the move
  readonly from: readonly Cell[];   // 1 to 3 marbles' starting cells
  readonly direction: Direction;    // direction of movement
}

export interface GameState {
  readonly board: Board;                                       // current layout of marbles
  readonly currentPlayer: Player;                              // who has the turn
  readonly captured: Readonly<Record<Player, number>>;         // marbles captured by each player
  readonly status: GameStatus;                                 // current game status
  readonly turn: number;                                        // turn counter
  readonly history: readonly Move[];                            // list of all moves played
}
