'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGestao } from '@/contexts/GestaoContext';

const statusColors: Record<string, string> = {
  aberto: 'bg-blue-100 text-blue-700',
  em_andamento: 'bg-yellow-100 text-yellow-700',
  concluido: 'bg-green-100 text-green-700',
  arquivado: 'bg-slate-100 text-slate-600',
};
const statusLabel: Record<string, string> = {
  aberto: 'Aberto', em_andamento: 'Em Andamento', concluido: 'Concluído', arquivado: 'Arquivado',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function BuscaPage() {
  const { protocolos, processos, tiposDocumento, setores } = useGestao();
  const [query, setQuery] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSetor, setFilterSetor] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [searched, setSearched] = useState(false);

  const filteredProtocolos = protocolos.filter(p => {
    if (filterTipo && p.tipoDocumentoId !== filterTipo) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    if (filterSetor && p.setorDestinoId !== filterSetor && p.setorOrigemId !== filterSetor) return false;
    if (filterDateFrom && p.dataCriacao < filterDateFrom) return false;
    if (filterDateTo && p.dataCriacao > filterDateTo + 'T23:59:59') return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        p.numero.toLowerCase().includes(q) ||
        p.assunto.toLowerCase().includes(q) ||
        p.interessado.toLowerCase().includes(q) ||
        (p.cpfCnpj?.toLowerCase().includes(q) ?? false) ||
        (p.descricao?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const filteredProcessos = processos.filter(p => {
    if (filterDateFrom && p.dataCriacao < filterDateFrom) return false;
    if (filterDateTo && p.dataCriacao > filterDateTo + 'T23:59:59') return false;
    if (!query) return false;
    const q = query.toLowerCase();
    return (
      p.numero.toLowerCase().includes(q) ||
      p.assunto.toLowerCase().includes(q) ||
      p.interessado.toLowerCase().includes(q) ||
      (p.cpfCnpj?.toLowerCase().includes(q) ?? false)
    );
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  return (
    <div className="space-y-5">
      {/* Search form */}
      <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
        <h2 className="font-bold text-slate-800 mb-4">Busca Avançada</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Buscar por número, assunto, interessado, CPF/CNPJ, palavras-chave..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
              <option value="">Tipo de documento</option>
              {tiposDocumento.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Status</option>
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="arquivado">Arquivado</option>
            </select>
            <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={filterSetor} onChange={e => setFilterSetor(e.target.value)}>
              <option value="">Setor</option>
              {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-1 col-span-1">
              <input type="date" className="border border-slate-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="De" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
              <input type="date" className="border border-slate-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Até" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow">
              🔍 Buscar
            </button>
            <button type="button" onClick={() => { setQuery(''); setFilterTipo(''); setFilterStatus(''); setFilterSetor(''); setFilterDateFrom(''); setFilterDateTo(''); setSearched(false); }}
              className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">
              Limpar
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          {/* Protocols */}
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-700 text-sm">Protocolos ({filteredProtocolos.length})</h3>
            </div>
            {filteredProtocolos.length === 0 ? (
              <p className="px-5 py-6 text-slate-400 text-sm text-center">Nenhum protocolo encontrado.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Número</th>
                    <th className="px-4 py-2 text-left">Assunto</th>
                    <th className="px-4 py-2 text-left hidden md:table-cell">Interessado</th>
                    <th className="px-4 py-2 text-left hidden md:table-cell">Tipo</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left hidden md:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProtocolos.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-indigo-600">
                        <Link href={`/gestao/protocolo/${p.id}`} className="hover:underline">{p.numero}</Link>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-[160px] truncate">{p.assunto}</td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{p.interessado}</td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{p.tipoDocumentoNome}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{statusLabel[p.status]}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{formatDate(p.dataCriacao)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Processos */}
          {filteredProcessos.length > 0 && (
            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-700 text-sm">Processos ({filteredProcessos.length})</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Número</th>
                    <th className="px-4 py-2 text-left">Assunto</th>
                    <th className="px-4 py-2 text-left hidden md:table-cell">Interessado</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left hidden md:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProcessos.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-indigo-600">{p.numero}</td>
                      <td className="px-4 py-3 text-slate-700 max-w-[160px] truncate">{p.assunto}</td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{p.interessado}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{formatDate(p.dataCriacao)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredProtocolos.length === 0 && filteredProcessos.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>Nenhum resultado encontrado para sua busca.</p>
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>Utilize os filtros acima para realizar uma busca.</p>
        </div>
      )}
    </div>
  );
}
