/**
 * Menu Screen
 * Main landing screen of the game
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components';
import { useGameStore } from '../../store/gameStore';
import { playerService } from '../../services/databaseService';
import type { AppScreen, Player } from '../../types';

interface MenuScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onNavigate }) => {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);

  const setCurrentPlayer = useGameStore((s) => s.setCurrentPlayer);
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    loadRecentPlayers();
  }, []);

  const loadRecentPlayers = async () => {
    try {
      const players = await playerService.getAllPlayers();
      setRecentPlayers(players.slice(0, 3));
    } catch (error) {
      console.error('Failed to load players:', error);
    }
  };

  const handleStartGame = async (name: string) => {
    setIsLoading(true);
    try {
      const player = await playerService.upsertPlayer(name);
      setCurrentPlayer(player);
      setGameState('LEVEL_SELECT');
      onNavigate('levelSelect');
    } catch (error) {
      console.error('Failed to start game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickStart = async (player: Player) => {
    setCurrentPlayer(player);
    setGameState('LEVEL_SELECT');
    onNavigate('levelSelect');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-50 to-uniform-50 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl md:text-8xl mb-4">🎤⚽</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-field-700 mb-2">
          Copa dos Sons
        </h1>
        <p className="text-lg text-neutral-600">
          Aprenda os sons do português jogando!
        </p>
      </motion.div>

      {/* New Player Input */}
      <motion.div
        className="w-full max-w-md mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <label className="block font-display font-bold text-neutral-700 mb-2">
            Qual é o seu nome?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && playerName.trim()) {
                  handleStartGame(playerName);
                }
              }}
              placeholder="Digite seu nome"
              className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-uniform-600"
              maxLength={50}
            />
            <Button
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={!playerName.trim() || isLoading}
              onClick={() => handleStartGame(playerName)}
            >
              Começar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Recent Players */}
      {recentPlayers.length > 0 && (
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="font-display font-bold text-neutral-700 mb-3">
            Jogadores recentes:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {recentPlayers.map((player) => (
              <motion.button
                key={player.id}
                onClick={() => handleQuickStart(player)}
                className="px-4 py-3 bg-uniform-100 hover:bg-uniform-200 text-uniform-700 rounded-lg font-display font-bold transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {player.name} ({player.totalSessions} sessões)
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-md mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button variant="secondary" size="md" onClick={() => onNavigate('challengeList')}>
          🏆 Jogar Palavras da Turma
        </Button>
        <Button variant="primary" size="md" onClick={() => onNavigate('creation')}>
          🧩 Centro de Treinamento
        </Button>
      </motion.div>
    </div>
  );
};
