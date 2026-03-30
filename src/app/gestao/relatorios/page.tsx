'use client';

import { useGestao } from '@/contexts/GestaoContext';

export default function RelatoriosPage() {
  const { protocolos, processos, setores, tiposDocumento } = useGestao();

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const totalMes = protocolos.filter(p => new Date(p.dataCriacao) >= inicioMes).length;
  const concluidosMes = protocolos.filter(p => p.status === 'concluido' && new Date(p.dataCriacao) >= inicioMes).length;
  const urgentes = protocolos.filter(p => p.prioridade === 'urgente' && p.status !== 'concluido').length;
  const vencidos = protocolos.filter(p => {
    if (!p.prazo || p.status === 'concluido' || p.status === 'arquivado') return false;
    return new Date(p.prazo) < hoje;
  }).length;

  // Protocols per month (last 6 months)
  const months: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const count = protocolos.filter(p => {
      const dc = new Date(p.dataCriacao);
      return dc >= d && dc < next;
    }).length;
    months.push({ label, count });
  }
  const maxCount = Math.max(...months.map(m => m.count), 1);

  // By type
  const byType = tiposDocumento.map(t => ({
    nome: t.nome,
    count: protocolos.filter(p => p.tipoDocumentoId === t.id).length,
  })).filter(t => t.count > 0).sort((a, b) => b.count - a.count);

  // By sector (demand)
  const bySetor = setores.map(s => ({
    nome: s.nome,
    count: protocolos.filter(p => p.setorDestinoId === s.id).length,
  })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Protocolos este mês', value: totalMes, color: 'bg-blue-50 border-blue-200 text-blue-700', icon: '📋' },
          { label: 'Concluídos este mês', value: concluidosMes, color: 'bg-green-50 border-green-200 text-green-700', icon: '✅' },
          { label: 'Urgentes pendentes', value: urgentes, color: 'bg-red-50 border-red-200 text-red-700', icon: '🚨' },
          { label: 'Documentos vencidos', value: vencidos, color: 'bg-orange-50 border-orange-200 text-orange-700', icon: '⚠️' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-1 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Protocolos por Mês</h3>
          <button
            onClick={() => window.print()}
            className="text-slate-500 hover:text-slate-700 text-sm border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            🖨️ Imprimir
          </button>
        </div>
        <div className="flex items-end gap-3 h-40">
          {months.map(m => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-slate-600">{m.count}</span>
              <div
                className="w-full bg-indigo-500 rounded-t transition-all"
                style={{ height: `${(m.count / maxCount) * 100}%`, minHeight: m.count > 0 ? '4px' : '0' }}
              />
              <span className="text-xs text-slate-400">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* By type */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Protocolos por Tipo</h3>
          {byType.length === 0 ? (
            <p className="text-slate-400 text-sm">Sem dados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase border-b border-slate-100">
                  <th className="py-2 text-left font-medium">Tipo</th>
                  <th className="py-2 text-right font-medium">Qtd.</th>
                  <th className="py-2 text-right font-medium">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {byType.map(t => (
                  <tr key={t.nome}>
                    <td className="py-2 text-slate-700">{t.nome}</td>
                    <td className="py-2 text-right font-medium text-slate-800">{t.count}</td>
                    <td className="py-2 text-right text-slate-500">
                      {protocolos.length > 0 ? Math.round(t.count / protocolos.length * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* By sector */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Demanda por Setor</h3>
          {bySetor.length === 0 ? (
            <p className="text-slate-400 text-sm">Sem dados.</p>
          ) : (
            <div className="space-y-3">
              {bySetor.map(s => (
                <div key={s.nome}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-700">{s.nome}</span>
                    <span className="font-medium text-slate-800">{s.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 rounded-full h-2 transition-all"
                      style={{ width: `${(s.count / (bySetor[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Processos summary */}
      <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Resumo de Processos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Total', value: processos.length },
            { label: 'Em Andamento', value: processos.filter(p => p.status === 'em_andamento').length },
            { label: 'Concluídos', value: processos.filter(p => p.status === 'concluido').length },
            { label: 'Arquivados', value: processos.filter(p => p.status === 'arquivado').length },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-2xl font-bold text-indigo-700">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
