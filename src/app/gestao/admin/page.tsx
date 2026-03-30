'use client';

import { useState } from 'react';
import { useGestao } from '@/contexts/GestaoContext';
import type { PerfilUsuario } from '@/lib/gestaoTypes';

type Tab = 'setores' | 'servidores' | 'tipos' | 'logs';

const perfilOptions: PerfilUsuario[] = ['administrador', 'gestor', 'protocolo', 'servidor', 'controladoria', 'juridico', 'rh', 'cidadao', 'auditor'];
const perfilLabel: Record<PerfilUsuario, string> = {
  administrador: 'Administrador', gestor: 'Gestor', protocolo: 'Protocolo',
  servidor: 'Servidor', controladoria: 'Controladoria', juridico: 'Jurídico',
  rh: 'RH', cidadao: 'Cidadão', auditor: 'Auditor',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR');
}

export default function AdminPage() {
  const { setores, servidores, tiposDocumento, auditLogs, orgaos, addSetor, updateSetor, addServidor } = useGestao();
  const [tab, setTab] = useState<Tab>('setores');

  // Setor form
  const [setorForm, setSetorForm] = useState({ nome: '', sigla: '', orgaoId: '' });
  // Servidor form
  const [srvForm, setSrvForm] = useState({ nome: '', email: '', cargo: '', setorId: '', perfil: 'servidor' as PerfilUsuario });

  function handleAddSetor(e: React.FormEvent) {
    e.preventDefault();
    if (!setorForm.nome || !setorForm.sigla || !setorForm.orgaoId) return;
    addSetor({ ...setorForm, ativo: true });
    setSetorForm({ nome: '', sigla: '', orgaoId: '' });
  }

  function handleAddServidor(e: React.FormEvent) {
    e.preventDefault();
    if (!srvForm.nome || !srvForm.email || !srvForm.setorId) return;
    addServidor({ ...srvForm, ativo: true });
    setSrvForm({ nome: '', email: '', cargo: '', setorId: '', perfil: 'servidor' });
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'setores', label: 'Setores', icon: '🏢' },
    { key: 'servidores', label: 'Usuários', icon: '👤' },
    { key: 'tipos', label: 'Tipos de Doc.', icon: '📄' },
    { key: 'logs', label: 'Logs de Auditoria', icon: '🔍' },
  ];

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-indigo-700 shadow' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Setores */}
      {tab === 'setores' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Adicionar Setor</h3>
            <form onSubmit={handleAddSetor} className="flex flex-wrap gap-3">
              <input required className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 flex-1 min-w-[150px]" placeholder="Nome do setor" value={setorForm.nome} onChange={e => setSetorForm(f => ({ ...f, nome: e.target.value }))} />
              <input required className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-24" placeholder="Sigla" value={setorForm.sigla} onChange={e => setSetorForm(f => ({ ...f, sigla: e.target.value }))} />
              <select required className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 flex-1 min-w-[150px]" value={setorForm.orgaoId} onChange={e => setSetorForm(f => ({ ...f, orgaoId: e.target.value }))}>
                <option value="">Órgão...</option>
                {orgaos.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
              </select>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">+ Adicionar</button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Nome</th>
                  <th className="px-4 py-3 text-left font-medium">Sigla</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Órgão</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {setores.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{s.nome}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{s.sigla}</td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                      {orgaos.find(o => o.id === s.orgaoId)?.sigla ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {s.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => updateSetor(s.id, { ativo: !s.ativo })} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                        {s.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Servidores */}
      {tab === 'servidores' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Adicionar Usuário/Servidor</h3>
            <form onSubmit={handleAddServidor} className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <input required className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Nome completo" value={srvForm.nome} onChange={e => setSrvForm(f => ({ ...f, nome: e.target.value }))} />
              <input required type="email" className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="E-mail" value={srvForm.email} onChange={e => setSrvForm(f => ({ ...f, email: e.target.value }))} />
              <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Cargo" value={srvForm.cargo} onChange={e => setSrvForm(f => ({ ...f, cargo: e.target.value }))} />
              <select required className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={srvForm.setorId} onChange={e => setSrvForm(f => ({ ...f, setorId: e.target.value }))}>
                <option value="">Setor...</option>
                {setores.filter(s => s.ativo).map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
              <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={srvForm.perfil} onChange={e => setSrvForm(f => ({ ...f, perfil: e.target.value as PerfilUsuario }))}>
                {perfilOptions.map(p => <option key={p} value={p}>{perfilLabel[p]}</option>)}
              </select>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">+ Adicionar</button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Nome</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">E-mail</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Cargo</th>
                  <th className="px-4 py-3 text-left font-medium">Perfil</th>
                  <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Setor</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {servidores.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{s.nome}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{s.email}</td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{s.cargo ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">{perfilLabel[s.perfil]}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs hidden lg:table-cell">
                      {setores.find(st => st.id === s.setorId)?.nome ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {s.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tipos de Documento */}
      {tab === 'tipos' && (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nome</th>
                <th className="px-4 py-3 text-left font-medium">Prazo (dias)</th>
                <th className="px-4 py-3 text-left font-medium">Sigilo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tiposDocumento.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{t.nome}</td>
                  <td className="px-4 py-3 text-slate-600">{t.prazo} dias</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.sigilo === 'publico' ? 'bg-green-100 text-green-700' :
                      t.sigilo === 'restrito' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {t.sigilo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Logs */}
      {tab === 'logs' && (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-3xl mb-2">🔍</p>
              <p>Nenhum log registrado.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Data/Hora</th>
                  <th className="px-4 py-3 text-left font-medium">Usuário</th>
                  <th className="px-4 py-3 text-left font-medium">Ação</th>
                  <th className="px-4 py-3 text-left font-medium">Recurso</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 100).map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(l.data)}</td>
                    <td className="px-4 py-3 text-slate-700">{l.usuarioNome}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-mono">{l.acao}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{l.recurso}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{l.detalhes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
