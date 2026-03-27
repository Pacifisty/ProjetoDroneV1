'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const COMPONENT_TYPE_LABELS: Record<string, string> = {
  frame: 'Frame',
  motor: 'Motor',
  esc: 'ESC',
  'flight-controller': 'Controladora de Voo',
  propeller: 'Hélice',
  battery: 'Bateria',
  camera: 'Câmera',
  vtx: 'VTX',
  receiver: 'Receptor',
  radio: 'Rádio',
};

export default function CarrinhoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/perfil" className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-white">Carrinho de Compras</h1>
          {totalItems > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-xl font-semibold text-white mb-2">Seu carrinho está vazio</h2>
            <p className="text-slate-400 mb-8">
              Monte seu drone personalizado ou explore nossa loja de componentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/configurar"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Monte seu drone
              </Link>
              <Link
                href="/categorias"
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Ver categorias
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear cart button */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-slate-400 hover:text-red-400 text-sm transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpar carrinho
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
                >
                  {/* Icon / Image */}
                  <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-3xl shrink-0">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      getTypeEmoji(item.type)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-white font-semibold truncate">{item.name}</h3>
                        <p className="text-slate-400 text-sm">{item.brand}</p>
                        {item.type && (
                          <span className="inline-block text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full mt-1">
                            {COMPONENT_TYPE_LABELS[item.type] ?? item.type}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors shrink-0 p-1"
                        aria-label="Remover item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 flex items-center justify-center text-white transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-white text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {item.quantity > 1 && (
                          <p className="text-slate-500 text-xs">
                            R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} × {item.quantity}
                          </p>
                        )}
                        <p className="text-orange-400 font-bold">
                          R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-24">
                <h2 className="text-white font-bold text-lg mb-5">Resumo do Pedido</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                    <span className="text-white">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Montagem</span>
                    <span className="text-green-400 text-xs font-medium">A calcular</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Frete</span>
                    <span className="text-green-400 text-xs font-medium">A calcular</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total estimado</span>
                    <span className="text-orange-400 font-bold text-lg">
                      R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const msg = `Olá! Tenho interesse em comprar os seguintes componentes:%0A%0A` +
                      items.map(i => `• ${i.name} (${i.brand}) × ${i.quantity} — R$ ${(i.price * i.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('%0A') +
                      `%0A%0ATotal: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                    window.open(`https://wa.me/5511999999999?text=${msg}`, '_blank');
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Finalizar via WhatsApp
                </button>

                <Link
                  href="/configurar"
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTypeEmoji(type: string) {
  const map: Record<string, string> = {
    frame: '🔲',
    motor: '⚙️',
    esc: '🔌',
    'flight-controller': '🧠',
    propeller: '🌀',
    battery: '🔋',
    camera: '📷',
    vtx: '📡',
    receiver: '📻',
    radio: '🎮',
  };
  return map[type] ?? '📦';
}
