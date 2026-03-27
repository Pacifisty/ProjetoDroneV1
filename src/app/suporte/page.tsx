import Link from 'next/link';

export const metadata = {
  title: 'Suporte – DroneBuild',
  description: 'Dúvidas frequentes, garantia, política de troca e suporte técnico da DroneBuild.',
};

const FAQ = [
  {
    category: 'Pedido e Configuração',
    questions: [
      {
        q: 'Como funciona o configurador de drones?',
        a: 'O configurador guia você passo a passo na escolha de cada componente do drone. Basta selecionar o tipo de drone, depois escolher frame, motores, ESC, controladora, câmera e mais. O sistema verifica a compatibilidade automaticamente e mostra o preço em tempo real.',
      },
      {
        q: 'Preciso ter conhecimento técnico para usar o configurador?',
        a: 'Não! O configurador foi feito para ser simples. Você pode filtrar por categoria (iniciante, filmagem, FPV etc.) e ver apenas os componentes adequados para cada perfil. Se tiver dúvidas, nossa equipe pode ajudar pelo WhatsApp.',
      },
      {
        q: 'Posso modificar meu pedido após enviar o orçamento?',
        a: 'Sim, enquanto o pedido estiver em análise ou aguardando pagamento. Após a confirmação do pagamento e início da montagem, alterações podem gerar custos extras. Entre em contato o mais rápido possível.',
      },
      {
        q: 'Vocês têm todos os componentes em estoque?',
        a: 'A maioria dos componentes está em estoque. Peças marcadas como "sem estoque" no configurador não estão disponíveis no momento. Você pode entrar em contato para saber a previsão de reposição.',
      },
    ],
  },
  {
    category: 'Montagem e Prazo',
    questions: [
      {
        q: 'Qual é o prazo de montagem?',
        a: 'O prazo de montagem é de 3 a 7 dias úteis após a confirmação do pagamento, dependendo da complexidade da build e do volume de pedidos em andamento. Builds mais simples costumam ser entregues em 3-4 dias.',
      },
      {
        q: 'O que está incluído no serviço de montagem?',
        a: 'Inclui soldagem de todos os componentes, organização de fios, instalação e configuração do firmware (Betaflight ou ArduPilot conforme a build), calibração de sensores, bind do receptor com o rádio (se incluído no pedido) e testes de voo.',
      },
      {
        q: 'Posso acompanhar o andamento da montagem?',
        a: 'Sim. Após confirmar o pedido, você recebe atualizações de status por WhatsApp: pedido recebido, em análise, em montagem, em testes, pronto para envio e enviado.',
      },
      {
        q: 'E se eu quiser apenas as peças, sem montagem?',
        a: 'Atualmente nosso modelo de negócio foca em drones montados e testados. Isso garante qualidade e compatibilidade. Se você é um técnico e precisa apenas das peças, entre em contato para uma solução personalizada.',
      },
    ],
  },
  {
    category: 'Garantia e Troca',
    questions: [
      {
        q: 'Qual é a garantia dos drones?',
        a: 'Oferecemos 6 meses de garantia contra defeitos de fabricação e de montagem. Componentes que apresentarem defeito dentro deste prazo são reparados ou trocados sem custo.',
      },
      {
        q: 'A garantia cobre quedas e danos por uso?',
        a: 'Não. A garantia cobre defeitos de fabricação e erros de montagem. Danos causados por quedas, colisões, uso incorreto ou modificações são de responsabilidade do piloto.',
      },
      {
        q: 'Posso pedir a troca de uma peça que veio com defeito?',
        a: 'Sim. Entre em contato em até 7 dias após o recebimento. Envie fotos ou vídeo do problema. Nós avaliamos e fazemos a troca ou envio de nova peça.',
      },
      {
        q: 'Como funciona o serviço de manutenção?',
        a: 'Oferecemos serviço de manutenção para todos os drones montados pela DroneBuild. Você envia o drone, nossa equipe diagnostica, orça e realiza o reparo. Consulte os preços pelo WhatsApp.',
      },
    ],
  },
  {
    category: 'Pagamento e Envio',
    questions: [
      {
        q: 'Quais formas de pagamento são aceitas?',
        a: 'Aceitamos PIX (com desconto), cartão de crédito (até 12x) e boleto bancário. O pagamento é realizado após confirmação do orçamento e disponibilidade das peças.',
      },
      {
        q: 'Vocês enviam para todo o Brasil?',
        a: 'Sim. Enviamos para todo o Brasil via Correios ou transportadora. O frete é calculado no momento do pedido com base no CEP de destino.',
      },
      {
        q: 'Qual é o prazo de entrega após o envio?',
        a: 'O prazo varia conforme a localidade: regiões Sul e Sudeste costumam receber em 3-5 dias úteis; demais regiões em 5-10 dias úteis após o despacho.',
      },
      {
        q: 'O drone vem com nota fiscal?',
        a: 'Sim. Todos os pedidos acompanham nota fiscal eletrônica (NF-e), que será enviada por e-mail no ato do despacho.',
      },
    ],
  },
];

export default function SuportePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Suporte</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns ou entre em contato com nossa equipe.
          </p>
        </div>
      </section>

      {/* Quick contacts */}
      <section className="py-10 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 flex items-center gap-4 hover:bg-green-500/20 transition-colors"
            >
              <div className="text-3xl">💬</div>
              <div>
                <div className="text-white font-semibold">WhatsApp</div>
                <div className="text-slate-400 text-sm">(11) 99999-9999</div>
                <div className="text-green-400 text-xs mt-1">Seg–Sex, 9h–18h</div>
              </div>
            </a>
            <a
              href="mailto:contato@dronebuild.com.br"
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 flex items-center gap-4 hover:bg-blue-500/20 transition-colors"
            >
              <div className="text-3xl">📧</div>
              <div>
                <div className="text-white font-semibold">E-mail</div>
                <div className="text-slate-400 text-sm">contato@dronebuild.com.br</div>
                <div className="text-blue-400 text-xs mt-1">Resposta em até 24h</div>
              </div>
            </a>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 flex items-center gap-4">
              <div className="text-3xl">⏱️</div>
              <div>
                <div className="text-white font-semibold">Horário de atendimento</div>
                <div className="text-slate-400 text-sm">Segunda a Sexta</div>
                <div className="text-orange-400 text-xs mt-1">9h às 18h (Horário de Brasília)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-10 text-center">
            Dúvidas frequentes
          </h2>

          <div className="space-y-12">
            {FAQ.map((section) => (
              <div key={section.category}>
                <h3 className="text-orange-400 font-bold text-lg mb-6 pb-2 border-b border-slate-700">
                  {section.category}
                </h3>
                <div className="space-y-4">
                  {section.questions.map((item) => (
                    <details
                      key={item.q}
                      className="bg-slate-800 rounded-xl border border-slate-700 group"
                    >
                      <summary className="px-5 py-4 cursor-pointer text-white font-medium text-sm flex items-center justify-between gap-2 list-none">
                        <span>{item.q}</span>
                        <svg
                          className="w-4 h-4 text-slate-400 flex-shrink-0 transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="px-5 pb-4">
                        <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee section */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Nossas garantias</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🛡️',
                title: 'Garantia de 6 meses',
                desc: 'Contra defeitos de fabricação e montagem.',
              },
              {
                icon: '🔒',
                title: 'Compatibilidade 100%',
                desc: 'Verificação técnica antes da montagem.',
              },
              {
                icon: '✈️',
                title: 'Pronto para voar',
                desc: 'Drone testado e configurado antes do envio.',
              },
              {
                icon: '📞',
                title: 'Suporte pós-venda',
                desc: 'Equipe disponível para ajudar após a entrega.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-800 rounded-xl border border-slate-700 p-5 text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-white font-semibold mb-1">{item.title}</div>
                <div className="text-slate-400 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Não encontrou sua resposta?</h2>
          <p className="text-slate-400 mb-8">
            Nossa equipe está pronta para ajudar. Mande uma mensagem e responderemos o mais rápido
            possível.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20drones."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              💬 Falar no WhatsApp
            </a>
            <Link
              href="/configurar"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold"
            >
              Monte seu drone
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
