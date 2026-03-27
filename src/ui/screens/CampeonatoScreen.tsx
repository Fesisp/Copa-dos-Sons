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

  const startCommunityMatch = useGameStore((s) => s.startCommunityMatch);

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
                    <h2 className="font-display text-xl font-bold text-field-700">Jogada de {word.creatorName}</h2>
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
                      startCommunityMatch(word.wordArray, word.id);
                      onNavigate('match');
                    }}
                  >
                    Jogar
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
