import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components';
import { useGameStore } from '../../store/gameStore';
import type { AppScreen } from '../../types';

interface VestiarioScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const VestiarioScreen: React.FC<VestiarioScreenProps> = ({ onNavigate }) => {
  const player = useGameStore((s) => s.currentPlayer);

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-100 to-uniform-100 p-6">
      <motion.div className="max-w-5xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🏟️</div>
          <h1 className="font-display text-4xl font-bold text-field-800">Vestiário do Craque Fônico</h1>
          <p className="text-neutral-700 mt-2">
            {player ? `${player.name}, sua torcida atual: ${player.crowd} torcedores` : 'Entre em campo e monte jogadas fonônicas!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div className="bg-white rounded-2xl p-6 shadow-xl" whileHover={{ scale: 1.02 }}>
            <div className="text-4xl mb-2">🗄️</div>
            <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Armário da Copa</h2>
            <p className="text-sm text-neutral-600 mb-4">Veja suas cartas desbloqueadas e ouça cada som.</p>
            <Button variant="secondary" size="md" onClick={() => onNavigate('album')} className="w-full">
              Abrir Álbum
            </Button>
          </motion.div>

          <motion.div className="bg-white rounded-2xl p-6 shadow-xl" whileHover={{ scale: 1.02 }}>
            <div className="text-4xl mb-2">📋</div>
            <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Quadro Tático</h2>
            <p className="text-sm text-neutral-600 mb-4">Crie jogadas com as cartas que já conquistou.</p>
            <Button variant="primary" size="md" onClick={() => onNavigate('prancheta')} className="w-full">
              Ir para Prancheta
            </Button>
          </motion.div>

          <motion.div className="bg-white rounded-2xl p-6 shadow-xl" whileHover={{ scale: 1.02 }}>
            <div className="text-4xl mb-2">🚇</div>
            <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Túnel do Estádio</h2>
            <p className="text-sm text-neutral-600 mb-4">Escolha Partidas Oficiais ou Campeonato da Turma.</p>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="success" size="md" onClick={() => onNavigate('campo')}>
                Partidas Oficiais
              </Button>
              <Button variant="secondary" size="md" onClick={() => onNavigate('campeonato')}>
                Campeonato da Turma
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
