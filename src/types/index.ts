export type Role = 'innocent' | 'spy' | 'impostor';

export interface Player {
  id: string;
  name: string;
  role: Role;
  isEliminated: boolean;
}

export interface GameConfig {
  totalPlayers: number;
  spyCount: number;
  impostorCount: number;
}

export interface GameState {
  config: GameConfig;
  players: Player[];
  teamWord: string;
  spyWord: string;
  category: string;
  currentTurnIndex: number;
  startingPlayerIndex: number;
  phase: 'setup' | 'assign' | 'playing' | 'result';
  winner: 'innocents' | 'spies' | 'impostor' | null;
  roundNumber: number;
}
