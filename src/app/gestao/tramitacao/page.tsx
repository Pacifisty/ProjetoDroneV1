'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGestao } from '@/contexts/GestaoContext';

const acaoLabels: Record<string, string> = {
  encaminhamento: 'Encaminhamento', despacho: 'Despacho',
  devolucao: 'Devolução', aceite: 'Aceite', conclusao: 'Conclusão',
};
const acaoColors: Record<string, string> = {
  encaminhamento: 'bg-blue-100 text-blue-700',
  despacho: 'bg-indigo-100 text-indigo-700',
  devolucao: 'bg-orange-100 text-orange-700',
  aceite: 'bg-teal-100 text-teal-700',
  conclusao: 'bg-green-100 text-green-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR');
}

export default function TramitacaoPage() {
  const { protocolos } = useGestao();
  const [filterSetor, setFilterSetor] = useState('');
  const [filterAcao, setFilterAcao] = useState('');
  const [filterProtocolo, setFilterProtocolo] = useState('');

  // Flatten all tramitações
  const allTram = protocolos.flatMap(p =>
    p.tramitacoes.map(t => ({ ...t, protocoloNumero: p.numero, protocoloId: p.id }))
  ).sort((a, b) => b.data.localeCompare(a.data));

  const filtered = allTram.filter(t => {
    if (filterSetor && t.setorOrigem !== filterSetor && t.setorDestino !== filterSetor) return false;
    if (filterAcao && t.acao !== filterAcao) return false;
    if (filterProtocolo && !t.protocoloNumero.toLowerCase().includes(filterProtocolo.toLowerCase())) return false;
    return true;
  });

  const setoresUnicos = [...new Set(allTram.flatMap(t => [t.setorOrigem, t.setorDestino]))].filter(Boolean);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Filtrar por número do protocolo..."
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
            value={filterProtocolo}
            onChange={e => setFilterProtocolo(e.target.value)}
          />
          <select
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filterSetor}
            onChange={e => setFilterSetor(e.target.value)}
          >
            <option value="">Todos os setores</option>
            {setoresUnicos.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filterAcao}
            onChange={e => setFilterAcao(e.target.value)}
          >
            <option value="">Todas as ações</option>
            {Object.entries(acaoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-slate-500">{filtered.length} tramitação(ões) encontrada(s)</div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🔄</p>
          <p>Nenhuma tramitação encontrada.</p>
        </div>
      ) : (
        <ol className="relative border-l border-indigo-200 space-y-5 ml-3">
          {filtered.map(t => (
            <li key={t.id} className="ml-4">
              <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-indigo-400 border-2 border-white" />
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${acaoColors[t.acao] ?? 'bg-slate-100 text-slate-600'}`}>
                    {acaoLabels[t.acao] ?? t.acao}
                  </span>
                  <Link href={`/gestao/protocolo/${t.protocoloId}`} className="font-mono text-xs text-indigo-600 hover:underline font-semibold">
                    {t.protocoloNumero}
                  </Link>
                </div>
                <div className="text-sm text-slate-700 flex items-center gap-2">
                  <span className="font-medium">{t.setorOrigem}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-medium">{t.setorDestino}</span>
                </div>
                {t.observacao && <p className="text-sm text-slate-500 mt-1 italic">{t.observacao}</p>}
                <p className="text-xs text-slate-400 mt-2">{t.usuarioNome} · {formatDate(t.data)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
