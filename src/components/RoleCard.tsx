import React from 'react';
import { Player } from '../types';
import { Card, CardContent } from './ui/card';
import { cn } from '../lib/utils';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface RoleCardProps {
  player: Player;
  onClick: () => void;
  isDone: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  player,
  onClick,
  isDone,
}) => {
  return (
    <Card 
      className={cn(
        "aspect-square flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 border-2",
        isDone 
          ? "bg-accent-purple/40 border-white/20 opacity-50 cursor-not-allowed" 
          : "bg-accent-purple border-white hover:bg-accent-purple-light shadow-lg shadow-accent-purple/20"
      )}
      onClick={() => !isDone && onClick()}
    >
      <CardContent className="p-0 flex items-center justify-center">
        {isDone ? (
          <CheckCircle2 className="w-20 h-20 text-white" strokeWidth={1.5} />
        ) : (
          <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center bg-white/10">
            <span className="text-6xl font-black text-white leading-none">?</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
