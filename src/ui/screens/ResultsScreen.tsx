/**
 * Results Screen
 * Game results and session summary
 */

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components';
import { useGameStore } from '../../store/gameStore';
import { sessionService, playerService } from '../../services/databaseService';
import { calculateSessionStats } from '../../engine';
import type { AppScreen } from '../../types';

interface ResultsScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onNavigate }) => {
  const gameState = useGameStore((s) => s.gameState);
  const currentPlayer = useGameStore((s) => s.currentPlayer);
  const difficulty = useGameStore((s) => s.difficulty);
  const score = useGameStore((s) => s.score);
  const correctAnswers = useGameStore((s) => s.correctAnswers);
  const totalQuestions = useGameStore((s) => s.totalQuestions);
  const resetGame = useGameStore((s) => s.resetGame);

  const stats = calculateSessionStats(correctAnswers, totalQuestions);

  const saveSession = useCallback(async () => {
    try {
      if (!currentPlayer || !difficulty) return;

      // Create session
      const session = await sessionService.createSession(currentPlayer.id, difficulty);
      session.score = score;
      session.totalQuestions = totalQuestions;
      session.correctAnswers = correctAnswers;
      session.incorrectAnswers = totalQuestions - correctAnswers;
      
      await sessionService.updateSession(session);

      // Update player stats
      await playerService.updatePlayerStats(currentPlayer.id, session);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, [currentPlayer, difficulty, score, totalQuestions, correctAnswers]);

  useEffect(() => {
    // Save session to database
    if (currentPlayer && difficulty) {
      saveSession();
    }
  }, [currentPlayer, difficulty, saveSession]);

  const isVictory = gameState === 'VICTORY';
  const emoji = isVictory ? '🏆' : '💪';
  const title = isVictory ? 'Você Venceu!' : 'Bom Trabalho!';
  const message = isVictory
    ? 'Você conquistou 80% de acertos e completou este nível!'
    : 'Continue praticando para melhorar sua pontuação!';

  const handlePlayAgain = () => {
    resetGame();
    onNavigate('levelSelect');
  };

  const handleBackToMenu = () => {
    resetGame();
    onNavigate('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-50 to-uniform-50 flex items-center justify-center p-6">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Celebration/Feedback */}
        <div className="text-center mb-12">
          <motion.div
            className="text-7xl mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          >
            {emoji}
          </motion.div>

          <motion.h1
            className="font-display text-4xl md:text-5xl font-bold text-field-700 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-lg text-neutral-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-success-600">
            <p className="text-sm text-neutral-600 mb-1">Acertos</p>
            <p className="font-display text-3xl font-bold text-success-600">
              {correctAnswers}
            </p>
            <p className="text-xs text-neutral-500">{stats.isPassed && '✓ Passou'}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-uniform-600">
            <p className="text-sm text-neutral-600 mb-1">Pontuação</p>
            <p className="font-display text-3xl font-bold text-uniform-600">
              {score}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-error-600">
            <p className="text-sm text-neutral-600 mb-1">Erros</p>
            <p className="font-display text-3xl font-bold text-error-600">
              {stats.incorrectAnswers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-warning-600">
            <p className="text-sm text-neutral-600 mb-1">Precisão</p>
            <p className="font-display text-3xl font-bold text-warning-600">
              {stats.accuracy}%
            </p>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          className="bg-field-100 p-6 rounded-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-display font-bold text-neutral-700 mb-3">
            Resumo da Sessão:
          </p>
          <ul className="space-y-2 text-neutral-600 text-sm">
            <li>✓ Respondeu {correctAnswers + stats.incorrectAnswers} questões</li>
            <li>✓ Acertou {correctAnswers} vezes ({stats.accuracy}%)</li>
            <li>✓ Ganhou {score} pontos</li>
            {currentPlayer && <li>✓ Jogador: {currentPlayer.name}</li>}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="success"
            size="lg"
            className="w-full"
            onClick={handlePlayAgain}
          >
            🎮 Jogar Novamente
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleBackToMenu}
          >
            ← Voltar ao Menu
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
