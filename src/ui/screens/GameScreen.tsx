/**
 * Game Screen
 * Main gameplay screen where players answer phoneme questions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhonemeCard, ProgressBar, Button, DropZone } from '../components';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../services/audioManager';
import { getIncorrectOptions, shuffleArray } from '../../engine';
import type { AppScreen, Phoneme } from '../../types';
import { ALL_PHONEMES } from '../../engine/config/phonemes';

interface GameScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onNavigate }) => {
  const [options, setOptions] = useState<Phoneme[]>([]);
  const [currentPhoneme, setCurrentPhoneme] = useState<Phoneme | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const slotRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  const gameState = useGameStore((s) => s.gameState);
  const gameMode = useGameStore((s) => s.gameMode);
  const difficulty = useGameStore((s) => s.difficulty);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const score = useGameStore((s) => s.score);
  const correctAnswers = useGameStore((s) => s.correctAnswers);
  const incorrectAnswers = useGameStore((s) => s.incorrectAnswers);
  const totalQuestions = useGameStore((s) => s.totalQuestions);
  const lastFeedback = useGameStore((s) => s.lastFeedback);
  const isAudioPlaying = useGameStore((s) => s.isAudioPlaying);
  const targetWord = useGameStore((s) => s.targetWord);
  const assembledSlots = useGameStore((s) => s.assembledSlots);
  const availableWordPhonemes = useGameStore((s) => s.availableWordPhonemes);

  const answerQuestion = useGameStore((s) => s.answerQuestion);
  const nextPhoneme = useGameStore((s) => s.nextPhoneme);
  const handleDrop = useGameStore((s) => s.handleDrop);

  const answeredQuestions = correctAnswers + incorrectAnswers;
  const wordProgress = assembledSlots.filter((slot) => slot !== null).length;

  // Initialize game and load first phoneme
  useEffect(() => {
    if (gameMode === 'quiz' && difficulty && currentLevel && answeredQuestions === 0) {
      loadNextPhoneme();
    }
  }, [difficulty, currentLevel, gameMode]);

  // Auto-play audio when phoneme changes
  useEffect(() => {
    if (gameMode === 'quiz' && currentPhoneme && !hasAnswered) {
      playAudio();
    }
  }, [currentPhoneme, hasAnswered, gameMode]);

  const findSlotByPoint = (point: { x: number; y: number }): number | null => {
    for (let index = 0; index < slotRefs.current.length; index += 1) {
      const element = slotRefs.current[index];
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      const isInside =
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom;

      if (isInside) return index;
    }

    return null;
  };

  const loadNextPhoneme = () => {
    if (!currentLevel) return;

    const randomPhoneme = currentLevel.phonemes[
      Math.floor(Math.random() * currentLevel.phonemes.length)
    ];

    setCurrentPhoneme(randomPhoneme);

    // Generate options
    const incorrect = getIncorrectOptions(randomPhoneme.id, randomPhoneme.difficulty, 3);
    const allOptions = [randomPhoneme, ...incorrect];
    setOptions(shuffleArray(allOptions));

    setHasAnswered(false);
  };

  const playAudio = async () => {
    if (gameMode === 'word-builder') {
      try {
        await audioManager.playPhonemeSequence(targetWord);
      } catch (error) {
        console.error('Failed to play word audio:', error);
      }
      return;
    }

    if (!currentPhoneme) return;
    try {
      await audioManager.playPhoneme(currentPhoneme.phoneme.toLowerCase());
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  const handleSelectPhoneme = (selectedPhoneme: Phoneme) => {
    if (gameMode !== 'quiz') return;
    if (!currentPhoneme || hasAnswered) return;

    setHasAnswered(true);
    answerQuestion(selectedPhoneme.id, currentPhoneme.id);
  };

  const handleNextQuestion = () => {
    if (gameState === 'VICTORY' || gameState === 'GAME_OVER') {
      onNavigate('results');
    } else {
      nextPhoneme();
      loadNextPhoneme();
    }
  };

  const handleCardDragMove = (_phonemeId: string, point: { x: number; y: number }) => {
    const slotIndex = findSlotByPoint(point);
    setHoveredSlot(slotIndex);
  };

  const handleCardDragEnd = (phonemeId: string, point: { x: number; y: number }) => {
    const slotIndex = findSlotByPoint(point);
    setHoveredSlot(null);

    if (slotIndex === null) return;
    handleDrop(phonemeId, slotIndex);
  };

  if (gameMode === 'quiz' && (!currentPhoneme || !currentLevel)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-4">🎤</div>
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-100 to-uniform-100 p-6">
      {/* Header */}
      <motion.div
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-field-700">
              🎮 Jogo
            </h1>
            <p className="text-sm text-neutral-600">
              Questão {answeredQuestions + 1} de {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Pontuação</p>
            <p className="font-display text-3xl font-bold text-uniform-600">
              {score}
            </p>
          </div>
        </div>

        <ProgressBar
          current={gameMode === 'word-builder' ? wordProgress : answeredQuestions}
          total={totalQuestions}
          label="Progresso da Fase"
          variant="primary"
        />
      </motion.div>

      {/* Audio Section */}
      <motion.div
        className="max-w-6xl mx-auto mb-12 p-8 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-center font-display font-bold text-neutral-700 mb-4">
          {gameMode === 'word-builder' ? 'Monte a Palavra!' : 'Qual som você ouviu?'}
        </p>

        <div className="flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={playAudio}
            disabled={isAudioPlaying}
            className="relative"
          >
            {isAudioPlaying ? (
              <>
                <motion.span
                  className="inline-block mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  🎵
                </motion.span>
                Tocando...
              </>
            ) : (
              <>{gameMode === 'word-builder' ? '🔊 Ouvir a Palavra' : '🔊 Ouvir Novamente'}</>
            )}
          </Button>
        </div>
      </motion.div>

      {gameMode === 'word-builder' ? (
        <>
          <motion.div
            className="max-w-6xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-center font-display font-bold text-neutral-700 mb-4">
              Arraste os fonemas para os espaços
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {targetWord.map((_, index) => (
                <DropZone
                  key={`slot-${index}`}
                  ref={(element) => {
                    slotRefs.current[index] = element;
                  }}
                  slotIndex={index}
                  value={assembledSlots[index]}
                  isActive={hoveredSlot === index}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {availableWordPhonemes.map((phonemeValue, index) => {
              const candidate = ALL_PHONEMES.find((phoneme) => phoneme.phoneme.toLowerCase() === phonemeValue);
              const phonemeData: Phoneme =
                candidate ??
                {
                  id: `${phonemeValue}-${index}`,
                  phoneme: phonemeValue,
                  difficulty: 'easy',
                  imageUrl: '/images/placeholder.png',
                  audioIndex: 0,
                  examples: [phonemeValue],
                };

              return (
                <PhonemeCard
                  key={`${phonemeValue}-${index}`}
                  phoneme={phonemeData}
                  status="idle"
                  draggable
                  onDragMove={handleCardDragMove}
                  onDragEndPosition={handleCardDragEnd}
                />
              );
            })}
          </motion.div>
        </>
      ) : (
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {options.map((phoneme) => (
              <PhonemeCard
                key={phoneme.id}
                phoneme={phoneme}
                isSelected={lastFeedback?.selectedId === phoneme.id}
                isCorrect={
                  lastFeedback?.isCorrect && lastFeedback?.correctId === phoneme.id
                }
                isWrong={
                  !lastFeedback?.isCorrect && lastFeedback?.selectedId === phoneme.id
                }
                onClick={handleSelectPhoneme}
                disabled={hasAnswered}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {lastFeedback && gameMode === 'quiz' && (
          <motion.div
            className={`fixed bottom-6 left-6 right-6 p-6 rounded-lg shadow-lg ${
              lastFeedback.isCorrect ? 'bg-success-100 border-l-4 border-success-600' : 'bg-error-100 border-l-4 border-error-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p className="font-display font-bold mb-4">
              {lastFeedback.message}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-600">Acertos</p>
                <p className="font-display text-xl font-bold text-success-600">
                  {correctAnswers}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Erros</p>
                <p className="font-display text-xl font-bold text-error-600">
                  {incorrectAnswers}
                </p>
              </div>
            </div>

            {gameState !== 'VICTORY' && gameState !== 'GAME_OVER' && (
              <Button
                variant="primary"
                size="md"
                onClick={handleNextQuestion}
                className="w-full mt-4"
              >
                Próxima Questão
              </Button>
            )}

            {(gameState === 'VICTORY' || gameState === 'GAME_OVER') && (
              <Button
                variant="success"
                size="md"
                onClick={handleNextQuestion}
                className="w-full mt-4"
              >
                Ver Resultados
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {gameMode === 'word-builder' && gameState === 'VICTORY' && (
        <motion.div
          className="fixed bottom-6 left-6 right-6 p-6 rounded-lg shadow-lg bg-success-100 border-l-4 border-success-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-display font-bold mb-4">
            GOOOOL! Palavra montada com sucesso! ⚽
          </p>
          <Button variant="success" size="md" onClick={() => onNavigate('results')} className="w-full">
            Ver Resultados
          </Button>
        </motion.div>
      )}
    </div>
  );
};
