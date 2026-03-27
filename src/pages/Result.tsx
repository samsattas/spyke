import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGameState } from '../hooks/useGameState';
import { Button } from '../components/ui/button';
import { Trophy, RotateCcw, Plus, User, Shield, UserSearch } from 'lucide-react';
import { cn } from '../lib/utils';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, restartWithSamePlayers, resetToSetup } = useGameState();

  useEffect(() => {
    if (gameState.phase === 'setup') {
      navigate('/');
    } else if (gameState.phase === 'assign') {
      navigate('/assign');
    } else if (gameState.phase === 'playing') {
      navigate('/game');
    }
  }, [gameState.phase, navigate]);

  const handleRestartSame = () => {
    restartWithSamePlayers();
    navigate('/assign');
  };

  const handleNewGame = () => {
    resetToSetup();
    navigate('/setup');
  };

  const getWinnerInfo = () => {
    switch (gameState.winner) {
      case 'innocents':
        return {
          title: '¡VICTORIA INOCENTE!',
          color: 'text-role-innocent',
          icon: <Shield className="w-24 h-24 text-role-innocent" />,
          bg: 'bg-role-innocent/10'
        };
      case 'spies':
        return {
          title: '¡VICTORIA DE LOS ESPÍAS!',
          color: 'text-role-spy',
          icon: <User className="w-24 h-24 text-role-spy" />,
          bg: 'bg-role-spy/10'
        };
      case 'impostor':
        return {
          title: '¡EL IMPOSTOR HA GANADO!',
          color: 'text-role-impostor',
          icon: <UserSearch className="w-24 h-24 text-role-impostor" />,
          bg: 'bg-role-impostor/10'
        };
      default:
        return {
          title: '¡FIN DE LA PARTIDA!',
          color: 'text-white',
          icon: <Trophy className="w-24 h-24 text-accent-purple" />,
          bg: 'bg-accent-purple/10'
        };
    }
  };

  const winnerInfo = getWinnerInfo();

  return (
    <div className="min-h-screen p-6 bg-background flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("max-w-2xl w-full p-12 rounded-3xl border border-white/10 text-center mb-12", winnerInfo.bg)}
      >
        <div className="flex justify-center mb-6">{winnerInfo.icon}</div>
        <h2 className={cn("text-3xl md:text-5xl font-black mb-8 tracking-tighter", winnerInfo.color)}>
          {winnerInfo.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-card/50 p-4 rounded-2xl border border-white/5">
            <div className="text-[10px] uppercase opacity-50 mb-1">Palabra Inocente</div>
            <div className="text-xl md:text-2xl font-black text-role-innocent uppercase break-words">{gameState.teamWord}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-2xl border border-white/5">
            <div className="text-[10px] uppercase opacity-50 mb-1">Palabra Espía</div>
            <div className="text-xl md:text-2xl font-black text-role-spy uppercase break-words">{gameState.spyWord}</div>
          </div>
        </div>

        <div className="space-y-2 text-left">
          <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Roles de los Jugadores</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {gameState.players.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-card p-3 rounded-xl border border-white/5">
                <span className="font-bold uppercase text-sm">{p.name}</span>
                <span className={cn(
                  "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                  p.role === 'innocent' ? 'bg-role-innocent/20 text-role-innocent' :
                  p.role === 'spy' ? 'bg-role-spy/20 text-role-spy' : 'bg-role-impostor/20 text-role-impostor'
                )}>
                  {p.role === 'innocent' ? 'Inocente' : p.role === 'spy' ? 'Espía' : 'Impostor'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          size="lg"
          className="flex-1 bg-accent-purple hover:bg-accent-purple-light text-white font-black text-xl py-8 rounded-2xl"
          onClick={handleRestartSame}
        >
          <RotateCcw className="mr-2" /> REPETIR
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/10 font-black text-xl py-8 rounded-2xl"
          onClick={handleNewGame}
        >
          <Plus className="mr-2" /> NUEVA
        </Button>
      </div>
    </div>
  );
};
