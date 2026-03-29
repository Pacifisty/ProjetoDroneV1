'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DroneComponent, SelectedBuild } from '@/lib/types';
import { DRONE_COMPONENTS, CONFIGURATOR_STEPS, ASSEMBLY_PRICE } from '@/lib/droneData';
import { calculateBuildSummary, getComponentsForCategory, getWarningSteps } from '@/lib/compatibility';
import { useCart } from '@/contexts/CartContext';
import DronePreviewPanel from '@/components/DronePreviewPanel';

const COMPONENT_TYPE_MAP: Record<string, keyof SelectedBuild> = {
  frame: 'frame',
  motor: 'motor',
  esc: 'esc',
  'flight-controller': 'flightController',
  propeller: 'propeller',
  battery: 'battery',
  camera: 'camera',
  vtx: 'vtx',
  receiver: 'receiver',
  radio: 'radio',
};

function formatPrice(p: number): string {
  return p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getStepTabClass(isCurrent: boolean, isDone: boolean, hasWarning: boolean): string {
  if (hasWarning) return 'tab-warning-blink border';
  if (isCurrent) return 'bg-orange-500 text-white transition-all';
  if (isDone) return 'bg-green-500/20 text-green-400 border border-green-500/30 transition-all';
  return 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-orange-500/50 transition-all';
}

function ComponentCard({
  component,
  selected,
  onSelect,
}: {
  component: DroneComponent;
  selected: boolean;
  onSelect: (c: DroneComponent) => void;
}) {
  return (
    <button
      onClick={() => onSelect(component)}
      disabled={!component.inStock}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
        selected
          ? 'border-orange-500 bg-orange-500/10'
          : component.inStock
          ? 'border-slate-700 bg-slate-800 hover:border-orange-500/50 hover:bg-slate-700'
          : 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="text-white font-semibold text-sm">{component.name}</div>
          <div className="text-slate-400 text-xs">{component.brand}</div>
        </div>
        <div className="text-right flex-shrink-0">
          {component.price > 0 ? (
            <div className="text-orange-400 font-bold text-sm">{formatPrice(component.price)}</div>
          ) : (
            <div className="text-slate-400 text-xs italic">Incluído</div>
          )}
          {!component.inStock && (
            <div className="text-red-400 text-xs">Sem estoque</div>
          )}
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed mb-2">{component.description}</p>

      <div className="flex flex-wrap gap-1">
        {Object.entries(component.specs).map(([key, val]) => (
          <span
            key={key}
            className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full"
          >
            {key}: {val}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
        <span>⚖️ {component.weight}g</span>
      </div>
    </button>
  );
}

function BuildSummaryPanel({ build }: { build: SelectedBuild }) {
  const summary = calculateBuildSummary(build);
  const componentCount = Object.values(build).filter(Boolean).length;

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 sticky top-20">
      <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
        Resumo da build
      </h3>

      <div className="space-y-2 mb-4">
        {CONFIGURATOR_STEPS.filter((s) => s.componentType !== 'summary').map((step) => {
          const key = COMPONENT_TYPE_MAP[step.id];
          const comp = key ? build[key] : undefined;
          return (
            <div key={step.id} className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{step.label}</span>
              {comp ? (
                <span className="text-white truncate max-w-[120px]">{comp.name}</span>
              ) : (
                <span className="text-slate-600">—</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Peças</span>
          <span className="text-white">{formatPrice(summary.totalPrice - ASSEMBLY_PRICE)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Montagem + configuração</span>
          <span className="text-orange-400">{formatPrice(ASSEMBLY_PRICE)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold border-t border-slate-700 pt-2">
          <span className="text-white">Total</span>
          <span className="text-orange-400">{formatPrice(summary.totalPrice)}</span>
        </div>
      </div>

      {componentCount > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-slate-700 rounded-lg p-2 text-center">
            <div className="text-orange-400 font-bold text-sm">{summary.totalWeight}g</div>
            <div className="text-slate-400 text-xs">Peso</div>
          </div>
          {summary.estimatedFlightTime > 0 && (
            <div className="bg-slate-700 rounded-lg p-2 text-center">
              <div className="text-orange-400 font-bold text-sm">
                ~{summary.estimatedFlightTime}min
              </div>
              <div className="text-slate-400 text-xs">Autonomia</div>
            </div>
          )}
        </div>
      )}

      {summary.warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {summary.warnings.map((w, i) => (
            <div
              key={i}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-yellow-400 text-xs"
            >
              ⚠️ {w}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DroneConfigurator() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-slate-400">Carregando configurador...</div></div>}>
      <DroneConfiguratorInner />
    </Suspense>
  );
}

function DroneConfiguratorInner() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria') || '';
  const { addItem } = useCart();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categoriaParam);
  const [build, setBuild] = useState<SelectedBuild>({});
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '' });
  const [quoteSent, setQuoteSent] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (categoriaParam) {
      setSelectedCategory(categoriaParam);
    }
  }, [categoriaParam]);

  const currentStepData = CONFIGURATOR_STEPS[currentStep];
  const componentType = currentStepData.componentType;

  const filteredComponents =
    componentType !== 'summary'
      ? selectedCategory
        ? getComponentsForCategory(
            DRONE_COMPONENTS.filter((c) => c.type === componentType),
            selectedCategory
          )
        : DRONE_COMPONENTS.filter((c) => c.type === componentType)
      : [];

  const handleSelectComponent = (component: DroneComponent) => {
    const key = COMPONENT_TYPE_MAP[componentType];
    if (!key) return;
    setBuild((prev) => ({
      ...prev,
      [key]: component,
    }));
  };

  const handleRemoveComponent = () => {
    const key = COMPONENT_TYPE_MAP[componentType];
    if (!key) return;
    setBuild((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const selectedForCurrentStep =
    componentType !== 'summary'
      ? build[COMPONENT_TYPE_MAP[componentType] as keyof SelectedBuild]
      : undefined;

  const summary = calculateBuildSummary(build);
  const warningSteps = getWarningSteps(build);

  const handleSendQuote = () => {
    const text = encodeURIComponent(
      `Olá! Gostaria de solicitar um orçamento para meu drone:\n\n` +
        Object.values(build)
          .filter(Boolean)
          .map((c) => `• ${c!.name} – ${formatPrice(c!.price)}`)
          .join('\n') +
        `\n\nTotal estimado: ${formatPrice(summary.totalPrice)}\n` +
        `Nome: ${quoteForm.name}\nEmail: ${quoteForm.email}\nTelefone: ${quoteForm.phone}`
    );
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
    setQuoteSent(true);
  };

  const categories = [
    { id: 'iniciante', label: 'Iniciante', icon: '🚀' },
    { id: 'fpv', label: 'FPV Racing', icon: '⚡' },
    { id: 'freestyle', label: 'Freestyle', icon: '🎯' },
    { id: 'filmagem', label: 'Filmagem', icon: '🎬' },
    { id: 'long-range', label: 'Long Range', icon: '🌐' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configure seu drone</h1>
          <p className="text-slate-400">
            Monte sua build passo a passo. Compatibilidade verificada automaticamente.
          </p>
        </div>

        {/* Category selector */}
        <div className="mb-8">
          <div className="text-sm text-slate-400 mb-3 font-medium">Tipo de drone (opcional)</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step progress */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {CONFIGURATOR_STEPS.map((step, index) => {
              const key = COMPONENT_TYPE_MAP[step.id];
              const isDone = key ? !!build[key] : false;
              const isCurrent = index === currentStep;
              const hasWarning = !isCurrent && warningSteps.has(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 ${getStepTabClass(isCurrent, isDone, hasWarning)}`}
                >
                  {hasWarning && <span>⚠️</span>}
                  {isDone && !isCurrent && !hasWarning && <span>✓</span>}
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {componentType !== 'summary' ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">{currentStepData.label}</h2>
                  <p className="text-slate-400 text-sm">{currentStepData.description}</p>
                  {!currentStepData.required && (
                    <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                      Opcional
                    </span>
                  )}
                </div>

                {selectedForCurrentStep && (
                  <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-green-400 text-sm font-medium">✓ Selecionado: </span>
                      <span className="text-white text-sm">{selectedForCurrentStep.name}</span>
                    </div>
                    <button
                      onClick={handleRemoveComponent}
                      className="text-slate-400 hover:text-red-400 text-xs transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                )}

                {filteredComponents.length === 0 ? (
                  <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
                    <p className="text-slate-400">
                      Nenhum componente disponível para esta categoria.
                    </p>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="mt-3 text-orange-400 hover:text-orange-300 text-sm"
                    >
                      Ver todos os componentes
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredComponents.map((comp) => (
                      <ComponentCard
                        key={comp.id}
                        component={comp}
                        selected={selectedForCurrentStep?.id === comp.id}
                        onSelect={handleSelectComponent}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Summary step
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Resumo da sua build</h2>

                {Object.keys(build).length === 0 ? (
                  <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
                    <p className="text-slate-400">
                      Você ainda não adicionou nenhum componente. Volte e configure sua build.
                    </p>
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
                    >
                      Começar configuração
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-8">
                      {CONFIGURATOR_STEPS.filter((s) => s.componentType !== 'summary').map(
                        (step) => {
                          const key = COMPONENT_TYPE_MAP[step.id];
                          const comp = key ? build[key] : undefined;
                          if (!comp) return null;
                          return (
                            <div
                              key={step.id}
                              className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex items-center justify-between"
                            >
                              <div>
                                <div className="text-slate-400 text-xs mb-0.5">{step.label}</div>
                                <div className="text-white font-medium text-sm">{comp.name}</div>
                                <div className="text-slate-400 text-xs">{comp.brand}</div>
                              </div>
                              <div className="text-right">
                                {comp.price > 0 ? (
                                  <div className="text-orange-400 font-bold">
                                    {formatPrice(comp.price)}
                                  </div>
                                ) : (
                                  <div className="text-slate-400 text-sm italic">Incluído</div>
                                )}
                                <div className="text-slate-400 text-xs">{comp.weight}g</div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
                        <div className="text-orange-400 font-bold text-xl">
                          {formatPrice(summary.totalPrice - ASSEMBLY_PRICE)}
                        </div>
                        <div className="text-slate-400 text-xs mt-1">Peças</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 border border-orange-500/30 text-center">
                        <div className="text-orange-400 font-bold text-xl">
                          {formatPrice(ASSEMBLY_PRICE)}
                        </div>
                        <div className="text-slate-400 text-xs mt-1">Montagem</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
                        <div className="text-orange-400 font-bold text-xl">
                          {summary.totalWeight}g
                        </div>
                        <div className="text-slate-400 text-xs mt-1">Peso total</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
                        <div className="text-orange-400 font-bold text-xl">
                          ~{summary.estimatedFlightTime}min
                        </div>
                        <div className="text-slate-400 text-xs mt-1">Autonomia</div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-slate-300 text-sm mb-1">Total estimado</div>
                          <div className="text-white text-3xl font-bold">
                            {formatPrice(summary.totalPrice)}
                          </div>
                          <div className="text-slate-400 text-xs mt-1">
                            Inclui montagem, configuração e testes
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium px-3 py-1 rounded-full ${
                              summary.compatibilityOk
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {summary.compatibilityOk ? '✓ Compatível' : '⚠️ Verificar'}
                          </div>
                          <div className="text-slate-400 text-xs mt-2">
                            Nível: {summary.performanceLevel}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warnings */}
                    {summary.warnings.length > 0 && (
                      <div className="mb-6 space-y-2">
                        <h4 className="text-yellow-400 font-medium text-sm">
                          ⚠️ Avisos de compatibilidade
                        </h4>
                        {summary.warnings.map((w, i) => (
                          <div
                            key={i}
                            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-yellow-300 text-sm"
                          >
                            {w}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setShowQuoteModal(true)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
                      >
                        🛒 Solicitar orçamento
                      </button>
                      <button
                        onClick={() => {
                          (Object.values(build).filter((c): c is NonNullable<typeof c> => c != null)).forEach((c) => {
                            addItem({ id: c.id, name: c.name, brand: c.brand, type: c.type, price: c.price });
                          });
                          setAddedToCart(true);
                          setTimeout(() => setAddedToCart(false), 3000);
                        }}
                        className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 text-center ${addedToCart ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'}`}
                      >
                        {addedToCart ? '✓ Adicionado!' : '🛍️ Adicionar ao carrinho'}
                      </button>
                      <a
                        href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                          `Olá! Tenho interesse em montar um drone com as seguintes peças:\n\n` +
                            Object.values(build)
                              .filter(Boolean)
                              .map((c) => `• ${c!.name}`)
                              .join('\n') +
                            `\n\nTotal: ${formatPrice(summary.totalPrice)}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 text-center"
                      >
                        💬 Enviar pelo WhatsApp
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="px-6 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                ← Anterior
              </button>
              <button
                onClick={() =>
                  setCurrentStep((s) => Math.min(CONFIGURATOR_STEPS.length - 1, s + 1))
                }
                disabled={currentStep === CONFIGURATOR_STEPS.length - 1}
                className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {currentStep === CONFIGURATOR_STEPS.length - 2 ? 'Ver resumo →' : 'Próximo →'}
              </button>
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="hidden lg:block space-y-6">
            <BuildSummaryPanel build={build} />
            <DronePreviewPanel
                componentType={componentType}
                componentName={selectedForCurrentStep?.name}
              />
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md">
            {!quoteSent ? (
              <>
                <h3 className="text-white font-bold text-xl mb-4">Solicitar orçamento</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Preencha seus dados e entraremos em contato para confirmar o pedido.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-1">Nome</label>
                    <input
                      type="text"
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-1">E-mail</label>
                    <input
                      type="email"
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-1">
                      WhatsApp / Telefone
                    </label>
                    <input
                      type="tel"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSendQuote}
                    disabled={!quoteForm.name || !quoteForm.phone}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Enviar orçamento
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-white font-bold text-xl mb-2">Orçamento enviado!</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Nossa equipe receberá seu orçamento pelo WhatsApp e entrará em contato em breve.
                </p>
                <button
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteSent(false);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-bold"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
