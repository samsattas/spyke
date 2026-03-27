import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from '../hooks/useGameState';
import { RoleCard } from '../components/RoleCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Play, User, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { Role } from '../types';

export const Assign: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, startPlaying } = useGameState();
  const [players, setPlayers] = useState(gameState.players);
  const [doneIndices, setDoneIndices] = useState<Set<number>>(new Set());
  
  // Modal state
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');
  const [isWordRevealed, setIsWordRevealed] = useState(false);

  useEffect(() => {
    if (gameState.phase === 'setup') {
      navigate('/');
    } else if (gameState.phase === 'playing') {
      navigate('/game');
    } else if (gameState.phase === 'result') {
      navigate('/result');
    }
  }, [gameState.phase, navigate]);

  const handleOpenModal = (index: number) => {
    setActiveModalIndex(index);
    setTempName(players[index].name || '');
    setIsWordRevealed(false);
  };

  const handleConfirmName = () => {
    if (!tempName.trim()) return;
    setIsWordRevealed(true);
  };

  const handleFinishAssignment = () => {
    if (activeModalIndex === null) return;
    
    const newPlayers = [...players];
    newPlayers[activeModalIndex] = { ...newPlayers[activeModalIndex], name: tempName };
    setPlayers(newPlayers);
    
    // Update global state
    gameState.players[activeModalIndex].name = tempName;
    
    setDoneIndices(prev => new Set(prev).add(activeModalIndex));
    setActiveModalIndex(null);
  };

  const allDone = doneIndices.size === players.length;

  const handleBegin = () => {
    startPlaying();
    navigate('/game');
  };

  const getRoleText = (role: Role) => {
    switch (role) {
      case 'innocent': return `🟢 Tu palabra es: ${gameState.teamWord.toUpperCase()}`;
      case 'spy': return `🟢 Tu palabra es: ${gameState.spyWord.toUpperCase()}`;
      case 'impostor': return `🔴 Eres el IMPOSTOR. No tienes palabra. Escucha con atención y dedúcela.`;
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'innocent': 
      case 'spy': return 'text-role-innocent';
      case 'impostor': return 'text-role-impostor';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-5xl font-black text-accent-purple mb-2 tracking-tighter uppercase">Asignación</h2>
        <p className="text-white/40 text-sm">Cada jugador debe tocar un recuadro para descubrir su rol.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl w-full mb-24">
        {players.map((player, index) => (
          <RoleCard
            key={player.id}
            player={player}
            isDone={doneIndices.has(index)}
            onClick={() => handleOpenModal(index)}
          />
        ))}
      </div>

      {/* Modal for Name and Role Reveal */}
      <Dialog open={activeModalIndex !== null} onOpenChange={(open) => !open && setActiveModalIndex(null)}>
        <DialogContent className="bg-card border-accent-purple/20 text-white max-w-sm w-[90vw] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-accent-purple text-center uppercase">
              {isWordRevealed ? "TU ROL SECRETO" : "IDENTIFÍCATE"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            {!isWordRevealed ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent-purple/10 flex items-center justify-center border-2 border-accent-purple/20">
                    <User className="w-10 h-10 text-accent-purple" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px] opacity-50 font-bold">¿Cuál es tu nombre?</Label>
                  <Input
                    placeholder="Escribe aquí..."
                    className="bg-background border-white/10 h-12 text-center font-bold text-lg focus:border-accent-purple"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            ) : activeModalIndex !== null ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className={cn("text-xl font-black leading-tight", getRoleColor(players[activeModalIndex].role))}>
                  {getRoleText(players[activeModalIndex].role)}
                </div>
                <p className="text-[10px] text-white/40 uppercase font-bold">Asegúrate de que nadie más esté mirando.</p>
              </motion.div>
            ) : null}
          </div>

          <DialogFooter>
            {!isWordRevealed ? (
              <Button 
                className="w-full bg-accent-purple hover:bg-accent-purple-light text-white font-black py-6 rounded-xl"
                disabled={!tempName.trim()}
                onClick={handleConfirmName}
              >
                VER MI PALABRA <Eye className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button 
                className="w-full bg-white text-black hover:bg-white/90 font-black py-6 rounded-xl"
                onClick={handleFinishAssignment}
              >
                ENTENDIDO, OCULTAR <EyeOff className="ml-2 w-5 h-5" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-0 right-0 px-6 flex justify-center z-40"
          >
            <Button
              size="lg"
              className="w-full max-w-md bg-accent-purple hover:bg-accent-purple-light text-white font-black text-xl py-8 rounded-2xl shadow-[0_0_50px_rgba(147,51,234,0.4)] border-t border-white/20"
              onClick={handleBegin}
            >
              COMENZAR PARTIDA <Play className="ml-2 fill-current" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
