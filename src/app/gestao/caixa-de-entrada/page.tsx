'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGestao } from '@/contexts/GestaoContext';

type Tab = 'todos' | 'aberto' | 'em_andamento' | 'concluido';

const statusColors: Record<string, string> = {
  aberto: 'bg-blue-100 text-blue-700',
  em_andamento: 'bg-yellow-100 text-yellow-700',
  concluido: 'bg-green-100 text-green-700',
  arquivado: 'bg-slate-100 text-slate-600',
};
const statusLabel: Record<string, string> = {
  aberto: 'Aberto', em_andamento: 'Em Andamento', concluido: 'Concluído', arquivado: 'Arquivado',
};
const prioridadeColors: Record<string, string> = {
  normal: 'bg-slate-100 text-slate-600',
  urgente: 'bg-red-100 text-red-700',
  sigiloso: 'bg-purple-100 text-purple-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'aberto', label: 'Aberto' },
  { key: 'em_andamento', label: 'Em Andamento' },
  { key: 'concluido', label: 'Concluído' },
];

export default function CaixaDeEntradaPage() {
  const { protocolos, servidorAtual, setores } = useGestao();
  const [tab, setTab] = useState<Tab>('todos');

  const setorAtual = setores.find(s => s.id === servidorAtual?.setorId);

  // Show protocols destined for current sector
  const inbox = protocolos.filter(p => {
    const matchSetor = !setorAtual || p.setorDestinoId === setorAtual.id;
    const matchTab = tab === 'todos' || p.status === tab;
    return matchSetor && matchTab;
  });

  const urgentes = inbox.filter(p => p.prioridade === 'urgente').length;

  return (
    <div className="space-y-5">
      {/* Info bar */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3">
        <span className="text-2xl">📥</span>
        <div>
          <div className="font-semibold text-indigo-800 text-sm">
            Caixa de Entrada — {setorAtual?.nome ?? 'Todos os Setores'}
          </div>
          <div className="text-indigo-600 text-xs">
            {inbox.length} documento(s) {urgentes > 0 && <span className="text-red-600 font-medium">· {urgentes} urgente(s)</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-indigo-700 shadow' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {inbox.map(p => (
          <Link
            key={p.id}
            href={`/gestao/protocolo/${p.id}`}
            className={`block bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-4 ${
              p.prioridade === 'urgente' ? 'border-red-200 bg-red-50' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs text-indigo-600 font-semibold">{p.numero}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prioridadeColors[p.prioridade]}`}>{p.prioridade}</span>
                  {p.sigiloso && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">🔒 Sigiloso</span>}
                </div>
                <div className="text-slate-700 font-medium text-sm truncate">{p.assunto}</div>
                <div className="text-slate-500 text-xs mt-1">
                  De: {p.setorOrigemNome} · Interessado: {p.interessado}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                  {statusLabel[p.status]}
                </span>
                <div className="text-slate-400 text-xs mt-1">{formatDate(p.dataCriacao)}</div>
                {p.prazo && (
                  <div className="text-xs mt-0.5">
                    Prazo: <span className="font-medium text-slate-600">{formatDate(p.prazo)}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
        {inbox.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">Nenhum documento na caixa de entrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
