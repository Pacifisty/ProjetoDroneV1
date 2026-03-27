import Link from 'next/link';

export const metadata = {
  title: 'Como Funciona – DroneBuild',
  description:
    'Entenda como funciona o processo de personalização, montagem e entrega dos drones da DroneBuild.',
};

const STEPS = [
  {
    number: '01',
    icon: '🎯',
    title: 'Escolha sua configuração',
    description:
      'Use o nosso configurador passo a passo para montar seu drone ideal. Selecione o tipo, os componentes e acompanhe o preço em tempo real.',
    details: [
      'Escolha a categoria: iniciante, FPV, freestyle, filmagem ou long range',
      'Selecione cada peça: frame, motores, ESC, controladora, câmera e mais',
      'O sistema verifica automaticamente a compatibilidade entre os componentes',
      'Veja o preço total atualizado a cada escolha',
    ],
  },
  {
    number: '02',
    icon: '📋',
    title: 'Solicite o orçamento',
    description:
      'Quando estiver satisfeito com a configuração, solicite o orçamento. Você pode enviar pelo WhatsApp ou formulário.',
    details: [
      'Gere o orçamento com um clique',
      'Receba confirmação da nossa equipe em até 24h',
      'Análise técnica gratuita de compatibilidade',
      'Ajustes na configuração, se necessário',
    ],
  },
  {
    number: '03',
    icon: '✅',
    title: 'Confirmação e pagamento',
    description:
      'Nossa equipe confere o pedido, confirma o estoque e envia o link de pagamento seguro.',
    details: [
      'Verificação técnica completa da build',
      'Confirmação de disponibilidade das peças',
      'Pagamento via PIX, cartão ou boleto',
      'Início da montagem após confirmação do pagamento',
    ],
  },
  {
    number: '04',
    icon: '🔧',
    title: 'Montagem profissional',
    description:
      'Nossa equipe técnica realiza a montagem completa do drone com atenção a cada detalhe.',
    details: [
      'Soldagem profissional de todos os componentes',
      'Organização dos cabos e fios',
      'Instalação e configuração do firmware (Betaflight/ArduPilot)',
      'Bind do receptor com o rádio (se incluído no pedido)',
    ],
  },
  {
    number: '05',
    icon: '🧪',
    title: 'Testes e calibração',
    description:
      'Antes de embalar, realizamos testes completos para garantir que tudo funcione perfeitamente.',
    details: [
      'Teste de todos os motores e ESCs',
      'Calibração do acelerômetro e bússola',
      'Configuração de rates e filtros PID',
      'Teste de voo em espaço controlado',
    ],
  },
  {
    number: '06',
    icon: '📦',
    title: 'Embalagem e envio',
    description:
      'O drone é embalado com cuidado e despachado com rastreamento para todo o Brasil.',
    details: [
      'Embalagem reforçada contra impactos',
      'Checklist final de conferência',
      'Envio com seguro e rastreamento',
      'Prazo de entrega após envio: 3-7 dias úteis',
    ],
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Como funciona</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Do configurador ao drone nas suas mãos — um processo simples, transparente e confiável.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700 hidden md:block" />

            <div className="space-y-12">
              {STEPS.map((step, index) => (
                <div key={step.number} className="relative flex gap-8">
                  {/* Step circle */}
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl flex-shrink-0 z-10 shadow-lg shadow-orange-500/30">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-orange-500/30 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl md:hidden">{step.icon}</span>
                      <div>
                        <div className="text-orange-400 text-xs font-bold tracking-wider mb-1">
                          ETAPA {step.number}
                        </div>
                        <h3 className="text-white font-bold text-xl">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">{step.description}</p>
                    <ul className="space-y-1">
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className="text-slate-400 text-sm flex items-start gap-2"
                        >
                          <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow for last item exception */}
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute left-8 -bottom-6 text-slate-600 text-xl transform -translate-x-1/2">
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Order status tracker */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Status do pedido</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Após confirmar o pedido, você acompanha cada etapa em tempo real.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { status: 'Pedido recebido', icon: '📥', color: 'bg-blue-500' },
              { status: 'Em análise', icon: '🔍', color: 'bg-yellow-500' },
              { status: 'Em montagem', icon: '🔧', color: 'bg-orange-500' },
              { status: 'Em testes', icon: '🧪', color: 'bg-purple-500' },
              { status: 'Pronto para envio', icon: '📦', color: 'bg-teal-500' },
              { status: 'Enviado', icon: '🚀', color: 'bg-green-500' },
            ].map((item, i) => (
              <div key={item.status} className="flex items-center gap-2">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center min-w-[120px]">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-white text-xs font-medium">{item.status}</div>
                </div>
                {i < 5 && <span className="text-slate-600 text-xl hidden sm:block">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prazo e garantia */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⏱️',
                title: 'Prazo de montagem',
                desc: '3 a 7 dias úteis após a confirmação do pagamento, dependendo da complexidade da build.',
              },
              {
                icon: '🛡️',
                title: 'Garantia de 6 meses',
                desc: 'Garantia contra defeitos de fabricação e montagem. Componentes com defeito são trocados sem custo.',
              },
              {
                icon: '🔄',
                title: 'Suporte pós-venda',
                desc: 'Nossa equipe está disponível para tirar dúvidas, ajudar em configurações e sugerir upgrades.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-6 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-orange-600 to-orange-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para começar?</h2>
          <p className="text-orange-100 mb-8">
            Use o configurador agora e receba seu drone montado e testado em poucos dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/configurar"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl font-bold"
            >
              🚀 Monte seu drone
            </Link>
            <Link
              href="/suporte"
              className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-3 rounded-xl font-bold"
            >
              Dúvidas frequentes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
