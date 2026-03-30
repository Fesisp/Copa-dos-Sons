import React, { useMemo, useState } from 'react';
import { Button } from '../components';
import type { AppScreen } from '../../types';
import { BNCC_SKILLS } from '../../config/bncc';
import { TEACHER_REPORT_PIN, TEACHER_REPORT_SESSION_KEY } from '../../config/teacherAccess';
import { pedagogicalReportService } from '../../services/pedagogicalReportService';
import type { StudentPedagogicalSnapshot } from '../../types/pedagogy';

type SortField = 'engagement' | 'accuracy' | 'approval' | 'crowd' | 'unlocked';

type BnccCode = 'all' | 'EF01LP02' | 'EF01LP05' | 'EF01LP08';

interface BoletimTecnicoScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

const riskClasses: Record<StudentPedagogicalSnapshot['riskLevel'], string> = {
  low: 'bg-success-100 text-success-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const bnccDescriptions: Record<'EF01LP02' | 'EF01LP05' | 'EF01LP08', string> = {
  EF01LP02: 'Foco em discriminação de sons e precisão fonêmica.',
  EF01LP05: 'Foco em relação fonema-grafema e composição de palavras.',
  EF01LP08: 'Foco em leitura/escrita inicial com apoio sonoro.',
};

const recommendationForStudent = (student: StudentPedagogicalSnapshot): string[] => {
  const recommendations: string[] = [];

  if (student.riskLevel === 'high') {
    recommendations.push('Aplicar microciclos diários de 10 minutos com ênfase nos fonemas mais fracos.');
  }

  if (student.generatedWordsLast7Days < 2) {
    recommendations.push('Incentivar produção na Prancheta com meta mínima de 2 táticas por semana.');
  }

  if (student.communityApprovalRate < 60 && student.generatedWords > 0) {
    recommendations.push('Revisar sentido fonêmico das palavras criadas antes de publicar no Campeonato.');
  }

  if (student.unlockedCards < 12) {
    recommendations.push('Priorizar partidas oficiais para acelerar desbloqueio de cartas-base.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Manter trilha atual e ampliar desafios colaborativos com pares.');
  }

  return recommendations;
};

export const BoletimTecnicoScreen: React.FC<BoletimTecnicoScreenProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(
    () => sessionStorage.getItem(TEACHER_REPORT_SESSION_KEY) === 'granted'
  );
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('engagement');
  const [bnccFilter, setBnccFilter] = useState<BnccCode>('all');
  const [riskOnly, setRiskOnly] = useState(false);

  const [students, setStudents] = useState<StudentPedagogicalSnapshot[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [classAverages, setClassAverages] = useState({
    avgCrowd: 0,
    avgUnlockedCards: 0,
    avgEstimatedAccuracy: 0,
    avgCommunityApprovalRate: 0,
    avgEngagementScore: 0,
  });
  const [classTopPhonemes, setClassTopPhonemes] = useState<Array<{ phoneme: string; count: number }>>([]);
  const [totals, setTotals] = useState({ students: 0, generatedWords: 0, totalVotes: 0 });

  React.useEffect(() => {
    if (!isAuthorized) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      const report = await pedagogicalReportService.generateClassReport();
      setStudents(report.students);
      setGeneratedAt(report.generatedAt);
      setClassAverages(report.classAverages);
      setClassTopPhonemes(report.classTopPhonemes);
      setTotals(report.totals);

      if (report.students.length > 0) {
        setSelectedStudentId((current) => current ?? report.students[0].playerId);
      }

      setIsLoading(false);
    };

    void load();
  }, [isAuthorized]);

  const filteredStudents = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    const result = students
      .filter((student) => {
        if (!lowerSearch) return true;
        return student.playerName.toLowerCase().includes(lowerSearch);
      })
      .filter((student) => {
        if (bnccFilter === 'all') return true;
        return student.bnccFocusCodes.includes(bnccFilter);
      })
      .filter((student) => {
        if (!riskOnly) return true;
        return student.riskLevel !== 'low';
      })
      .sort((left, right) => {
        if (sortField === 'engagement') return right.engagementScore - left.engagementScore;
        if (sortField === 'accuracy') return right.estimatedAccuracy - left.estimatedAccuracy;
        if (sortField === 'approval') return right.communityApprovalRate - left.communityApprovalRate;
        if (sortField === 'crowd') return right.crowd - left.crowd;
        return right.unlockedCards - left.unlockedCards;
      });

    return result;
  }, [students, search, sortField, bnccFilter, riskOnly]);

  const selectedStudent = useMemo(
    () => filteredStudents.find((student) => student.playerId === selectedStudentId) ?? filteredStudents[0] ?? null,
    [filteredStudents, selectedStudentId]
  );

  const handleAuthorize = () => {
    if (pinInput.trim() === TEACHER_REPORT_PIN) {
      sessionStorage.setItem(TEACHER_REPORT_SESSION_KEY, 'granted');
      setIsAuthorized(true);
      setPinError('');
      return;
    }

    setPinError('PIN inválido. Verifique com a coordenação pedagógica.');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen stadium-bg p-6 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-7 border-l-8 border-uniform-500">
          <h1 className="font-display text-3xl font-bold text-field-700 mb-2">Boletim do Técnico</h1>
          <p className="text-sm text-neutral-600 mb-4">
            Área protegida para equipe docente. Insira o PIN pedagógico para acessar os indicadores da turma.
          </p>
          <div className="space-y-3">
            <input
              type="password"
              value={pinInput}
              onChange={(event) => setPinInput(event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              placeholder="PIN de acesso"
            />
            {pinError && <p className="text-sm text-red-600">{pinError}</p>}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="primary" size="md" onClick={handleAuthorize}>Entrar</Button>
              <Button variant="secondary" size="md" onClick={() => onNavigate('vestiario')}>Voltar</Button>
            </div>
            <p className="text-xs text-neutral-500">Use o PIN definido pela coordenação ou no arquivo de ambiente.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen stadium-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-4xl font-bold text-white drop-shadow-lg">Boletim do Técnico</h1>
            <p className="text-white/90 text-sm">
              Relatório pedagógico operacional com foco BNCC e UGC
              {generatedAt ? ` · Atualizado em ${generatedAt.toLocaleString('pt-BR')}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onNavigate('vestiario')}>← Vestiário</Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem(TEACHER_REPORT_SESSION_KEY);
                setIsAuthorized(false);
              }}
            >
              Encerrar Sessão
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="rounded-2xl bg-white p-4 shadow-xl">
            <p className="text-xs text-neutral-500">Alunos no relatório</p>
            <p className="font-display text-2xl font-bold text-field-700">{totals.students}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-xl">
            <p className="text-xs text-neutral-500">Táticas geradas</p>
            <p className="font-display text-2xl font-bold text-field-700">{totals.generatedWords}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-xl">
            <p className="text-xs text-neutral-500">Votos comunitários</p>
            <p className="font-display text-2xl font-bold text-field-700">{totals.totalVotes}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-xl">
            <p className="text-xs text-neutral-500">Média de acurácia (estimada)</p>
            <p className="font-display text-2xl font-bold text-field-700">{classAverages.avgEstimatedAccuracy}%</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-xl">
            <p className="text-xs text-neutral-500">Média de engajamento</p>
            <p className="font-display text-2xl font-bold text-field-700">{classAverages.avgEngagementScore}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-xl mb-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              className="md:col-span-2 rounded-xl border border-neutral-300 px-3 py-2"
              placeholder="Buscar aluno..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-xl border border-neutral-300 px-3 py-2"
              value={sortField}
              onChange={(event) => setSortField(event.target.value as SortField)}
            >
              <option value="engagement">Ordenar: Engajamento</option>
              <option value="accuracy">Ordenar: Acurácia</option>
              <option value="approval">Ordenar: Aprovação</option>
              <option value="crowd">Ordenar: Torcida</option>
              <option value="unlocked">Ordenar: Cartas</option>
            </select>
            <select
              className="rounded-xl border border-neutral-300 px-3 py-2"
              value={bnccFilter}
              onChange={(event) => setBnccFilter(event.target.value as BnccCode)}
            >
              <option value="all">BNCC: Todos</option>
              <option value="EF01LP02">BNCC: EF01LP02</option>
              <option value="EF01LP05">BNCC: EF01LP05</option>
              <option value="EF01LP08">BNCC: EF01LP08</option>
            </select>
            <label className="rounded-xl border border-neutral-300 px-3 py-2 flex items-center justify-between text-sm">
              Só risco médio/alto
              <input type="checkbox" checked={riskOnly} onChange={(event) => setRiskOnly(event.target.checked)} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 rounded-2xl bg-white p-4 shadow-xl">
            <h2 className="font-display text-xl font-bold text-field-700 mb-3">Alunos</h2>
            {isLoading ? (
              <p>Carregando...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="text-sm text-neutral-500">Nenhum aluno atende aos filtros atuais.</p>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
                {filteredStudents.map((student) => (
                  <button
                    key={student.playerId}
                    type="button"
                    onClick={() => setSelectedStudentId(student.playerId)}
                    className={`w-full text-left rounded-xl border p-3 transition ${selectedStudent?.playerId === student.playerId ? 'border-field-500 bg-field-50' : 'border-neutral-200 hover:bg-neutral-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-neutral-800">{student.playerName}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${riskClasses[student.riskLevel]}`}>
                        Risco {student.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Engajamento {student.engagementScore} · Acurácia {student.estimatedAccuracy}% · Cartas {student.unlockedCards}/{student.totalCards}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-xl">
            {!selectedStudent ? (
              <p className="text-neutral-500">Selecione um aluno para visualizar detalhes.</p>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-field-700 mb-2">Painel individual — {selectedStudent.playerName}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Acurácia estimada</p>
                    <p className="font-display text-xl font-bold text-field-700">{selectedStudent.estimatedAccuracy}%</p>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Aprovação UGC</p>
                    <p className="font-display text-xl font-bold text-field-700">{selectedStudent.communityApprovalRate}%</p>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Táticas (7 dias)</p>
                    <p className="font-display text-xl font-bold text-field-700">{selectedStudent.generatedWordsLast7Days}</p>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="text-xs text-neutral-500">Torcida</p>
                    <p className="font-display text-xl font-bold text-field-700">{selectedStudent.crowd}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-sm font-bold text-neutral-700 mb-2">Progresso do Álbum</p>
                  <div className="w-full h-3 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-field-500 to-uniform-500" style={{ width: `${(selectedStudent.unlockedCards / selectedStudent.totalCards) * 100}%` }} />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{selectedStudent.unlockedCards}/{selectedStudent.totalCards} cartas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="rounded-xl border border-neutral-200 p-3">
                    <p className="font-display font-bold text-neutral-800 mb-2">Fonemas em destaque</p>
                    {selectedStudent.highlightedPhonemes.length === 0 ? (
                      <p className="text-sm text-neutral-500">Sem dados UGC ainda.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedStudent.highlightedPhonemes.map((phoneme) => (
                          <div key={phoneme.phoneme}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-bold uppercase">{phoneme.phoneme}</span>
                              <span>{phoneme.accuracy}% · {phoneme.attempts} usos</span>
                            </div>
                            <div className="w-full h-2 rounded bg-neutral-200 overflow-hidden">
                              <div className="h-full bg-field-500" style={{ width: `${phoneme.accuracy}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-neutral-200 p-3">
                    <p className="font-display font-bold text-neutral-800 mb-2">Recomendações pedagógicas</p>
                    <ul className="text-sm text-neutral-700 space-y-2 list-disc list-inside">
                      {recommendationForStudent(selectedStudent).map((recommendation) => (
                        <li key={recommendation}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 p-3 mb-5">
                  <p className="font-display font-bold text-neutral-800 mb-2">Foco BNCC do aluno</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {selectedStudent.bnccFocusCodes.map((code) => (
                      <div key={code} className="rounded-lg bg-field-50 p-2 border border-field-100">
                        <p className="font-bold text-sm text-field-700">{code}</p>
                        <p className="text-xs text-neutral-600">{bnccDescriptions[code]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 p-3">
                  <p className="font-display font-bold text-neutral-800 mb-2">BNCC - Referência institucional</p>
                  <div className="space-y-2 text-sm">
                    {BNCC_SKILLS.map((skill) => (
                      <details key={skill.code}>
                        <summary className="cursor-pointer font-bold text-field-700">{skill.code} — {skill.title}</summary>
                        <p className="text-neutral-700 mt-1">{skill.objective}</p>
                        <ul className="list-disc list-inside text-neutral-600 mt-1">
                          {skill.observableEvidence.map((evidence) => (
                            <li key={evidence}>{evidence}</li>
                          ))}
                        </ul>
                      </details>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-white p-4 shadow-xl">
          <h2 className="font-display text-xl font-bold text-field-700 mb-2">Fonemas mais frequentes da turma (UGC)</h2>
          {classTopPhonemes.length === 0 ? (
            <p className="text-sm text-neutral-500">Sem táticas suficientes para ranking fonêmico.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {classTopPhonemes.map((item) => (
                <span key={item.phoneme} className="px-3 py-1 rounded-full bg-uniform-100 text-uniform-700 text-sm font-bold uppercase">
                  {item.phoneme} · {item.count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
