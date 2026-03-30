'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GestaoProvider, useGestao } from '@/contexts/GestaoContext';

const navItems = [
  { href: '/gestao', label: 'Dashboard', icon: '🏠', exact: true },
  { href: '/gestao/caixa-de-entrada', label: 'Caixa de Entrada', icon: '📥' },
  { href: '/gestao/protocolo', label: 'Protocolos', icon: '📋' },
  { href: '/gestao/tramitacao', label: 'Tramitação', icon: '🔄' },
  { href: '/gestao/processos', label: 'Processos', icon: '📁' },
  { href: '/gestao/busca', label: 'Busca', icon: '🔍' },
  { href: '/gestao/relatorios', label: 'Relatórios', icon: '📊' },
  { href: '/gestao/admin', label: 'Administração', icon: '⚙️' },
  { href: '/gestao/consulta', label: 'Consulta Pública', icon: '🌐' },
];

function perfilLabel(p: string) {
  const map: Record<string, string> = {
    administrador: 'Administrador', gestor: 'Gestor', protocolo: 'Protocolo',
    servidor: 'Servidor', controladoria: 'Controladoria', juridico: 'Jurídico',
    rh: 'RH', cidadao: 'Cidadão', auditor: 'Auditor',
  };
  return map[p] ?? p;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { servidorAtual, servidores, setServidorAtual } = useGestao();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-indigo-700 font-bold text-sm shadow">SD</div>
          <div>
            <div className="text-white font-bold text-base leading-tight">SisDoc</div>
            <div className="text-indigo-300 text-xs">Municipal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User switcher */}
      <div className="px-4 py-4 border-t border-indigo-800">
        <label className="text-indigo-300 text-xs block mb-1">Usuário atual</label>
        <select
          className="w-full bg-indigo-800 text-white text-xs rounded-lg px-2 py-1.5 border border-indigo-600 focus:outline-none"
          value={servidorAtual?.id ?? ''}
          onChange={e => {
            const found = servidores.find(s => s.id === e.target.value);
            setServidorAtual(found ?? null);
          }}
        >
          {servidores.map(s => (
            <option key={s.id} value={s.id}>{s.nome} ({perfilLabel(s.perfil)})</option>
          ))}
        </select>
        <Link href="/" className="block mt-3 text-indigo-300 hover:text-white text-xs transition-colors">
          ← Voltar ao DroneBuild
        </Link>
      </div>
    </div>
  );
}

function GestaoLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { servidorAtual } = useGestao();
  const pathname = usePathname();
  const currentPage = navItems.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href));

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-indigo-900 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-72 bg-indigo-900 h-full shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 text-indigo-300 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-700 p-1"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-slate-800 font-semibold text-sm lg:text-base">
                {currentPage?.label ?? 'SisDoc Municipal'}
              </h1>
              <p className="text-slate-400 text-xs hidden sm:block">Sistema Municipal de Gestão Documental</p>
            </div>
          </div>
          {servidorAtual && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                {servidorAtual.nome[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-slate-700 text-xs font-medium leading-tight">{servidorAtual.nome.split(' ').slice(0, 2).join(' ')}</div>
                <div className="text-slate-400 text-xs">{perfilLabel(servidorAtual.perfil)}</div>
              </div>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function GestaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <GestaoProvider>
      <GestaoLayoutInner>{children}</GestaoLayoutInner>
    </GestaoProvider>
  );
}
