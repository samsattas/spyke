import { Player, GameConfig, Role } from "../types";

export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function assignRolesToPlayers(
  names: string[],
  config: GameConfig,
): Role[] {
  const roles: Role[] = [];
  
  // Add spies
  for (let i = 0; i < config.spyCount; i++) roles.push('spy');
  // Add impostors
  for (let i = 0; i < config.impostorCount; i++) roles.push('impostor');
  // Add innocents
  const innocentCount = config.totalPlayers - config.spyCount - config.impostorCount;
  for (let i = 0; i < innocentCount; i++) roles.push('innocent');

  return shuffleArray(roles);
}

export function checkWinCondition(players: Player[]): 'innocents' | 'spies' | 'impostor' | null {
  const activePlayers = players.filter(p => !p.isEliminated);
  const activeInnocents = activePlayers.filter(p => p.role === 'innocent');
  const activeSpies = activePlayers.filter(p => p.role === 'spy');
  const activeImpostors = activePlayers.filter(p => p.role === 'impostor');

  const totalActive = activePlayers.length;
  const totalBadGuys = activeSpies.length + activeImpostors.length;

  // Innocents win if no spies or impostors remain
  if (totalBadGuys === 0) return 'innocents';

  // Impostor wins if they are the last one standing
  if (activeImpostors.length > 0 && activeInnocents.length === 0 && activeSpies.length === 0) return 'impostor';

  // Spies win if they outnumber or equal innocents (impostors not counted for this specific rule, but let's follow the prompt)
  // "Spies win if they outnumber or equal innocents (impostors not counted), or if all innocents are eliminated."
  // "If only 1 innocent + 1 spy remain -> Spy wins"
  // "If only 1 innocent + 1 impostor remain -> Impostor wins"
  // "If only 1 spy + 1 impostor remain -> Impostor wins"
  // "If spies + impostors >= innocents -> Spies/Impostors win"

  if (activeInnocents.length === 0) {
      if (activeImpostors.length > 0) return 'impostor';
      return 'spies';
  }

  if (activeSpies.length + activeImpostors.length >= activeInnocents.length) {
      // If there are impostors, they might win if they are the last ones, 
      // but usually if spies and impostors together equal innocents, the bad guys win.
      // Let's refine based on the prompt's specific edge cases.
      
      if (activePlayers.length === 2) {
          if (activeInnocents.length === 1 && activeSpies.length === 1) return 'spies';
          if (activeInnocents.length === 1 && activeImpostors.length === 1) return 'impostor';
          if (activeSpies.length === 1 && activeImpostors.length === 1) return 'impostor';
      }
      
      // General case: if bad guys >= innocents, they win. 
      // If there are spies, spies win (as they are a team). If only impostors, impostor wins.
      if (activeSpies.length > 0) return 'spies';
      return 'impostor';
  }

  return null;
}

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
