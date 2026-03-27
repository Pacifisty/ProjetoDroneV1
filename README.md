# ProjetoDroneV1

Plataforma de personalização e venda de drones montados — **DroneBuild**.

## Visão do projeto

Monte seu drone ideal sem precisar montar sozinho. O cliente escolhe os componentes, o sistema verifica compatibilidade automaticamente, e a equipe realiza a montagem completa antes do envio.

> "Você escolhe a configuração. Nós entregamos pronto, testado e ajustado."

## Funcionalidades

### Para o cliente
- **Configurador de drone passo a passo** — Frame, motores, ESC, controladora de voo, hélices, bateria, câmera, VTX, receptor e rádio
- **Validação de compatibilidade em tempo real** — O sistema alerta sobre combinações incompatíveis
- **Preço, peso e autonomia atualizados em tempo real** a cada seleção de componente
- **5 categorias de drone** — Iniciante, FPV Racing, Freestyle, Filmagem, Long Range
- **Solicitação de orçamento** via formulário + envio automático pelo WhatsApp
- **Páginas informativas** — Categorias, Como Funciona, Suporte/FAQ

### Para a equipe
- **Painel administrativo** com gestão de pedidos, status de montagem, catálogo de componentes e relatórios

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── configurar/page.tsx   # Configurador de drone (passo a passo)
│   ├── categorias/page.tsx   # Categorias de drone
│   ├── como-funciona/page.tsx# Como funciona
│   ├── suporte/page.tsx      # Suporte / FAQ
│   └── admin/page.tsx        # Painel administrativo
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
└── lib/
    ├── types.ts              # TypeScript types
    ├── droneData.ts          # Catálogo de componentes e categorias
    └── compatibility.ts      # Regras de compatibilidade e cálculos
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page com hero, categorias, depoimentos e CTA |
| `/configurar` | Configurador interativo passo a passo |
| `/categorias` | Detalhes das 5 categorias de drone |
| `/como-funciona` | Processo de pedido, montagem e entrega |
| `/suporte` | FAQ, garantia, política e contato |
| `/admin` | Painel de gestão de pedidos e componentes |
