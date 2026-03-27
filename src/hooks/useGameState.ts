import { useState, useEffect, useCallback } from 'react';
import { GameState, GameConfig, Player, Role } from '../types';
import { wordPairs } from '../data/wordPairs';
import { shuffleArray, assignRolesToPlayers, checkWinCondition, normalizeString } from '../utils/gameLogic';

const STORAGE_KEY = 'spyke_game_state';

const initialState: GameState = {
  config: { totalPlayers: 3, spyCount: 1, impostorCount: 0 },
  players: [],
  teamWord: '',
  spyWord: '',
  category: '',
  currentTurnIndex: 0,
  startingPlayerIndex: 0,
  phase: 'setup',
  winner: null,
  roundNumber: 1,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const initGame = useCallback((config: GameConfig, playerNames: string[]) => {
    const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    const roles = assignRolesToPlayers(playerNames, config);
    
    const players: Player[] = playerNames.map((name, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      role: roles[index],
      isEliminated: false,
    }));

    const startingPlayerIndex = Math.floor(Math.random() * players.length);

    setGameState({
      config,
      players,
      teamWord: randomPair.teamWord,
      spyWord: randomPair.spyWord,
      category: randomPair.category,
      currentTurnIndex: startingPlayerIndex,
      startingPlayerIndex,
      phase: 'assign',
      winner: null,
      roundNumber: 1,
    });
  }, []);

  const startPlaying = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'playing' }));
  }, []);

  const eliminatePlayer = useCallback((playerId: string) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(p => 
        p.id === playerId ? { ...p, isEliminated: true } : p
      );
      
      const winner = checkWinCondition(updatedPlayers);
      
      // If winner is found, change phase
      if (winner) {
        return {
          ...prev,
          players: updatedPlayers,
          winner,
          phase: 'result'
        };
      }

      // Pick a new random starting player from the remaining ones
      const activePlayers = updatedPlayers.filter(p => !p.isEliminated);
      const randomActivePlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)];
      const nextIndex = updatedPlayers.findIndex(p => p.id === randomActivePlayer.id);

      return {
        ...prev,
        players: updatedPlayers,
        currentTurnIndex: nextIndex,
        roundNumber: prev.roundNumber + 1
      };
    });
  }, []);

  const checkImpostorGuess = useCallback((guess: string) => {
    const normalizedGuess = normalizeString(guess);
    const normalizedTarget = normalizeString(gameState.teamWord);
    
    if (normalizedGuess === normalizedTarget) {
      setGameState(prev => ({ ...prev, winner: 'impostor', phase: 'result' }));
      return true;
    }
    return false;
  }, [gameState.teamWord]);

  const restartWithSamePlayers = useCallback(() => {
    setGameState(prev => {
      const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
      const playerNames = prev.players.map(p => p.name);
      const roles = assignRolesToPlayers(playerNames, prev.config);
      
      const players: Player[] = playerNames.map((name, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        name,
        role: roles[index],
        isEliminated: false,
      }));

      const startingPlayerIndex = Math.floor(Math.random() * players.length);

      return {
        ...prev,
        players,
        teamWord: randomPair.teamWord,
        spyWord: randomPair.spyWord,
        category: randomPair.category,
        currentTurnIndex: startingPlayerIndex,
        startingPlayerIndex,
        phase: 'assign',
        winner: null,
        roundNumber: 1,
      };
    });
  }, []);

  const resetToSetup = useCallback(() => {
    setGameState(initialState);
  }, []);

  return {
    gameState,
    initGame,
    startPlaying,
    eliminatePlayer,
    checkImpostorGuess,
    restartWithSamePlayers,
    resetToSetup,
  };
}
