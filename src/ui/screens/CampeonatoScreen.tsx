import React, { useEffect, useState } from 'react';
import { Button } from '../components';
import { customWordService } from '../../services/databaseService';
import { useGameStore } from '../../store/gameStore';
import type { AppScreen, CustomWord } from '../../types';

interface CampeonatoScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const CampeonatoScreen: React.FC<CampeonatoScreenProps> = ({ onNavigate }) => {
  const [words, setWords] = useState<Array<CustomWord & { approvalRate?: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playMode, setPlayMode] = useState<'coop' | 'versus'>('coop');

  const startCommunityMatch = useGameStore((s) => s.startCommunityMatch);
  const setCommunityPlayMode = useGameStore((s) => s.setCommunityPlayMode);
  const setAgentMode = useGameStore((s) => s.setAgentMode);
  const setAgentDifficulty = useGameStore((s) => s.setAgentDifficulty);
  const passTurn = useGameStore((s) => s.passTurn);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const ranked = await customWordService.getRankedWords();
      const recent = await customWordService.getAllCustomWords();
      setWords(ranked.length > 0 ? ranked : recent);
      setIsLoading(false);
    };

    void load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-100 to-uniform-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('vestiario')}>← Vestiário</Button>
          <h1 className="font-display text-3xl font-bold text-field-800">Campeonato da Turma</h1>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-5 border border-field-200">
          <p className="font-display font-bold text-field-700 mb-2">Klayton — Agente Autônomo</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={playMode === 'coop' ? 'success' : 'secondary'}
              size="sm"
              onClick={() => {
                setPlayMode('coop');
                setCommunityPlayMode('coop');
                setAgentMode(true);
                setAgentDifficulty('medium');
              }}
            >
              Cooperação (com Klayton)
            </Button>
            <Button
              variant={playMode === 'versus' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setPlayMode('versus');
                setCommunityPlayMode('versus');
                setAgentMode(true);
                setAgentDifficulty('hard');
              }}
            >
              Versus (contra Klayton)
            </Button>
          </div>
          <p className="text-xs text-neutral-700 mt-2">
            No modo Versus, Klayton inicia o primeiro turno para aumentar o desafio.
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">Carregando ranking...</div>
        ) : words.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">Ainda não há jogadas publicadas.</div>
        ) : (
          <div className="grid gap-4">
            {words.map((word) => (
              <div key={word.id} className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-field-700">
                      Tática do {word.creatorName}
                      {'approvalRate' in word && typeof word.approvalRate === 'number' ? ` - ${Math.round(word.approvalRate)}% Golaço` : ''}
                    </h2>
                    <p className="text-sm text-neutral-600 uppercase tracking-wide">{word.wordArray.join(' • ')}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      👍 {word.golacos} · 👎 {word.faltas} · {word.totalMatches} avaliações
                      {'approvalRate' in word && typeof word.approvalRate === 'number' ? ` · ${Math.round(word.approvalRate)}% aprovação` : ''}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setCommunityPlayMode(playMode);
                      setAgentMode(true);
                      setAgentDifficulty(playMode === 'versus' ? 'hard' : 'medium');
                      startCommunityMatch(word.wordArray, word.id);
                      if (playMode === 'versus') {
                        window.setTimeout(() => passTurn(), 100);
                      }
                      onNavigate('match');
                    }}
                  >
                    {playMode === 'versus' ? 'Jogar Versus' : 'Jogar com Klayton'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
