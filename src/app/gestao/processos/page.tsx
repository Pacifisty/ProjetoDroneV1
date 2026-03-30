'use client';

import { useState } from 'react';
import { useGestao } from '@/contexts/GestaoContext';
import type { TipoProcesso } from '@/lib/gestaoTypes';

const statusColors: Record<string, string> = {
  em_andamento: 'bg-yellow-100 text-yellow-700',
  concluido: 'bg-green-100 text-green-700',
  arquivado: 'bg-slate-100 text-slate-600',
  suspenso: 'bg-red-100 text-red-700',
};
const statusLabel: Record<string, string> = {
  em_andamento: 'Em Andamento', concluido: 'Concluído', arquivado: 'Arquivado', suspenso: 'Suspenso',
};
const tipoLabel: Record<string, string> = {
  compra: 'Compra', licitacao: 'Licitação', contrato: 'Contrato', rh: 'RH',
  fiscalizacao: 'Fiscalização', obra: 'Obra', oficio: 'Ofício',
  requerimento: 'Requerimento', sindicancia: 'Sindicância', interno: 'Interno',
};
const andamentoTipoLabels: Record<string, string> = {
  parecer: 'Parecer', despacho: 'Despacho', decisao: 'Decisão',
  encaminhamento: 'Encaminhamento', abertura: 'Abertura', conclusao: 'Conclusão',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR');
}

export default function ProcessosPage() {
  const { processos, setores, protocolos, addProcesso, addAndamento, servidorAtual } = useGestao();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [andamentoForm, setAndamentoForm] = useState({ descricao: '', tipo: 'despacho' as string });
  const [form, setForm] = useState({
    numero: '', assunto: '', tipo: 'compra' as TipoProcesso,
    interessado: '', cpfCnpj: '', setorOrigemId: '', observacoes: '',
  });

  const selected = processos.find(p => p.id === selectedId);
  const setorOrigem = setores.find(s => s.id === servidorAtual?.setorId) ?? setores[0];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.numero || !form.assunto || !form.interessado) return;
    const proc = addProcesso({
      numero: form.numero,
      assunto: form.assunto,
      tipo: form.tipo,
      interessado: form.interessado,
      cpfCnpj: form.cpfCnpj || undefined,
      setorOrigemId: setorOrigem?.id ?? '',
      setorOrigemNome: setorOrigem?.nome ?? '',
      status: 'em_andamento',
      protocolosVinculados: [],
      observacoes: form.observacoes || undefined,
    });
    setSelectedId(proc.id);
    setShowModal(false);
    setForm({ numero: '', assunto: '', tipo: 'compra', interessado: '', cpfCnpj: '', setorOrigemId: '', observacoes: '' });
  }

  function handleAndamento(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !andamentoForm.descricao) return;
    addAndamento(selectedId, { descricao: andamentoForm.descricao, tipo: andamentoForm.tipo as import('@/lib/gestaoTypes').TipoAndamento });
    setAndamentoForm({ descricao: '', tipo: 'despacho' });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div />
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow">
          + Novo Processo
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {processos.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-left bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-4 ${selectedId === p.id ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-slate-200'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-mono text-xs text-indigo-600 font-semibold">{p.numero}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{statusLabel[p.status]}</span>
              </div>
              <div className="text-sm font-medium text-slate-700 truncate">{p.assunto}</div>
              <div className="text-xs text-slate-500 mt-1">
                {tipoLabel[p.tipo]} · {p.interessado}
              </div>
              <div className="text-xs text-slate-400 mt-1">{formatDate(p.dataCriacao)}</div>
            </button>
          ))}
          {processos.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-3xl mb-2">📁</p>
              <p>Nenhum processo cadastrado.</p>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-mono text-sm font-bold text-indigo-700">{selected.numero}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selected.status]}`}>{statusLabel[selected.status]}</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{tipoLabel[selected.tipo]}</span>
                </div>
                <h3 className="font-bold text-slate-800">{selected.assunto}</h3>
                <p className="text-sm text-slate-500 mt-1">Interessado: {selected.interessado}{selected.cpfCnpj && ` · ${selected.cpfCnpj}`}</p>
                <p className="text-xs text-slate-400 mt-0.5">Criado por {selected.criadoPorNome} em {formatDate(selected.dataCriacao)}</p>
              </div>

              {/* Linked protocols */}
              {selected.protocolosVinculados.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Protocolos Vinculados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.protocolosVinculados.map(pid => {
                      const proto = protocolos.find(p => p.id === pid);
                      return proto ? (
                        <span key={pid} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-mono">{proto.numero}</span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Andamentos */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Andamentos</h4>
                <ol className="relative border-l border-slate-200 space-y-4 ml-2 mb-4">
                  {[...selected.andamentos].reverse().map(a => (
                    <li key={a.id} className="ml-4">
                      <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-indigo-300 border-2 border-white" />
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-600 uppercase">{andamentoTipoLabels[a.tipo] ?? a.tipo}</span>
                        </div>
                        <p className="text-sm text-slate-700">{a.descricao}</p>
                        <p className="text-xs text-slate-400 mt-1">{a.usuarioNome} · {formatDateTime(a.data)}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Add andamento */}
                <form onSubmit={handleAndamento} className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h5 className="text-xs font-semibold text-slate-600">Registrar Andamento</h5>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={andamentoForm.tipo} onChange={e => setAndamentoForm(f => ({ ...f, tipo: e.target.value }))}>
                    {Object.entries(andamentoTipoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <textarea rows={2} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" placeholder="Descreva o andamento..." value={andamentoForm.descricao} onChange={e => setAndamentoForm(f => ({ ...f, descricao: e.target.value }))} />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Registrar
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow p-10 text-center text-slate-400">
              <p className="text-4xl mb-3">📁</p>
              <p>Selecione um processo para ver os detalhes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Novo Processo Administrativo</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Número *</label>
                  <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Ex: PROC-2026-003" value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tipo *</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoProcesso }))}>
                    {Object.entries(tipoLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Assunto *</label>
                <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.assunto} onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Interessado *</label>
                  <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.interessado} onChange={e => setForm(f => ({ ...f, interessado: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">CPF/CNPJ</label>
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.cpfCnpj} onChange={e => setForm(f => ({ ...f, cpfCnpj: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Observações</label>
                <textarea rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Criar Processo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
