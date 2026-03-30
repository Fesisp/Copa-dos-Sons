export interface PhonemePerformance {
  phoneme: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface StudentPedagogicalSnapshot {
  playerId: string;
  playerName: string;
  crowd: number;
  unlockedCards: number;
  totalCards: number;
  estimatedAccuracy: number;
  strongestPhonemes: string[];
  weakestPhonemes: string[];
  bnccFocusCodes: Array<'EF01LP02' | 'EF01LP05' | 'EF01LP08'>;
  generatedWords: number;
  generatedWordsLast7Days: number;
  communityApprovalRate: number;
  engagementScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  highlightedPhonemes: PhonemePerformance[];
}

export interface ClassPedagogicalReport {
  generatedAt: Date;
  students: StudentPedagogicalSnapshot[];
  classTopPhonemes: Array<{ phoneme: string; count: number }>;
  totals: {
    students: number;
    generatedWords: number;
    totalVotes: number;
  };
  classAverages: {
    avgCrowd: number;
    avgUnlockedCards: number;
    avgEstimatedAccuracy: number;
    avgCommunityApprovalRate: number;
    avgEngagementScore: number;
  };
}
