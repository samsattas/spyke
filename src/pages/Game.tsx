import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from '../hooks/useGameState';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Users, Mic, UserMinus } from 'lucide-react';
import { Player } from '../types';
import { cn } from '../lib/utils';

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, eliminatePlayer, checkImpostorGuess } = useGameState();
  
  const [isVotingMode, setIsVotingMode] = useState(false);
  const [eliminationReveal, setEliminationReveal] = useState<{ player: Player; role: string } | null>(null);
  const [impostorGuessModal, setImpostorGuessModal] = useState<{ playerId: string } | null>(null);
  const [impostorGuess, setImpostorGuess] = useState('');
  const [guessFeedback, setGuessFeedback] = useState<'wrong' | null>(null);

  useEffect(() => {
    if (gameState.phase === 'setup') {
      navigate('/');
    } else if (gameState.phase === 'assign') {
      navigate('/assign');
    } else if (gameState.phase === 'result') {
      navigate('/result');
    }
  }, [gameState.phase, navigate]);

  const activePlayers = gameState.players.filter(p => !p.isEliminated);
  const currentPlayer = gameState.players[gameState.currentTurnIndex];

  // Calculate turn order starting from currentTurnIndex
  const getTurnOrder = () => {
    const order: Player[] = [];
    const total = gameState.players.length;
    for (let i = 0; i < total; i++) {
      const idx = (gameState.currentTurnIndex + i) % total;
      const player = gameState.players[idx];
      if (!player.isEliminated) {
        order.push(player);
      }
    }
    return order;
  };

  const turnOrder = getTurnOrder();

  const handleEliminate = (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId)!;
    setIsVotingMode(false);
    
    // Show reveal animation
    setEliminationReveal({ 
      player, 
      role: player.role === 'innocent' ? 'INOCENTE' : player.role === 'spy' ? 'ESPÍA' : 'IMPOSTOR' 
    });

    setTimeout(() => {
      setEliminationReveal(null);
      
      if (player.role === 'impostor') {
        setImpostorGuessModal({ playerId: player.id });
      } else {
        eliminatePlayer(player.id);
      }
    }, 3000);
  };

  const handleImpostorGuess = () => {
    const isCorrect = checkImpostorGuess(impostorGuess);
    if (!isCorrect) {
      setGuessFeedback('wrong');
      setTimeout(() => {
        setGuessFeedback(null);
        setImpostorGuessModal(null);
        setImpostorGuess('');
        eliminatePlayer(impostorGuessModal!.playerId);
      }, 2000);
    }
  };

  if (!currentPlayer) return null;

  return (
    <div className="min-h-screen p-6 bg-background flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full max-w-4xl flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-black text-accent-purple uppercase tracking-tighter">Ronda {gameState.roundNumber}</h2>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-1">
            <Users className="w-4 h-4" /> {activePlayers.length} Vivos
          </div>
        </div>
      </div>

      {/* Current Turn Banner */}
      {!isVotingMode && (
        <motion.div
          key={currentPlayer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-accent-purple/10 border border-accent-purple/30 rounded-3xl p-8 text-center mb-12 shadow-[0_0_50px_rgba(147,51,234,0.1)]"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mic className="w-6 h-6 text-accent-purple animate-pulse" />
            <span className="text-xs font-bold text-accent-purple uppercase tracking-[0.3em]">Empieza</span>
          </div>
          <h3 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase break-words tracking-tighter">{currentPlayer.name}</h3>
          <p className="text-white/40 text-sm italic">Describe tu palabra sin decirla directamente.</p>
        </motion.div>
      )}

      {/* Turn Order List */}
      <div className="w-full max-w-md space-y-3 mb-24">
        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 text-center">Orden de Turno</h4>
        <AnimatePresence mode="popLayout">
          {turnOrder.map((p, idx) => (
            <motion.div
              layout
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                idx === 0 && !isVotingMode ? "bg-accent-purple text-white border-accent-purple shadow-lg shadow-accent-purple/20" : "bg-card border-white/5 text-white/60"
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black opacity-30">0{idx + 1}</span>
                <span className="font-bold uppercase tracking-tight">{p.name}</span>
              </div>
              
              {isVotingMode ? (
                <Button
                  size="sm"
                  variant="destructive"
                  className="rounded-full px-4 font-black text-[10px] uppercase"
                  onClick={() => handleEliminate(p.id)}
                >
                  Sacar
                </Button>
              ) : (
                idx === 0 && <Mic className="w-4 h-4" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-12 left-0 right-0 px-6 flex justify-center gap-4">
        {!isVotingMode ? (
          <Button
            size="lg"
            className="w-full max-w-xs bg-white text-black hover:bg-white/90 font-black text-xl py-8 rounded-2xl shadow-2xl"
            onClick={() => setIsVotingMode(true)}
          >
            <UserMinus className="mr-2" /> IR A VOTOS
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            className="w-full max-w-xs border-white/10 text-white/60 font-black text-xl py-8 rounded-2xl"
            onClick={() => setIsVotingMode(false)}
          >
            CANCELAR
          </Button>
        )}
      </div>

      {/* Elimination Reveal Overlay */}
      <AnimatePresence>
        {eliminationReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <h2 className="text-4xl font-bold text-white/60 mb-4 uppercase">{eliminationReveal.player.name} ERA...</h2>
              <div className={cn(
                "text-6xl md:text-8xl font-black tracking-tighter mb-8",
                eliminationReveal.player.role === 'innocent' ? 'text-role-innocent' :
                eliminationReveal.player.role === 'spy' ? 'text-role-spy' : 'text-role-impostor'
              )}>
                {eliminationReveal.role}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impostor Guess Modal */}
      <Dialog open={!!impostorGuessModal} onOpenChange={() => {}}>
        <DialogContent className={cn(
          "bg-background border-role-impostor/50 text-white max-w-lg w-full",
          guessFeedback === 'wrong' && "animate-shake"
        )}>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-role-impostor text-center">¡ÚLTIMA OPORTUNIDAD!</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center space-y-6">
            <p className="text-white/60">El impostor ha sido descubierto, pero puede ganar si adivina la palabra secreta.</p>
            <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs opacity-50">¿Cuál es la palabra?</Label>
              <Input
                className="text-center text-2xl font-bold h-16 bg-card border-white/10 focus:border-role-impostor"
                placeholder="..."
                value={impostorGuess}
                onChange={(e) => setImpostorGuess(e.target.value)}
                autoFocus
              />
            </div>
            {guessFeedback === 'wrong' && (
              <p className="text-role-impostor font-black text-xl">❌ ¡INCORRECTO! La partida continúa...</p>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-role-impostor hover:bg-role-impostor/80 text-white font-black py-6 text-xl"
              onClick={handleImpostorGuess}
              disabled={!impostorGuess.trim() || !!guessFeedback}
            >
              ENVIAR RESPUESTA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
