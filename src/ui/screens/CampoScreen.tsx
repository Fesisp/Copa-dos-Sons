import React from 'react';
import { Button } from '../components';
import { OFFICIAL_MATCHES } from '../../config/officialMatches';
import { useGameStore } from '../../store/gameStore';
import type { AppScreen } from '../../types';

interface CampoScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const CampoScreen: React.FC<CampoScreenProps> = ({ onNavigate }) => {
  const player = useGameStore((s) => s.currentPlayer);
  const startOfficialMatch = useGameStore((s) => s.startOfficialMatch);

  const completed = new Set(player?.completedOfficialMatchIds ?? []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-100 to-uniform-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('vestiario')}>← Vestiário</Button>
          <h1 className="font-display text-3xl font-bold text-field-800">Partidas Oficiais</h1>
        </div>

        <div className="grid gap-4">
          {OFFICIAL_MATCHES.map((match) => (
            <div key={match.id} className="bg-white rounded-2xl p-5 shadow-lg border-l-4 border-field-500">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-field-700">{match.title}</h2>
                  <p className="text-sm text-neutral-600">Liga: {match.leagueTier.toUpperCase()} · Recompensa: carta /{match.rewardCardId}/ + {match.crowdReward} torcedores</p>
                </div>
                <Button
                  variant="success"
                  size="md"
                  onClick={() => {
                    startOfficialMatch(match);
                    onNavigate('match');
                  }}
                >
                  {completed.has(match.id) ? 'Jogar Novamente' : 'Entrar em Campo'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
