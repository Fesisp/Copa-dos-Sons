import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components';
import { useGameStore } from '../../store/gameStore';
import { customWordService } from '../../services/databaseService';
import type { AppScreen } from '../../types';
import { prefetchScreens } from './screenLoaders';

interface VestiarioScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const VestiarioScreen: React.FC<VestiarioScreenProps> = ({ onNavigate }) => {
  const player = useGameStore((s) => s.currentPlayer);
  const difficultyPhase = useGameStore((s) => s.difficultyPhase);
  const unlockedCount = player?.unlockedPhonemes.length ?? 0;
  const completedMatches = player?.completedOfficialMatchIds.length ?? 0;
  const [createdWords, setCreatedWords] = React.useState(0);

  React.useEffect(() => {
    const loadCreatedWords = async () => {
      if (!player) {
        setCreatedWords(0);
        return;
      }

      const allWords = await customWordService.getAllCustomWords();
      const totalByPlayer = allWords.filter((word) => word.creatorName.toLowerCase() === player.name.toLowerCase()).length;
      setCreatedWords(totalByPlayer);
    };

    void loadCreatedWords();
  }, [player]);

  const buildIntentPrefetchProps = (screens: AppScreen[]) => {
    const prefetch = () => prefetchScreens(screens);

    return {
      onMouseEnter: prefetch,
      onFocus: prefetch,
      onTouchStart: prefetch,
    };
  };

  return (
    <div className="min-h-screen relative locker-room-bg p-6">
      <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🧤</div>
          <h1 className="font-display text-4xl font-bold text-gold-300 drop-shadow-lg">Vestiário do Craque Fônico</h1>
          <p className="text-white/90 mt-2 font-bold">
            {player ? `${player.name}, sua torcida atual: ${player.crowd} torcedores` : 'Entre em campo e monte jogadas fonônicas!'}
          </p>
        </div>

        <motion.div
          className="mb-6 rounded-3xl bg-white/96 backdrop-blur p-6 shadow-2xl border border-gold-200"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div>
              <p className="text-sm text-neutral-500">Saldo da Torcida</p>
              <p className="font-display text-4xl text-field-700 font-extrabold">{player?.crowd ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Cartas Liberadas</p>
              <p className="font-display text-3xl text-uniform-700 font-bold">{unlockedCount}/31</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Elenco</p>
              <p className="font-display text-xl text-neutral-700 font-bold">{player?.name ?? 'Novo Craque'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Partidas Oficiais</p>
              <p className="font-display text-2xl text-field-700 font-bold">{completedMatches}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Fase / Táticas</p>
              <p className="font-display text-2xl text-field-700 font-bold">F{difficultyPhase} · {createdWords}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div className="bg-gradient-to-b from-white to-gold-50 rounded-2xl p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.15)] border-l-8 border-gold-500" whileHover={{ scale: 1.02, y: -3 }}>
            <div className="text-5xl mb-2">👕</div>
            <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Meu Álbum</h2>
            <p className="text-sm text-neutral-700 mb-4">A camisa da seleção abre seu álbum de figurinhas fonêmicas.</p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('album')}
              className="w-full"
              {...buildIntentPrefetchProps(['album'])}
            >
              Abrir Meu Álbum
            </Button>
          </motion.div>

          <motion.div className="bg-gradient-to-b from-white to-uniform-50 rounded-2xl p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.15)] border-l-8 border-uniform-500" whileHover={{ scale: 1.02, y: -3 }}>
            <div className="text-5xl mb-2">🚪</div>
            <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Ir para o Treino</h2>
            <p className="text-sm text-neutral-700 mb-4">Passe pelo túnel iluminado e entre no gramado das partidas oficiais.</p>
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('campo')}
              className="w-full"
              {...buildIntentPrefetchProps(['campo', 'match'])}
            >
              Ir para o Treino
            </Button>
          </motion.div>

          <motion.div className="bg-gradient-to-b from-white to-field-50 rounded-2xl p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.15)] border-l-8 border-field-500" whileHover={{ scale: 1.02, y: -3 }}>
            <div className="text-5xl mb-2">🧠</div>
            <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Prancheta</h2>
            <p className="text-sm text-neutral-700 mb-4">A prancheta do técnico vira laboratório de criação de jogadas sonoras.</p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('prancheta')}
              className="w-full"
              {...buildIntentPrefetchProps(['prancheta'])}
            >
              Ir para Prancheta
            </Button>
          </motion.div>

          <motion.div className="bg-gradient-to-b from-white to-gold-50 rounded-2xl p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.15)] border-l-8 border-gold-500" whileHover={{ scale: 1.02, y: -3 }}>
            <div className="text-5xl mb-2">🏆</div>
            <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Campeonato</h2>
            <p className="text-sm text-neutral-700 mb-4">Jogue as criações da turma e vote no VAR para subir no ranking.</p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('campeonato')}
              className="w-full"
              {...buildIntentPrefetchProps(['campeonato'])}
            >
              Abrir Campeonato
            </Button>
          </motion.div>

          <motion.div className="bg-gradient-to-b from-white to-error-50 rounded-2xl p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.15)] border-l-8 border-error-500" whileHover={{ scale: 1.02, y: -3 }}>
            <div className="text-5xl mb-2">📊</div>
            <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Boletim do Técnico</h2>
            <p className="text-sm text-neutral-600 mb-4">Área docente com indicadores BNCC e análise UGC da turma.</p>
            <Button
              variant="danger"
              size="md"
              onClick={() => onNavigate('boletim')}
              className="w-full"
              {...buildIntentPrefetchProps(['boletim'])}
            >
              Acessar Boletim
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
