'use client';

import { useState } from 'react';
import { DRONE_COMPONENTS, ASSEMBLY_PRICE } from '@/lib/droneData';

type OrderStatus =
  | 'pending'
  | 'analyzing'
  | 'assembling'
  | 'testing'
  | 'ready'
  | 'shipped';

interface MockOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  drone: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em análise',
  assembling: 'Em montagem',
  testing: 'Em testes',
  ready: 'Pronto para envio',
  shipped: 'Enviado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  analyzing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  assembling: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  testing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ready: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  shipped: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'DB-001',
    customer: 'Carlos Mendes',
    email: 'carlos@email.com',
    phone: '(11) 98765-4321',
    drone: 'FPV Racing 5" – iFlight + T-Motor F40',
    total: 2890.5,
    status: 'assembling',
    createdAt: '2024-01-15',
  },
  {
    id: 'DB-002',
    customer: 'Ana Paula Santos',
    email: 'ana@email.com',
    phone: '(21) 99876-5432',
    drone: 'Filmagem 7" – TBS Source One + GoPro Hero 12',
    total: 4650.8,
    status: 'testing',
    createdAt: '2024-01-14',
  },
  {
    id: 'DB-003',
    customer: 'Lucas Ferreira',
    email: 'lucas@email.com',
    phone: '(31) 97654-3210',
    drone: 'Freestyle 5" – Armattan Marmotte + EMAX Eco II',
    total: 3200.0,
    status: 'ready',
    createdAt: '2024-01-13',
  },
  {
    id: 'DB-004',
    customer: 'Maria Costa',
    email: 'maria@email.com',
    phone: '(41) 96543-2109',
    drone: 'Iniciante 5" – Frame Iniciante + BrotherHobby',
    total: 1350.2,
    status: 'pending',
    createdAt: '2024-01-16',
  },
  {
    id: 'DB-005',
    customer: 'Pedro Alves',
    email: 'pedro@email.com',
    phone: '(51) 95432-1098',
    drone: 'Long Range 7" – Diatone Roma F7 + T-Motor MN3110',
    total: 3890.6,
    status: 'shipped',
    createdAt: '2024-01-10',
  },
];

function formatPrice(p: number) {
  return p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function AdminPage() {
  const [orders, setOrders] = useState<MockOrder[]>(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState<'orders' | 'components' | 'stats'>('orders');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    assembling: orders.filter((o) =>
      ['assembling', 'analyzing'].includes(o.status)
    ).length,
    ready: orders.filter((o) => ['ready', 'testing'].includes(o.status)).length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    revenue: orders.reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-slate-400 text-sm">DroneBuild – Gestão de pedidos</p>
          </div>
          <div className="flex gap-2">
            {(['orders', 'components', 'stats'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab === 'orders' ? 'Pedidos' : tab === 'components' ? 'Componentes' : 'Relatórios'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'Pendentes', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Em produção', value: stats.assembling, color: 'text-orange-400' },
            { label: 'Prontos', value: stats.ready, color: 'text-teal-400' },
            { label: 'Enviados', value: stats.shipped, color: 'text-green-400' },
            { label: 'Receita', value: formatPrice(stats.revenue), color: 'text-orange-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4"
            >
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Orders tab */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                Todos ({orders.length})
              </button>
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {STATUS_LABELS[status]} ({orders.filter((o) => o.status === status).length})
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-orange-400 font-mono text-sm font-bold">
                          {order.id}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <div className="text-white font-semibold">{order.customer}</div>
                      <div className="text-slate-400 text-sm">{order.drone}</div>
                      <div className="flex gap-4 mt-1 text-xs text-slate-500">
                        <span>📧 {order.email}</span>
                        <span>📱 {order.phone}</span>
                        <span>📅 {order.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="text-orange-400 font-bold text-lg">
                        {formatPrice(order.total)}
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                      >
                        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
                  <p className="text-slate-400">Nenhum pedido encontrado.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Components tab */}
        {activeTab === 'components' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Catálogo de componentes</h2>
              <span className="text-slate-400 text-sm">{DRONE_COMPONENTS.length} componentes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Nome', 'Marca', 'Tipo', 'Preço', 'Peso', 'Estoque'].map((h) => (
                      <th key={h} className="text-left text-slate-400 font-medium pb-3 pr-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DRONE_COMPONENTS.map((comp) => (
                    <tr
                      key={comp.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 pr-4 text-white font-medium">{comp.name}</td>
                      <td className="py-3 pr-4 text-slate-300">{comp.brand}</td>
                      <td className="py-3 pr-4">
                        <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">
                          {comp.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-orange-400 font-medium">
                        {comp.price > 0 ? formatPrice(comp.price) : '—'}
                      </td>
                      <td className="py-3 pr-4 text-slate-300">{comp.weight}g</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            comp.inStock
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {comp.inStock ? 'Em estoque' : 'Sem estoque'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats tab */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-white font-bold text-lg mb-6">Relatórios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Revenue by status */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-white font-semibold mb-4">Pedidos por status</h3>
                <div className="space-y-3">
                  {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => {
                    const count = orders.filter((o) => o.status === status).length;
                    const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">{STATUS_LABELS[status]}</span>
                          <span className="text-slate-400">
                            {count} pedido{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick metrics */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-white font-semibold mb-4">Métricas</h3>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Ticket médio',
                      value: formatPrice(stats.revenue / Math.max(1, stats.total)),
                    },
                    {
                      label: 'Taxa de montagem por pedido',
                      value: formatPrice(ASSEMBLY_PRICE),
                    },
                    {
                      label: 'Componentes cadastrados',
                      value: DRONE_COMPONENTS.length,
                    },
                    {
                      label: 'Componentes em estoque',
                      value: DRONE_COMPONENTS.filter((c) => c.inStock).length,
                    },
                    {
                      label: 'Componentes sem estoque',
                      value: DRONE_COMPONENTS.filter((c) => !c.inStock).length,
                    },
                  ].map((m) => (
                    <div key={m.label} className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{m.label}</span>
                      <span className="text-white font-semibold">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
