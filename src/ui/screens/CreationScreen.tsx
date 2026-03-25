import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, PhonemeCard } from '../components';
import { ALL_PHONEMES } from '../../engine/config/phonemes';
import { audioManager } from '../../services/audioManager';
import { customWordService } from '../../services/databaseService';
import { useGameStore } from '../../store/gameStore';
import type { AppScreen, Phoneme } from '../../types';

interface CreationScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const CreationScreen: React.FC<CreationScreenProps> = ({ onNavigate }) => {
  const [wordBuilder, setWordBuilder] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const currentPlayer = useGameStore((s) => s.currentPlayer);

  const uniquePhonemes = useMemo(() => {
    const map = new Map<string, Phoneme>();
    ALL_PHONEMES.forEach((phoneme) => {
      const key = phoneme.phoneme.toLowerCase();
      if (!map.has(key)) {
        map.set(key, phoneme);
      }
    });

    return Array.from(map.values());
  }, []);

  const handleAddPhoneme = (phoneme: Phoneme) => {
    setWordBuilder((prev) => [...prev, phoneme.phoneme.toLowerCase()]);
    setFeedbackMessage(null);
  };

  const handlePlayWord = async () => {
    if (wordBuilder.length === 0) return;

    setIsPlaying(true);
    setFeedbackMessage(null);

    try {
      await audioManager.playPhonemeSequence(wordBuilder);
    } catch (error) {
      console.error('Falha ao tocar sequência:', error);
      setFeedbackMessage('Não foi possível tocar esta jogada agora.');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSaveWord = async () => {
    if (wordBuilder.length === 0) return;

    setIsSaving(true);
    setFeedbackMessage(null);

    try {
      const creatorName = currentPlayer?.name ?? 'Treinador(a)';
      await customWordService.saveCustomWord(wordBuilder, creatorName);
      setFeedbackMessage('Jogada salva na Liga da Turma! 🏆');
      setWordBuilder([]);
    } catch (error) {
      console.error('Falha ao salvar jogada:', error);
      setFeedbackMessage('Não foi possível salvar a jogada. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-50 to-uniform-50 p-6">
      <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate('menu')}
            className="text-3xl hover:scale-110 transition-transform"
          >
            ←
          </button>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-field-700">
            Centro de Treinamento
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <p className="font-display font-bold text-lg text-neutral-700 mb-3">Placar da Jogada</p>
          <div className="flex flex-wrap gap-2 min-h-14 items-center">
            {wordBuilder.length === 0 ? (
              <span className="text-neutral-500">Selecione fonemas para montar sua palavra</span>
            ) : (
              wordBuilder.map((phoneme, index) => (
                <span
                  key={`${phoneme}-${index}`}
                  className="bg-uniform-600 text-white px-3 py-2 rounded-lg font-display font-bold uppercase"
                >
                  {phoneme}
                </span>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <Button variant="secondary" size="md" onClick={handlePlayWord} disabled={wordBuilder.length === 0 || isPlaying}>
              {isPlaying ? '🔊 Tocando...' : '🔊 Ouvir a Jogada'}
            </Button>
            <Button variant="success" size="md" onClick={handleSaveWord} disabled={wordBuilder.length === 0 || isSaving}>
              {isSaving ? 'Salvando...' : '💾 Salvar Jogada'}
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => setWordBuilder((prev) => prev.slice(0, -1))}
              disabled={wordBuilder.length === 0}
            >
              ↩️ Desfazer
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setWordBuilder([])}
              disabled={wordBuilder.length === 0}
            >
              🧹 Limpar
            </Button>
          </div>

          {feedbackMessage && <p className="mt-4 text-sm font-semibold text-field-700">{feedbackMessage}</p>}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="font-display font-bold text-lg text-neutral-700 mb-4">Teclado de Fonemas</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {uniquePhonemes.map((phoneme) => (
              <PhonemeCard
                key={phoneme.id}
                phoneme={phoneme}
                status="idle"
                onClick={handleAddPhoneme}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
