'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGestao } from '@/contexts/GestaoContext';
import type { Prioridade } from '@/lib/gestaoTypes';

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

export default function ProtocoloPage() {
  const { protocolos, setores, tiposDocumento, addProtocolo, servidorAtual } = useGestao();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    assunto: '', tipoDocumentoId: '', interessado: '', cpfCnpj: '',
    setorDestinoId: '', prioridade: 'normal' as Prioridade, prazo: '', descricao: '', isExterno: false,
  });

  const setorOrigem = setores.find(s => s.id === servidorAtual?.setorId) ?? setores[0];

  const filtered = protocolos.filter(p => {
    if (filterStatus && p.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.numero.toLowerCase().includes(q) || p.assunto.toLowerCase().includes(q) || p.interessado.toLowerCase().includes(q);
    }
    return true;
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.assunto || !form.tipoDocumentoId || !form.interessado || !form.setorDestinoId) return;
    const tipo = tiposDocumento.find(t => t.id === form.tipoDocumentoId);
    const destino = setores.find(s => s.id === form.setorDestinoId);
    addProtocolo({
      assunto: form.assunto,
      tipoDocumentoId: form.tipoDocumentoId,
      tipoDocumentoNome: tipo?.nome ?? '',
      interessado: form.interessado,
      cpfCnpj: form.cpfCnpj || undefined,
      setorOrigemId: setorOrigem?.id ?? '',
      setorOrigemNome: setorOrigem?.nome ?? '',
      setorDestinoId: form.setorDestinoId,
      setorDestinoNome: destino?.nome ?? '',
      prioridade: form.prioridade,
      prazo: form.prazo || undefined,
      status: 'aberto',
      descricao: form.descricao || undefined,
      anexos: [],
      sigiloso: form.prioridade === 'sigiloso',
      isExterno: form.isExterno,
    });
    setShowModal(false);
    setForm({ assunto: '', tipoDocumentoId: '', interessado: '', cpfCnpj: '', setorDestinoId: '', prioridade: 'normal', prazo: '', descricao: '', isExterno: false });
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por número, assunto, interessado..."
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow"
        >
          + Novo Protocolo
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Número</th>
                <th className="px-4 py-3 text-left font-medium">Assunto</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Tipo</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Interessado</th>
                <th className="px-4 py-3 text-left font-medium hidden xl:table-cell">Setor Destino</th>
                <th className="px-4 py-3 text-left font-medium">Prioridade</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Data</th>
                <th className="px-4 py-3 text-left font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-indigo-600 whitespace-nowrap">{p.numero}</td>
                  <td className="px-4 py-3 text-slate-700 max-w-[160px] truncate">{p.assunto}</td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{p.tipoDocumentoNome}</td>
                  <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{p.interessado}</td>
                  <td className="px-4 py-3 text-slate-600 hidden xl:table-cell">{p.setorDestinoNome}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prioridadeColors[p.prioridade]}`}>
                      {p.prioridade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell whitespace-nowrap">{formatDate(p.dataCriacao)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/gestao/protocolo/${p.id}`} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-400">Nenhum protocolo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          {filtered.length} protocolo(s) encontrado(s)
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Novo Protocolo</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Assunto *</label>
                <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.assunto} onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Documento *</label>
                  <select required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.tipoDocumentoId} onChange={e => setForm(f => ({ ...f, tipoDocumentoId: e.target.value }))}>
                    <option value="">Selecione...</option>
                    {tiposDocumento.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Prioridade *</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.prioridade} onChange={e => setForm(f => ({ ...f, prioridade: e.target.value as Prioridade }))}>
                    <option value="normal">Normal</option>
                    <option value="urgente">Urgente</option>
                    <option value="sigiloso">Sigiloso</option>
                  </select>
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Setor Destino *</label>
                  <select required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.setorDestinoId} onChange={e => setForm(f => ({ ...f, setorDestinoId: e.target.value }))}>
                    <option value="">Selecione...</option>
                    {setores.filter(s => s.ativo).map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Prazo</label>
                  <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.prazo} onChange={e => setForm(f => ({ ...f, prazo: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Descrição</label>
                <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isExterno" checked={form.isExterno} onChange={e => setForm(f => ({ ...f, isExterno: e.target.checked }))} className="rounded" />
                <label htmlFor="isExterno" className="text-xs text-slate-600">Protocolo externo (cidadão)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Criar Protocolo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
