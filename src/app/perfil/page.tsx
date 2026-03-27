'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function PerfilPage() {
  const router = useRouter();
  const { user, loading, signOut, updateProfile } = useAuth();
  const { items, totalItems, totalPrice } = useCart();

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    updateProfile({ name: newName.trim() });
    setSaving(false);
    setEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditing(false);
  };

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-orange-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold border-2 border-orange-400">
                    {user.name[0]?.toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs"
                  title={user.provider === 'google' ? 'Google' : 'E-mail'}>
                  {user.provider === 'google' ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ) : (
                    <span className="text-orange-400">✉</span>
                  )}
                </span>
              </div>

              {/* Name (editable) */}
              {editing ? (
                <div className="mb-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-orange-500 text-sm"
                    onKeyDown={handleNameKeyDown}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs py-1.5 rounded-lg transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-1.5 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-1 flex items-center justify-center gap-2">
                  <h2 className="text-lg font-bold text-white">{user.name}</h2>
                  <button
                    onClick={() => { setNewName(user.name); setEditing(true); }}
                    className="text-slate-400 hover:text-orange-400 transition-colors"
                    aria-label="Editar nome"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}

              <p className="text-slate-400 text-sm mb-1">{user.email}</p>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 mb-5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Membro desde {memberSince}
              </span>

              <div className="border-t border-slate-700 pt-4">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm py-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair da conta
                </button>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="md:col-span-2 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-orange-400">{totalItems}</p>
                <p className="text-slate-400 text-sm mt-1">Itens no carrinho</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-orange-400">
                  R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-slate-400 text-sm mt-1">Total no carrinho</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Ações rápidas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/configurar"
                  className="flex items-center gap-3 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-colors group"
                >
                  <span className="text-2xl">🔧</span>
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">Monte seu drone</p>
                    <p className="text-slate-500 text-xs">Configurador personalizado</p>
                  </div>
                </Link>
                <Link
                  href="/carrinho"
                  className="flex items-center gap-3 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-colors group"
                >
                  <span className="text-2xl">🛒</span>
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">Meu carrinho</p>
                    <p className="text-slate-500 text-xs">
                      {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? 's' : ''}` : 'Vazio'}
                    </p>
                  </div>
                </Link>
                <Link
                  href="/categorias"
                  className="flex items-center gap-3 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-colors group"
                >
                  <span className="text-2xl">🚁</span>
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">Explorar drones</p>
                    <p className="text-slate-500 text-xs">Ver categorias</p>
                  </div>
                </Link>
                <Link
                  href="/suporte"
                  className="flex items-center gap-3 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-colors group"
                >
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">Suporte</p>
                    <p className="text-slate-500 text-xs">Precisa de ajuda?</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Cart Preview */}
            {items.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Carrinho</h3>
                  <Link href="/carrinho" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                    Ver tudo →
                  </Link>
                </div>
                <div className="space-y-3">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                      <div>
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-slate-500 text-xs">{item.brand} · Qtd: {item.quantity}</p>
                      </div>
                      <p className="text-orange-400 text-sm font-semibold">
                        R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-slate-500 text-xs text-center pt-1">+{items.length - 3} item(s) no carrinho</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
