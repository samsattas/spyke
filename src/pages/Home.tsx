import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Button } from '../components/ui/button';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 0],
            x: ['-10%', '20%', '-10%'],
            y: ['-10%', '10%', '-10%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-accent-purple/40 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -180, 0],
            x: ['10%', '-20%', '10%'],
            y: ['10%', '-10%', '10%'],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-0 w-[70vw] h-[70vw] bg-accent-purple/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-black via-transparent to-black pointer-events-none"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-accent-purple to-accent-purple-light drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]">
          SPYKE
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link to="/setup">
          <Button size="lg" className="bg-accent-purple hover:bg-accent-purple-light text-white font-black text-2xl px-12 py-8 rounded-full shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all hover:scale-105">
            JUGAR <Play className="ml-2 fill-current" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
