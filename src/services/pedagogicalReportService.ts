import type { ClassPedagogicalReport, StudentPedagogicalSnapshot } from '../types/pedagogy';
import { db } from './databaseService';

const TOTAL_CARDS = 31;

const safeAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const rankRisk = (estimatedAccuracy: number, generatedWordsLast7Days: number, unlockedCards: number): 'low' | 'medium' | 'high' => {
  if (estimatedAccuracy >= 75 && generatedWordsLast7Days >= 2 && unlockedCards >= 10) {
    return 'low';
  }

  if (estimatedAccuracy >= 60 && unlockedCards >= 7) {
    return 'medium';
  }

  return 'high';
};

const toSnapshot = async (playerId: string, playerName: string): Promise<StudentPedagogicalSnapshot> => {
  const player = await db.players.get(playerId);
  const createdWords = await db.customWords.where('creatorName').equalsIgnoreCase(playerName).toArray();
  const recentWords = createdWords.filter((word) => word.createdAt >= daysAgo(7));

  const totalVotes = createdWords.reduce((sum, word) => sum + word.golacos + word.faltas, 0);
  const totalGolacos = createdWords.reduce((sum, word) => sum + word.golacos, 0);
  const approvalRate = totalVotes > 0 ? (totalGolacos / totalVotes) * 100 : 0;

  const unlockedCards = player?.unlockedPhonemes.length ?? 0;
  const estimatedAccuracy = Math.min(100, 45 + unlockedCards * 1.3);

  const phonemeMap = new Map<string, { uses: number; votes: number; positives: number }>();
  createdWords.forEach((word) => {
    const wordVotes = word.golacos + word.faltas;
    word.wordArray.forEach((token) => {
      const current = phonemeMap.get(token) ?? { uses: 0, votes: 0, positives: 0 };
      current.uses += 1;
      current.votes += wordVotes;
      current.positives += word.golacos;
      phonemeMap.set(token, current);
    });
  });

  const highlightedPhonemes = Array.from(phonemeMap.entries())
    .map(([phoneme, stats]) => {
      const accuracy = stats.votes > 0 ? (stats.positives / stats.votes) * 100 : 0;
      return {
        phoneme,
        attempts: stats.uses,
        correct: stats.positives,
        accuracy: Math.round(accuracy),
      };
    })
    .sort((left, right) => right.attempts - left.attempts)
    .slice(0, 8);

  const strongestPhonemes = [...highlightedPhonemes]
    .sort((left, right) => right.accuracy - left.accuracy)
    .slice(0, 5)
    .map((item) => item.phoneme);

  const weakestPhonemes = [...highlightedPhonemes]
    .sort((left, right) => left.accuracy - right.accuracy)
    .slice(0, 5)
    .map((item) => item.phoneme);

  const engagementScore = Math.min(
    100,
    Math.round((recentWords.length * 12) + (createdWords.length * 4) + (approvalRate * 0.35) + (unlockedCards * 1.2))
  );

  const riskLevel = rankRisk(estimatedAccuracy, recentWords.length, unlockedCards);

  return {
    playerId,
    playerName,
    crowd: player?.crowd ?? 0,
    unlockedCards,
    totalCards: TOTAL_CARDS,
    estimatedAccuracy: Math.round(estimatedAccuracy),
    strongestPhonemes,
    weakestPhonemes,
    bnccFocusCodes: ['EF01LP02', 'EF01LP05', 'EF01LP08'],
    generatedWords: createdWords.length,
    generatedWordsLast7Days: recentWords.length,
    communityApprovalRate: Math.round(approvalRate),
    engagementScore,
    riskLevel,
    highlightedPhonemes,
  };
};

export const pedagogicalReportService = {
  async generateClassReport(): Promise<ClassPedagogicalReport> {
    const players = await db.players.toArray();
    const allWords = await db.customWords.toArray();

    const topPhonemeMap = new Map<string, number>();
    allWords.forEach((word) => {
      word.wordArray.forEach((token) => {
        topPhonemeMap.set(token, (topPhonemeMap.get(token) ?? 0) + 1);
      });
    });

    const classTopPhonemes = Array.from(topPhonemeMap.entries())
      .map(([phoneme, count]) => ({ phoneme, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 10);

    const totalVotes = allWords.reduce((sum, word) => sum + word.golacos + word.faltas, 0);

    const students = await Promise.all(
      players.map((player) => toSnapshot(player.id, player.name))
    );

    return {
      generatedAt: new Date(),
      students,
      classTopPhonemes,
      totals: {
        students: students.length,
        generatedWords: allWords.length,
        totalVotes,
      },
      classAverages: {
        avgCrowd: Math.round(safeAverage(students.map((student) => student.crowd))),
        avgUnlockedCards: Math.round(safeAverage(students.map((student) => student.unlockedCards))),
        avgEstimatedAccuracy: Math.round(safeAverage(students.map((student) => student.estimatedAccuracy))),
        avgCommunityApprovalRate: Math.round(safeAverage(students.map((student) => student.communityApprovalRate))),
        avgEngagementScore: Math.round(safeAverage(students.map((student) => student.engagementScore))),
      },
    };
  },
};
