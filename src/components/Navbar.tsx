'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
              href="/configurar"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Monte seu drone
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
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
            href="/configurar"
            className="block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center"
            onClick={() => setMenuOpen(false)}
          >
            Monte seu drone
          </Link>
        </div>
      )}
    </nav>
  );
}
