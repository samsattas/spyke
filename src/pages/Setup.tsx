import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, User, ArrowRight } from 'lucide-react';

const IncognitoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <rect x="28" y="4" width="44" height="28" rx="6" />
    <rect x="6" y="28" width="88" height="10" rx="5" />
    <circle cx="34" cy="58" r="14" fill="none" stroke="currentColor" strokeWidth="7" />
    <circle cx="66" cy="58" r="14" fill="none" stroke="currentColor" strokeWidth="7" />
    <line x1="48" y1="58" x2="52" y2="58" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M18 82 Q12 100 50 100 Q88 100 82 82 Q66 74 50 74 Q34 74 18 82 Z" />
  </svg>
);
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useGameState } from '../hooks/useGameState';

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { initGame } = useGameState();
  
  const [innocentCount, setInnocentCount] = useState(3);
  const [spyCount, setSpyCount] = useState(1);
  const [impostorCount, setImpostorCount] = useState(0);

  // Update spies and impostors automatically when innocents increase
  const handleInnocentChange = (val: number) => {
    const newInnocents = Math.max(2, Math.min(15, val));
    setInnocentCount(newInnocents);
    
    // Automatic logic: more conservative to keep balance
    let newSpies = Math.max(1, Math.floor(newInnocents / 3));
    let newImpostors = Math.floor(newInnocents / 5);
    
    // Ensure bad roles < innocents
    while (newSpies + newImpostors >= newInnocents && (newSpies > 1 || newImpostors > 0)) {
      if (newImpostors > 0) newImpostors--;
      else if (newSpies > 1) newSpies--;
    }
    
    setSpyCount(newSpies);
    setImpostorCount(newImpostors);
  };

  const totalPlayers = innocentCount + spyCount + impostorCount;
  
  const isValid = totalPlayers >= 3 && totalPlayers <= 20 && innocentCount > (spyCount + impostorCount);

  const handleStart = () => {
    if (!isValid) return;
    const emptyNames = Array(totalPlayers).fill('');
    initGame({ totalPlayers, spyCount, impostorCount }, emptyNames);
    navigate('/assign');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Animated Background (Same as Home for consistency) */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-accent-purple/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[70vw] h-[70vw] bg-accent-purple/10 rounded-full blur-[150px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 md:space-y-12"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Configuración</h2>
          <p className="text-accent-purple/60 font-mono text-[10px] md:text-xs uppercase tracking-widest">Ajusta los parámetros de la partida</p>
        </div>

        <div className="space-y-8 md:space-y-10">
          {/* Inocentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg md:text-xl font-bold flex items-center gap-3 text-white">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-role-innocent" /> Inocentes
              </Label>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-white/10 hover:bg-white/5"
                  onClick={() => handleInnocentChange(innocentCount - 1)}
                >
                  -
                </Button>
                <span className="text-3xl md:text-4xl font-black w-10 md:w-12 text-center text-role-innocent">{innocentCount}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-white/10 hover:bg-white/5"
                  onClick={() => handleInnocentChange(innocentCount + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Espías */}
          <div className="space-y-4 opacity-80">
            <div className="flex items-center justify-between">
              <Label className="text-lg md:text-xl font-bold flex items-center gap-3 text-white/70">
                <User className="w-5 h-5 md:w-6 md:h-6 text-role-spy" /> Espías
              </Label>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-white/10 hover:bg-white/5"
                  onClick={() => setSpyCount(Math.max(1, spyCount - 1))}
                >
                  -
                </Button>
                <span className="text-3xl md:text-4xl font-black w-10 md:w-12 text-center text-role-spy">{spyCount}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-white/10 hover:bg-white/5"
                  onClick={() => setSpyCount(spyCount + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Impostores */}
          <div className="space-y-4 opacity-80">
            <div className="flex items-center justify-between">
              <Label className="text-lg md:text-xl font-bold flex items-center gap-3 text-white/70">
                <IncognitoIcon className="w-5 h-5 md:w-6 md:h-6 text-role-impostor" /> Impostores
              </Label>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-white/10 hover:bg-white/5"
                  onClick={() => setImpostorCount(Math.max(0, impostorCount - 1))}
                >
                  -
                </Button>
                <span className="text-3xl md:text-4xl font-black w-10 md:w-12 text-center text-role-impostor">{impostorCount}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-white/10 hover:bg-white/5"
                  onClick={() => setImpostorCount(impostorCount + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 md:pt-8">
          {!isValid && innocentCount <= (spyCount + impostorCount) && (
            <p className="text-role-impostor text-[10px] uppercase font-bold text-center mb-4 animate-pulse">
              * Los inocentes deben ser mayoría absoluta
            </p>
          )}
          <Button
            className="w-full bg-accent-purple hover:bg-accent-purple-light text-white font-black text-lg md:text-2xl py-6 md:py-10 rounded-2xl shadow-[0_0_40px_rgba(147,51,234,0.2)] transition-all active:scale-95"
            disabled={!isValid}
            onClick={handleStart}
          >
            CONFIRMAR ({totalPlayers} TOTAL) <ArrowRight className="ml-3 w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
