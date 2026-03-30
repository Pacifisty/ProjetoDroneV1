'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🚁</span>
            <span className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
              DroneBuild
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/categorias"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Categorias
            </Link>
            <Link
              href="/como-funciona"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Como Funciona
            </Link>
            <Link
              href="/suporte"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Suporte
            </Link>
            <Link
              href="/gestao"
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium border border-indigo-800 hover:border-indigo-600 px-3 py-1.5 rounded-lg"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              SisDoc
            </Link>
            <Link
              href="/configurar"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Monte seu drone
            </Link>

            {/* Cart */}
            <Link href="/carrinho" className="relative text-slate-300 hover:text-white transition-colors" aria-label="Carrinho">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <Link href="/perfil" className="flex items-center gap-2 group" aria-label="Perfil">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-500 group-hover:border-orange-400 transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.name[0]?.toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile right actions */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cart (mobile) */}
            <Link href="/carrinho" className="relative text-slate-300 hover:text-white transition-colors" aria-label="Carrinho">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="text-slate-300 hover:text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
          <Link
            href="/categorias"
            className="block text-slate-300 hover:text-white py-2 text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Categorias
          </Link>
          <Link
            href="/como-funciona"
            className="block text-slate-300 hover:text-white py-2 text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Como Funciona
          </Link>
          <Link
            href="/suporte"
            className="block text-slate-300 hover:text-white py-2 text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Suporte
          </Link>
          <Link
            href="/gestao"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 py-2 text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            SisDoc Municipal
          </Link>
          <Link
            href="/configurar"
            className="block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center"
            onClick={() => setMenuOpen(false)}
          >
            Monte seu drone
          </Link>
          {user ? (
            <Link
              href="/perfil"
              className="flex items-center gap-2 py-2 text-sm font-medium text-slate-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-orange-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name[0]?.toUpperCase()}
                </div>
              )}
              Meu Perfil
            </Link>
          ) : (
            <Link
              href="/login"
              className="block text-slate-300 hover:text-white py-2 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Entrar / Criar conta
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
