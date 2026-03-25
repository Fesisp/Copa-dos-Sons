import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components';
import { customWordService } from '../../services/databaseService';
import { useGameStore } from '../../store/gameStore';
import type { AppScreen, CustomWord } from '../../types';

interface ChallengeListScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const ChallengeListScreen: React.FC<ChallengeListScreenProps> = ({ onNavigate }) => {
  const [challenges, setChallenges] = useState<CustomWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const setWordChallenge = useGameStore((s) => s.setWordChallenge);
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    const loadChallenges = async () => {
      setIsLoading(true);
      try {
        const data = await customWordService.getAllCustomWords();
        setChallenges(data);
      } catch (error) {
        console.error('Falha ao carregar desafios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, []);

  const handlePlayChallenge = async (challenge: CustomWord) => {
    setWordChallenge(challenge.wordArray, challenge.id);
    setGameState('PLAYING');

    try {
      await customWordService.incrementPlayedCount(challenge.id);
    } catch (error) {
      console.error('Falha ao atualizar contador do desafio:', error);
    }

    onNavigate('game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-50 to-uniform-50 p-6">
      <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate('menu')}
            className="text-3xl hover:scale-110 transition-transform"
          >
            ←
          </button>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-field-700">
            🏆 Desafios da Turma
          </h1>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center text-neutral-600">Carregando desafios...</div>
        ) : challenges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-neutral-600 mb-4">Ainda não existem desafios salvos.</p>
            <Button variant="secondary" size="md" onClick={() => onNavigate('creation')}>
              Criar primeira jogada
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                whileHover={{ scale: 1.01 }}
              >
                <div>
                  <p className="font-display font-bold text-lg text-neutral-800">
                    Desafio de {challenge.creatorName}
                  </p>
                  <p className="text-sm text-neutral-600 uppercase tracking-wide">
                    {challenge.wordArray.join(' • ')}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Entrou em campo {challenge.playedCount}x</p>
                </div>

                <Button variant="primary" size="md" onClick={() => handlePlayChallenge(challenge)}>
                  ⚽ Jogar
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
