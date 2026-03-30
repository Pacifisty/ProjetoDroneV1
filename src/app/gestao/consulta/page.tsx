'use client';

import { useState } from 'react';
import { gestaoStore } from '@/lib/gestaoStore';
import type { Protocolo } from '@/lib/gestaoTypes';

const statusColors: Record<string, string> = {
  aberto: 'bg-blue-100 text-blue-700',
  em_andamento: 'bg-yellow-100 text-yellow-700',
  concluido: 'bg-green-100 text-green-700',
  arquivado: 'bg-slate-100 text-slate-600',
};
const statusLabel: Record<string, string> = {
  aberto: 'Aberto', em_andamento: 'Em Andamento', concluido: 'Concluído', arquivado: 'Arquivado',
};
const acaoLabels: Record<string, string> = {
  encaminhamento: 'Encaminhamento', despacho: 'Despacho',
  devolucao: 'Devolução', aceite: 'Aceite', conclusao: 'Conclusão',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR');
}
function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function ConsultaPublicaPage() {
  const [numero, setNumero] = useState('');
  const [result, setResult] = useState<Protocolo | null | 'not_found' | 'sigiloso'>(null);
  const [searched, setSearched] = useState(false);

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    if (!numero.trim()) return;
    setSearched(true);
    const all = gestaoStore.getProtocolos();
    const found = all.find(p => p.numero.toLowerCase() === numero.trim().toLowerCase() || p.id === numero.trim());
    if (!found) {
      setResult('not_found');
    } else if (found.sigiloso) {
      setResult('sigiloso');
    } else {
      setResult(found);
    }
  }

  const proto = typeof result === 'object' && result !== null ? result as Protocolo : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-700 font-bold shadow">SD</div>
            <div>
              <h1 className="text-xl font-bold leading-tight">SisDoc Municipal</h1>
              <p className="text-indigo-200 text-xs">Sistema de Gestão Documental e Protocolo Eletrônico</p>
            </div>
          </div>
          <h2 className="text-base font-medium text-indigo-100 mt-3">🌐 Consulta Pública de Protocolos</h2>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-1">Acompanhe seu protocolo</h3>
          <p className="text-slate-500 text-sm mb-4">Digite o número do protocolo para consultar o status e o histórico de tramitação.</p>
          <form onSubmit={handleBuscar} className="flex gap-3">
            <input
              type="text"
              placeholder="Ex: 2026/PROT/000001"
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
              value={numero}
              onChange={e => setNumero(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow"
            >
              Consultar
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && result === 'not_found' && (
          <div className="bg-white rounded-2xl shadow border border-slate-200 p-8 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-slate-700">Protocolo não encontrado.</p>
            <p className="text-slate-400 text-sm mt-1">Verifique o número e tente novamente.</p>
          </div>
        )}

        {searched && result === 'sigiloso' && (
          <div className="bg-white rounded-2xl shadow border border-purple-200 p-8 text-center">
            <p className="text-4xl mb-3">🔒</p>
            <p className="font-semibold text-purple-800">Protocolo sigiloso.</p>
            <p className="text-slate-400 text-sm mt-1">Este protocolo possui restrição de acesso e não pode ser consultado publicamente.</p>
          </div>
        )}

        {proto && (
          <div className="space-y-4">
            {/* Protocol info */}
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <span className="font-mono text-sm font-bold text-indigo-700">{proto.numero}</span>
                  <h3 className="font-bold text-slate-800 text-lg mt-0.5">{proto.assunto}</h3>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[proto.status]}`}>
                  {statusLabel[proto.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Interessado', value: proto.interessado },
                  { label: 'Tipo de Documento', value: proto.tipoDocumentoNome },
                  { label: 'Setor Responsável', value: proto.setorDestinoNome },
                  { label: 'Prioridade', value: proto.prioridade },
                  { label: 'Data de Abertura', value: formatDateShort(proto.dataCriacao) },
                  { label: 'Prazo', value: proto.prazo ? formatDateShort(proto.prazo) : '—' },
                ].map(f => (
                  <div key={f.label}>
                    <dt className="text-slate-400 text-xs">{f.label}</dt>
                    <dd className="text-slate-700 font-medium mt-0.5">{f.value}</dd>
                  </div>
                ))}
              </div>
            </div>

            {/* Tramitação pública */}
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
              <h4 className="font-semibold text-slate-700 mb-4">Histórico de Tramitação</h4>
              {proto.tramitacoes.length === 0 ? (
                <p className="text-slate-400 text-sm">Nenhuma movimentação registrada ainda.</p>
              ) : (
                <ol className="relative border-l border-indigo-200 space-y-4 ml-2">
                  {[...proto.tramitacoes].reverse().map(t => (
                    <li key={t.id} className="ml-4">
                      <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-indigo-400 border-2 border-white" />
                      <div className="bg-slate-50 rounded-xl p-3 text-sm">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold text-indigo-600 uppercase">{acaoLabels[t.acao] ?? t.acao}</span>
                          <span className="text-xs text-slate-400">{t.setorOrigem} → {t.setorDestino}</span>
                        </div>
                        {t.observacao && <p className="text-slate-600">{t.observacao}</p>}
                        <p className="text-xs text-slate-400 mt-1">{formatDate(t.data)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700">
          <strong>ℹ️ Informação:</strong> Esta consulta é pública e exibe apenas protocolos não sigilosos. Para protocolar um novo documento ou obter mais informações, dirija-se ao Protocolo Geral da Prefeitura Municipal.
        </div>
      </main>

      <footer className="text-center py-4 text-slate-400 text-xs border-t border-slate-200">
        SisDoc Municipal — Prefeitura Municipal · Transparência e Eficiência
      </footer>
    </div>
  );
}
