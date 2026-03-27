import Link from 'next/link';
import { DRONE_CATEGORIES } from '@/lib/droneData';

export const metadata = {
  title: 'Categorias de Drones – DroneBuild',
  description:
    'Escolha a categoria de drone ideal para seu uso: iniciante, FPV racing, freestyle, filmagem ou long range.',
};

const CATEGORY_DETAILS = {
  iniciante: {
    whatIs:
      'O drone para iniciantes é projetado para quem está dando os primeiros passos no mundo dos drones. Ele prioriza facilidade de controle, robustez contra quedas e acessibilidade no preço.',
    useFor: ['Aprender a voar', 'Explorações locais', 'Diversão casual', 'Fotografia básica'],
    notFor: ['Voos de alta performance', 'Competições', 'Filmagem profissional'],
    difficulty: 'Fácil',
    priceStart: 'R$ 800',
    buildTime: '3-5 dias',
    highlight: '🚀 Ideal para quem nunca voou antes',
  },
  fpv: {
    whatIs:
      'O drone FPV (First Person View) é pilotado com óculos que transmitem a imagem da câmera em tempo real. A sensação é de estar dentro do drone, voando em alta velocidade.',
    useFor: [
      'Corridas de drone',
      'Voos em alta velocidade',
      'Experiência imersiva',
      'Competições',
    ],
    notFor: ['Filmagem cinematográfica', 'Voos longos', 'Iniciantes sem prática'],
    difficulty: 'Intermediário',
    priceStart: 'R$ 1.500',
    buildTime: '4-6 dias',
    highlight: '⚡ Adrenalina em primeira pessoa',
  },
  freestyle: {
    whatIs:
      'O drone freestyle foi feito para acrobacias. Ele é potente, responsivo e construído para suportar manobras radicais. Perfeito para quem quer ser criativo nos céus.',
    useFor: ['Acrobacias e manobras', 'Vídeos criativos', 'Freestyle FPV', 'Expressão artística'],
    notFor: ['Iniciantes', 'Voos longos', 'Filmagem estabilizada'],
    difficulty: 'Avançado',
    priceStart: 'R$ 1.800',
    buildTime: '5-7 dias',
    highlight: '🎯 Criatividade sem limites',
  },
  filmagem: {
    whatIs:
      'O drone para filmagem prioriza estabilidade, qualidade de imagem e confiabilidade. Com câmeras de alta resolução e sistemas de estabilização, ele captura imagens cinematográficas.',
    useFor: [
      'Filmagem profissional',
      'Fotografia aérea',
      'Eventos',
      'Imóveis',
      'Produções audiovisuais',
    ],
    notFor: ['Corridas', 'Freestyle', 'Ambientes fechados'],
    difficulty: 'Intermediário',
    priceStart: 'R$ 2.500',
    buildTime: '5-7 dias',
    highlight: '🎬 Qualidade cinematográfica',
  },
  'long-range': {
    whatIs:
      'O drone long range é otimizado para autonomia e alcance. Com sistemas de telemetria avançados e GPS, ele permite explorar locais distantes com segurança.',
    useFor: [
      'Exploração de áreas remotas',
      'Mapeamento',
      'Missões longas',
      'Filmagem de longas distâncias',
    ],
    notFor: ['Corridas', 'Freestyle', 'Áreas urbanas sem licença'],
    difficulty: 'Avançado',
    priceStart: 'R$ 2.000',
    buildTime: '5-8 dias',
    highlight: '🌐 Explore sem limites de distância',
  },
};

export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Categorias de drones
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Cada piloto tem uma necessidade. Encontre a categoria perfeita e configure seu drone
            ideal.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {DRONE_CATEGORIES.map((cat) => {
            const details = CATEGORY_DETAILS[cat.id as keyof typeof CATEGORY_DETAILS];
            return (
              <div
                key={cat.id}
                className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${cat.color} p-0.5`} />
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-5xl">{cat.icon}</span>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{cat.name}</h2>
                          <div className="text-slate-400 text-sm">{cat.priceRange}</div>
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed mb-6">{details.whatIs}</p>

                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-6 inline-block">
                        <span className="text-orange-400 text-sm font-medium">
                          {details.highlight}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                            <span className="text-green-400">✓</span> Ideal para
                          </h4>
                          <ul className="space-y-1">
                            {details.useFor.map((u) => (
                              <li key={u} className="text-slate-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">•</span> {u}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                            <span className="text-red-400">✗</span> Não recomendado para
                          </h4>
                          <ul className="space-y-1">
                            {details.notFor.map((n) => (
                              <li key={n} className="text-slate-400 text-sm flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span> {n}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Specs & CTA */}
                    <div className="space-y-4">
                      <div className="bg-slate-700 rounded-2xl p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'Dificuldade', value: details.difficulty },
                            { label: 'A partir de', value: details.priceStart },
                            { label: 'Prazo de montagem', value: details.buildTime },
                            { label: 'Garantia', value: '6 meses' },
                          ].map((spec) => (
                            <div key={spec.label}>
                              <div className="text-slate-400 text-xs mb-0.5">{spec.label}</div>
                              <div className="text-white font-semibold text-sm">{spec.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-600">
                          <div className="text-slate-400 text-xs mb-2">Características</div>
                          <div className="flex flex-wrap gap-1">
                            {cat.features.map((f) => (
                              <span
                                key={f}
                                className="bg-slate-600 text-slate-200 text-xs px-2 py-0.5 rounded-full"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/configurar?categoria=${cat.id}`}
                        className={`block w-full text-center bg-gradient-to-r ${cat.color} text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg`}
                      >
                        Configurar {cat.name} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Não sabe qual escolher?</h2>
          <p className="text-slate-400 mb-8">
            Fale com nossa equipe pelo WhatsApp. Vamos entender suas necessidades e recomendar a
            build ideal para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/configurar"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold"
            >
              Ir ao configurador
            </Link>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Preciso%20de%20ajuda%20para%20escolher%20meu%20drone."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              💬 Pedir ajuda no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
