'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGestao } from '@/contexts/GestaoContext';
import type { AcaoTramitacao } from '@/lib/gestaoTypes';

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
const acaoLabels: Record<string, string> = {
  encaminhamento: 'Encaminhamento', despacho: 'Despacho', devolucao: 'Devolução', aceite: 'Aceite', conclusao: 'Conclusão',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR');
}
function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function ProtocoloDetailPage() {
  const params = useParams();
  const { protocolos, setores, tramitar, updateProtocolo, loading } = useGestao();
  const [showTramModal, setShowTramModal] = useState(false);
  const [tramForm, setTramForm] = useState({ setorDestino: '', acao: 'encaminhamento' as AcaoTramitacao, observacao: '' });

  const proto = protocolos.find(p => p.id === params.id);

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-4 animate-spin">⏳</p>
        <p className="text-lg font-medium">Carregando...</p>
      </div>
    );
  }

  if (!proto) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-4">📋</p>
        <p className="text-lg font-medium">Protocolo não encontrado.</p>
        <Link href="/gestao/protocolo" className="mt-4 inline-block text-indigo-600 hover:underline">← Voltar à lista</Link>
      </div>
    );
  }

  function handleTramitar(e: React.FormEvent) {
    e.preventDefault();
    if (!tramForm.setorDestino || !proto) return;
    tramitar(proto.id, {
      setorOrigem: proto.setorDestinoId,
      setorDestino: tramForm.setorDestino,
      acao: tramForm.acao,
      observacao: tramForm.observacao || undefined,
    });
    setShowTramModal(false);
    setTramForm({ setorDestino: '', acao: 'encaminhamento', observacao: '' });
  }

  function handleArquivar() {
    if (!proto) return;
    updateProtocolo(proto.id, { status: 'arquivado' });
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/gestao/protocolo" className="text-indigo-600 hover:text-indigo-700 text-sm">← Protocolos</Link>
          </div>
          <h2 className="text-lg font-bold text-slate-800 font-mono">{proto.numero}</h2>
          <p className="text-slate-600 text-sm mt-0.5">{proto.assunto}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${prioridadeColors[proto.prioridade]}`}>{proto.prioridade}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[proto.status]}`}>{statusLabel[proto.status]}</span>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Informações do Protocolo</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {[
            { label: 'Interessado', value: proto.interessado },
            { label: 'CPF/CNPJ', value: proto.cpfCnpj ?? '—' },
            { label: 'Tipo de Documento', value: proto.tipoDocumentoNome },
            { label: 'Setor Origem', value: proto.setorOrigemNome },
            { label: 'Setor Destino', value: proto.setorDestinoNome },
            { label: 'Prazo', value: proto.prazo ? formatDateShort(proto.prazo) : '—' },
            { label: 'Criado por', value: proto.criadoPorNome },
            { label: 'Data de Criação', value: formatDate(proto.dataCriacao) },
            { label: 'Externo', value: proto.isExterno ? 'Sim' : 'Não' },
          ].map(f => (
            <div key={f.label}>
              <dt className="text-slate-400 text-xs">{f.label}</dt>
              <dd className="text-slate-700 font-medium mt-0.5">{f.value}</dd>
            </div>
          ))}
        </div>
        {proto.descricao && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <dt className="text-slate-400 text-xs mb-1">Descrição</dt>
            <dd className="text-slate-700 text-sm">{proto.descricao}</dd>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {proto.status !== 'concluido' && proto.status !== 'arquivado' && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setTramForm(f => ({ ...f, acao: 'encaminhamento' })); setShowTramModal(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            🔄 Encaminhar
          </button>
          <button onClick={() => { setTramForm(f => ({ ...f, acao: 'despacho' })); setShowTramModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            📝 Despachar
          </button>
          <button onClick={() => { setTramForm(f => ({ ...f, acao: 'devolucao' })); setShowTramModal(true); }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            ↩ Devolver
          </button>
          <button onClick={() => { setTramForm(f => ({ ...f, acao: 'conclusao' })); setShowTramModal(true); }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            ✅ Concluir
          </button>
          <button onClick={handleArquivar}
            className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            🗃 Arquivar
          </button>
        </div>
      )}

      {/* Attachments */}
      <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">Anexos ({proto.anexos.length})</h3>
        {proto.anexos.length === 0 ? (
          <p className="text-slate-400 text-sm">Nenhum anexo.</p>
        ) : (
          <ul className="space-y-2">
            {proto.anexos.map(a => (
              <li key={a.id} className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2 text-sm">
                <span className="text-xl">📄</span>
                <div>
                  <div className="font-medium text-slate-700">{a.nome}</div>
                  <div className="text-slate-400 text-xs">{(a.tamanho / 1024).toFixed(1)} KB · {formatDate(a.dataUpload)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tramitação timeline */}
      <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Histórico de Tramitação</h3>
        {proto.tramitacoes.length === 0 ? (
          <p className="text-slate-400 text-sm">Nenhuma tramitação registrada.</p>
        ) : (
          <ol className="relative border-l border-slate-200 space-y-5 ml-3">
            {[...proto.tramitacoes].reverse().map(t => (
              <li key={t.id} className="ml-4">
                <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-indigo-400 border-2 border-white" />
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-indigo-600 uppercase">{acaoLabels[t.acao] ?? t.acao}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{t.setorOrigem} → {t.setorDestino}</span>
                  </div>
                  {t.observacao && <p className="text-sm text-slate-600 mt-1">{t.observacao}</p>}
                  <p className="text-xs text-slate-400 mt-1">{t.usuarioNome} · {formatDate(t.data)}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Tramitação Modal */}
      {showTramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Tramitar Protocolo</h3>
              <button onClick={() => setShowTramModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleTramitar} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Ação *</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={tramForm.acao} onChange={e => setTramForm(f => ({ ...f, acao: e.target.value as AcaoTramitacao }))}>
                  <option value="encaminhamento">Encaminhamento</option>
                  <option value="despacho">Despacho</option>
                  <option value="devolucao">Devolução</option>
                  <option value="aceite">Aceite</option>
                  <option value="conclusao">Conclusão</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Setor Destino *</label>
                <select required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={tramForm.setorDestino} onChange={e => setTramForm(f => ({ ...f, setorDestino: e.target.value }))}>
                  <option value="">Selecione...</option>
                  {setores.filter(s => s.ativo).map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Observação</label>
                <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" value={tramForm.observacao} onChange={e => setTramForm(f => ({ ...f, observacao: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTramModal(false)} className="flex-1 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
