import Link from 'next/link';
import { DRONE_CATEGORIES } from '@/lib/droneData';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-20 pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Montagem profissional · Compatibilidade garantida · Pronto para voar
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Monte seu drone ideal
            <span className="text-orange-400 block mt-2">sem precisar montar sozinho.</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Você escolhe a configuração. Nós verificamos a compatibilidade, montamos, testamos e
            entregamos pronto para voar. Sem complicação.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/configurar"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
            >
              🚀 Monte seu drone agora
            </Link>
            <Link
              href="/como-funciona"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-slate-700 transition-all hover:scale-105"
            >
              Como funciona?
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Drones montados', value: '500+' },
              { label: 'Clientes satisfeitos', value: '98%' },
              { label: 'Prazo de montagem', value: '3-7 dias' },
              { label: 'Garantia', value: '6 meses' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-bold text-orange-400">{stat.value}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Como funciona</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Simples, rápido e sem complicação. Do clique ao drone nas suas mãos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: '🎯',
                title: 'Você escolhe',
                desc: 'Use nosso configurador e monte a build ideal para o seu uso. Passo a passo, sem precisar conhecer eletrônica.',
              },
              {
                step: '02',
                icon: '✅',
                title: 'Verificamos',
                desc: 'Nossa equipe confere cada compatibilidade técnica antes de iniciar a montagem. Zero surpresas.',
              },
              {
                step: '03',
                icon: '🔧',
                title: 'Montamos e testamos',
                desc: 'Montagem profissional, configuração de firmware, calibração e testes de voo antes do envio.',
              },
              {
                step: '04',
                icon: '📦',
                title: 'Entregamos pronto',
                desc: 'Você recebe seu drone montado, testado e ajustado. É só ligar e voar.',
              },
            ].map((item) => (
              <div key={item.step}>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-orange-500/50 transition-colors h-full">
                  <div className="text-orange-400/30 text-5xl font-black mb-4">{item.step}</div>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/como-funciona"
              className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-2 transition-colors"
            >
              Saiba mais sobre o processo →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Escolha sua missão
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Cada piloto tem uma necessidade diferente. Encontre a categoria perfeita para você.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DRONE_CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/configurar?categoria=${cat.id}`}>
                <div className="group bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                      <span
                        className={`text-xs font-medium bg-gradient-to-r ${cat.color} text-transparent bg-clip-text`}
                      >
                        {cat.priceRange}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{cat.description}</p>
                  <ul className="space-y-1">
                    {cat.features.map((f) => (
                      <li key={f} className="text-slate-300 text-xs flex items-center gap-2">
                        <span className="text-orange-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-orange-400 text-sm font-medium group-hover:text-orange-300 transition-colors">
                    Configurar agora →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Por que escolher a{' '}
                <span className="text-orange-400">DroneBuild</span>?
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Muita gente quer um drone personalizado, mas trava na escolha das peças, medo de
                incompatibilidade e dificuldade na montagem. Resolvemos esses três problemas de uma
                vez.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: '🔒',
                    title: 'Compatibilidade garantida',
                    desc: 'Nosso sistema verifica automaticamente se as peças são compatíveis entre si.',
                  },
                  {
                    icon: '🛠️',
                    title: 'Montagem profissional',
                    desc: 'Equipe técnica especializada em drones. Firmware, calibração e testes antes do envio.',
                  },
                  {
                    icon: '💰',
                    title: 'Preço transparente',
                    desc: 'Veja o preço final em tempo real enquanto monta. Sem surpresas na hora do pagamento.',
                  },
                  {
                    icon: '🎓',
                    title: 'Suporte técnico',
                    desc: 'Dúvidas após o voo? Nossa equipe está disponível para ajudar.',
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex gap-4 items-start">
                    <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-slate-400 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              {[
                {
                  name: 'Carlos M.',
                  role: 'Piloto iniciante',
                  text: 'Sempre quis um drone FPV mas tinha medo de comprar peças erradas. O configurador da DroneBuild me guiou em tudo. Chegou montado e voou na primeira tentativa!',
                  rating: 5,
                },
                {
                  name: 'Ana Paula S.',
                  role: 'Fotógrafa profissional',
                  text: 'Precisava de um drone para filmagem com qualidade cinematográfica. A equipe me orientou na escolha e entregou tudo configurado. Resultado incrível.',
                  rating: 5,
                },
                {
                  name: 'Lucas F.',
                  role: 'Piloto FPV intermediário',
                  text: 'Já montei drones antes, mas economizei muito tempo usando a DroneBuild. Eles verificam tudo e ainda fazem o bind do rádio. Vale cada centavo.',
                  rating: 5,
                },
              ].map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <div className="flex gap-1 mb-3">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="text-orange-400">★</span>
                      ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-slate-400 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para montar seu drone ideal?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Use nosso configurador interativo. Você escolhe, nós montamos. Simples assim.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/configurar"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg"
            >
              🚀 Começar agora — é grátis
            </Link>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Quero%20montar%20um%20drone%20personalizado."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              💬 Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
