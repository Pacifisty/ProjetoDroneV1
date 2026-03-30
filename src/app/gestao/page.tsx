'use client';

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

const prioridadeColors: Record<string, string> = {
  normal: 'bg-slate-100 text-slate-600',
  urgente: 'bg-red-100 text-red-700',
  sigiloso: 'bg-purple-100 text-purple-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function GestaoDashboardPage() {
  const { protocolos, processos, servidorAtual } = useGestao();

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString();

  const totalProtocolos = protocolos.length;
  const pendentes = protocolos.filter(p => p.status === 'aberto' || p.status === 'em_andamento').length;
  const concluidosMes = protocolos.filter(p => p.status === 'concluido' && p.dataCriacao >= inicioMes).length;
  const processosAtivos = processos.filter(p => p.status === 'em_andamento').length;

  const recentes = [...protocolos].sort((a, b) => b.dataCriacao.localeCompare(a.dataCriacao)).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white shadow">
        <h2 className="text-xl font-bold">Bem-vindo, {servidorAtual?.nome.split(' ')[0] ?? 'Usuário'}!</h2>
        <p className="text-indigo-100 text-sm mt-1">Sistema Municipal de Gestão Documental e Protocolo Eletrônico</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de Protocolos', value: totalProtocolos, icon: '📋', color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Pendentes', value: pendentes, icon: '⏳', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: 'Concluídos este mês', value: concluidosMes, icon: '✅', color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Processos Ativos', value: processosAtivos, icon: '📁', color: 'bg-purple-50 border-purple-200 text-purple-700' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border p-4 ${stat.color}`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-xs font-medium mt-1 opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/gestao/protocolo" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow">
          + Novo Protocolo
        </Link>
        <Link href="/gestao/busca" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          🔍 Buscar
        </Link>
        <Link href="/gestao/relatorios" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          📊 Relatórios
        </Link>
        <Link href="/gestao/caixa-de-entrada" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          📥 Caixa de Entrada
        </Link>
      </div>

      {/* Recent protocols */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Protocolos Recentes</h3>
          <Link href="/gestao/protocolo" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">Ver todos →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Número</th>
                <th className="px-4 py-3 text-left font-medium">Assunto</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Interessado</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Setor Destino</th>
                <th className="px-4 py-3 text-left font-medium">Prioridade</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentes.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-indigo-600">
                    <Link href={`/gestao/protocolo/${p.id}`} className="hover:underline">{p.numero}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate">{p.assunto}</td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{p.interessado}</td>
                  <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{p.setorDestinoNome}</td>
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
                  <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{formatDate(p.dataCriacao)}</td>
                </tr>
              ))}
              {recentes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Nenhum protocolo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
