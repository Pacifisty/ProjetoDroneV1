export interface ImageVariation {
  id: string;
  label: string;
  src: string;
  color: string; // hex color used as preview swatch
}

// Maps drone component IDs to their available image variations.
// Replace each `src` with a real image path under /public/assets/drones/
// once the actual drone images are available.
export const imageDatabase: Record<string, ImageVariation[]> = {
  // ── FRAMES ──────────────────────────────────────────────────────────────────
  'frame-beginner-5inch': [
    { id: 'frame-beginner-5inch-black',  label: 'Preto',    src: '/assets/drones/frame-beginner-5inch-black.png',  color: '#334155' },
    { id: 'frame-beginner-5inch-white',  label: 'Branco',   src: '/assets/drones/frame-beginner-5inch-white.png',  color: '#e2e8f0' },
    { id: 'frame-beginner-5inch-orange', label: 'Laranja',  src: '/assets/drones/frame-beginner-5inch-orange.png', color: '#f97316' },
  ],
  'frame-fpv-5inch': [
    { id: 'frame-fpv-5inch-black',  label: 'Preto',   src: '/assets/drones/frame-fpv-5inch-black.png',  color: '#1e293b' },
    { id: 'frame-fpv-5inch-blue',   label: 'Azul',    src: '/assets/drones/frame-fpv-5inch-blue.png',   color: '#3b82f6' },
    { id: 'frame-fpv-5inch-red',    label: 'Vermelho',src: '/assets/drones/frame-fpv-5inch-red.png',    color: '#ef4444' },
    { id: 'frame-fpv-5inch-green',  label: 'Verde',   src: '/assets/drones/frame-fpv-5inch-green.png',  color: '#22c55e' },
  ],
  'frame-freestyle-5inch': [
    { id: 'frame-freestyle-5inch-black',  label: 'Preto',   src: '/assets/drones/frame-freestyle-5inch-black.png',  color: '#1e293b' },
    { id: 'frame-freestyle-5inch-purple', label: 'Roxo',    src: '/assets/drones/frame-freestyle-5inch-purple.png', color: '#a855f7' },
    { id: 'frame-freestyle-5inch-yellow', label: 'Amarelo', src: '/assets/drones/frame-freestyle-5inch-yellow.png', color: '#eab308' },
  ],
  'frame-cinema-7inch': [
    { id: 'frame-cinema-7inch-black', label: 'Preto',  src: '/assets/drones/frame-cinema-7inch-black.png', color: '#0f172a' },
    { id: 'frame-cinema-7inch-gray',  label: 'Cinza',  src: '/assets/drones/frame-cinema-7inch-gray.png',  color: '#64748b' },
    { id: 'frame-cinema-7inch-white', label: 'Branco', src: '/assets/drones/frame-cinema-7inch-white.png', color: '#f1f5f9' },
  ],
  'frame-longrange-7inch': [
    { id: 'frame-longrange-7inch-black', label: 'Preto', src: '/assets/drones/frame-longrange-7inch-black.png', color: '#1e293b' },
    { id: 'frame-longrange-7inch-blue',  label: 'Azul',  src: '/assets/drones/frame-longrange-7inch-blue.png',  color: '#2563eb' },
  ],

  // ── MOTORS ──────────────────────────────────────────────────────────────────
  'motor-beginner-2306': [
    { id: 'motor-beginner-2306-black', label: 'Preto',    src: '/assets/drones/motor-beginner-2306-black.png', color: '#334155' },
    { id: 'motor-beginner-2306-blue',  label: 'Azul',     src: '/assets/drones/motor-beginner-2306-blue.png',  color: '#3b82f6' },
    { id: 'motor-beginner-2306-red',   label: 'Vermelho', src: '/assets/drones/motor-beginner-2306-red.png',   color: '#ef4444' },
  ],
  'motor-fpv-2306': [
    { id: 'motor-fpv-2306-black',  label: 'Preto',   src: '/assets/drones/motor-fpv-2306-black.png',  color: '#1e293b' },
    { id: 'motor-fpv-2306-silver', label: 'Prata',   src: '/assets/drones/motor-fpv-2306-silver.png', color: '#cbd5e1' },
    { id: 'motor-fpv-2306-gold',   label: 'Dourado', src: '/assets/drones/motor-fpv-2306-gold.png',   color: '#ca8a04' },
  ],
  'motor-freestyle-2207': [
    { id: 'motor-freestyle-2207-black',  label: 'Preto',  src: '/assets/drones/motor-freestyle-2207-black.png',  color: '#1e293b' },
    { id: 'motor-freestyle-2207-orange', label: 'Laranja',src: '/assets/drones/motor-freestyle-2207-orange.png', color: '#f97316' },
  ],
  'motor-cinema-2806': [
    { id: 'motor-cinema-2806-black', label: 'Preto', src: '/assets/drones/motor-cinema-2806-black.png', color: '#1e293b' },
    { id: 'motor-cinema-2806-white', label: 'Branco',src: '/assets/drones/motor-cinema-2806-white.png', color: '#f8fafc' },
  ],
  'motor-longrange-3115': [
    { id: 'motor-longrange-3115-black', label: 'Preto', src: '/assets/drones/motor-longrange-3115-black.png', color: '#1e293b' },
    { id: 'motor-longrange-3115-silver',label: 'Prata', src: '/assets/drones/motor-longrange-3115-silver.png',color: '#cbd5e1' },
  ],

  // ── ESCs ────────────────────────────────────────────────────────────────────
  'esc-beginner-30a': [
    { id: 'esc-beginner-30a-blue',  label: 'Azul',  src: '/assets/drones/esc-beginner-30a-blue.png',  color: '#3b82f6' },
    { id: 'esc-beginner-30a-black', label: 'Preto', src: '/assets/drones/esc-beginner-30a-black.png', color: '#1e293b' },
  ],
  'esc-fpv-45a': [
    { id: 'esc-fpv-45a-black',  label: 'Preto', src: '/assets/drones/esc-fpv-45a-black.png',  color: '#1e293b' },
    { id: 'esc-fpv-45a-purple', label: 'Roxo',  src: '/assets/drones/esc-fpv-45a-purple.png', color: '#a855f7' },
  ],
  'esc-freestyle-50a': [
    { id: 'esc-freestyle-50a-black',  label: 'Preto',   src: '/assets/drones/esc-freestyle-50a-black.png',  color: '#1e293b' },
    { id: 'esc-freestyle-50a-orange', label: 'Laranja', src: '/assets/drones/esc-freestyle-50a-orange.png', color: '#f97316' },
  ],
  'esc-cinema-40a': [
    { id: 'esc-cinema-40a-black', label: 'Preto', src: '/assets/drones/esc-cinema-40a-black.png', color: '#1e293b' },
    { id: 'esc-cinema-40a-blue',  label: 'Azul',  src: '/assets/drones/esc-cinema-40a-blue.png',  color: '#2563eb' },
  ],

  // ── FLIGHT CONTROLLERS ───────────────────────────────────────────────────────
  'fc-beginner-f405': [
    { id: 'fc-beginner-f405-green', label: 'Verde', src: '/assets/drones/fc-beginner-f405-green.png', color: '#16a34a' },
    { id: 'fc-beginner-f405-blue',  label: 'Azul',  src: '/assets/drones/fc-beginner-f405-blue.png',  color: '#2563eb' },
  ],
  'fc-fpv-f7': [
    { id: 'fc-fpv-f7-black', label: 'Preto',  src: '/assets/drones/fc-fpv-f7-black.png', color: '#1e293b' },
    { id: 'fc-fpv-f7-red',   label: 'Vermelho',src: '/assets/drones/fc-fpv-f7-red.png',   color: '#dc2626' },
  ],
  'fc-freestyle-f7': [
    { id: 'fc-freestyle-f7-black',  label: 'Preto', src: '/assets/drones/fc-freestyle-f7-black.png',  color: '#1e293b' },
    { id: 'fc-freestyle-f7-purple', label: 'Roxo',  src: '/assets/drones/fc-freestyle-f7-purple.png', color: '#9333ea' },
  ],
  'fc-cinema-f7': [
    { id: 'fc-cinema-f7-black', label: 'Preto', src: '/assets/drones/fc-cinema-f7-black.png', color: '#1e293b' },
    { id: 'fc-cinema-f7-gray',  label: 'Cinza', src: '/assets/drones/fc-cinema-f7-gray.png',  color: '#475569' },
  ],

  // ── PROPELLERS ────────────────────────────────────────────────────────────────
  'prop-beginner-5045': [
    { id: 'prop-beginner-5045-black',  label: 'Preto',    src: '/assets/drones/prop-beginner-5045-black.png',  color: '#1e293b' },
    { id: 'prop-beginner-5045-blue',   label: 'Azul',     src: '/assets/drones/prop-beginner-5045-blue.png',   color: '#3b82f6' },
    { id: 'prop-beginner-5045-orange', label: 'Laranja',  src: '/assets/drones/prop-beginner-5045-orange.png', color: '#f97316' },
    { id: 'prop-beginner-5045-green',  label: 'Verde',    src: '/assets/drones/prop-beginner-5045-green.png',  color: '#22c55e' },
  ],
  'prop-fpv-5152': [
    { id: 'prop-fpv-5152-black',   label: 'Preto',    src: '/assets/drones/prop-fpv-5152-black.png',   color: '#1e293b' },
    { id: 'prop-fpv-5152-yellow',  label: 'Amarelo',  src: '/assets/drones/prop-fpv-5152-yellow.png',  color: '#eab308' },
    { id: 'prop-fpv-5152-red',     label: 'Vermelho', src: '/assets/drones/prop-fpv-5152-red.png',     color: '#ef4444' },
  ],
  'prop-cinema-7045': [
    { id: 'prop-cinema-7045-black', label: 'Preto', src: '/assets/drones/prop-cinema-7045-black.png', color: '#1e293b' },
    { id: 'prop-cinema-7045-cf',    label: 'Carbono',src: '/assets/drones/prop-cinema-7045-cf.png',    color: '#44403c' },
  ],

  // ── BATTERIES ─────────────────────────────────────────────────────────────────
  'bat-4s-1500': [
    { id: 'bat-4s-1500-black',  label: 'Preto',   src: '/assets/drones/bat-4s-1500-black.png',  color: '#1e293b' },
    { id: 'bat-4s-1500-yellow', label: 'Amarelo', src: '/assets/drones/bat-4s-1500-yellow.png', color: '#ca8a04' },
  ],
  'bat-4s-1800': [
    { id: 'bat-4s-1800-black',  label: 'Preto',   src: '/assets/drones/bat-4s-1800-black.png',  color: '#1e293b' },
    { id: 'bat-4s-1800-blue',   label: 'Azul',    src: '/assets/drones/bat-4s-1800-blue.png',   color: '#2563eb' },
    { id: 'bat-4s-1800-green',  label: 'Verde',   src: '/assets/drones/bat-4s-1800-green.png',  color: '#16a34a' },
  ],
  'bat-6s-2200': [
    { id: 'bat-6s-2200-black',  label: 'Preto',   src: '/assets/drones/bat-6s-2200-black.png',  color: '#1e293b' },
    { id: 'bat-6s-2200-red',    label: 'Vermelho',src: '/assets/drones/bat-6s-2200-red.png',    color: '#dc2626' },
  ],
  'bat-4s-3000': [
    { id: 'bat-4s-3000-black', label: 'Preto', src: '/assets/drones/bat-4s-3000-black.png', color: '#1e293b' },
    { id: 'bat-4s-3000-white', label: 'Branco',src: '/assets/drones/bat-4s-3000-white.png', color: '#f1f5f9' },
  ],

  // ── CAMERAS ───────────────────────────────────────────────────────────────────
  'cam-fpv-caddx': [
    { id: 'cam-fpv-caddx-black', label: 'Preto', src: '/assets/drones/cam-fpv-caddx-black.png', color: '#1e293b' },
    { id: 'cam-fpv-caddx-white', label: 'Branco',src: '/assets/drones/cam-fpv-caddx-white.png', color: '#f8fafc' },
  ],
  'cam-cinema-gopro': [
    { id: 'cam-cinema-gopro-black', label: 'Preto',  src: '/assets/drones/cam-cinema-gopro-black.png', color: '#1c1917' },
    { id: 'cam-cinema-gopro-white', label: 'Branco', src: '/assets/drones/cam-cinema-gopro-white.png', color: '#f1f5f9' },
    { id: 'cam-cinema-gopro-blue',  label: 'Azul',   src: '/assets/drones/cam-cinema-gopro-blue.png',  color: '#1d4ed8' },
  ],
  'cam-fpv-digital': [
    { id: 'cam-fpv-digital-black', label: 'Preto', src: '/assets/drones/cam-fpv-digital-black.png', color: '#1e293b' },
    { id: 'cam-fpv-digital-gray',  label: 'Cinza', src: '/assets/drones/cam-fpv-digital-gray.png',  color: '#64748b' },
  ],

  // ── VTX ────────────────────────────────────────────────────────────────────────
  'vtx-analog-500mw': [
    { id: 'vtx-analog-500mw-black', label: 'Preto', src: '/assets/drones/vtx-analog-500mw-black.png', color: '#1e293b' },
    { id: 'vtx-analog-500mw-red',   label: 'Vermelho',src: '/assets/drones/vtx-analog-500mw-red.png',   color: '#dc2626' },
  ],
  'vtx-digital-dji': [
    { id: 'vtx-digital-dji-black', label: 'Preto', src: '/assets/drones/vtx-digital-dji-black.png', color: '#1e293b' },
    { id: 'vtx-digital-dji-white', label: 'Branco',src: '/assets/drones/vtx-digital-dji-white.png', color: '#f8fafc' },
  ],

  // ── RECEIVERS ──────────────────────────────────────────────────────────────────
  'rx-elrs-24g': [
    { id: 'rx-elrs-24g-black',  label: 'Preto',   src: '/assets/drones/rx-elrs-24g-black.png',  color: '#1e293b' },
    { id: 'rx-elrs-24g-orange', label: 'Laranja', src: '/assets/drones/rx-elrs-24g-orange.png', color: '#f97316' },
  ],
  'rx-elrs-900mhz': [
    { id: 'rx-elrs-900mhz-black', label: 'Preto', src: '/assets/drones/rx-elrs-900mhz-black.png', color: '#1e293b' },
    { id: 'rx-elrs-900mhz-blue',  label: 'Azul',  src: '/assets/drones/rx-elrs-900mhz-blue.png',  color: '#2563eb' },
  ],

  // ── RADIOS ────────────────────────────────────────────────────────────────────
  'radio-radiomaster-boxer': [
    { id: 'radio-radiomaster-boxer-black',  label: 'Preto',  src: '/assets/drones/radio-radiomaster-boxer-black.png',  color: '#1e293b' },
    { id: 'radio-radiomaster-boxer-white',  label: 'Branco', src: '/assets/drones/radio-radiomaster-boxer-white.png',  color: '#f1f5f9' },
    { id: 'radio-radiomaster-boxer-orange', label: 'Laranja',src: '/assets/drones/radio-radiomaster-boxer-orange.png', color: '#f97316' },
  ],
  'radio-radiomaster-tx16s': [
    { id: 'radio-radiomaster-tx16s-black', label: 'Preto',  src: '/assets/drones/radio-radiomaster-tx16s-black.png', color: '#1e293b' },
    { id: 'radio-radiomaster-tx16s-blue',  label: 'Azul',   src: '/assets/drones/radio-radiomaster-tx16s-blue.png',  color: '#1d4ed8' },
  ],
};

/** Returns the available image variations for a given component ID. */
export function getVariationsForComponent(componentId: string): ImageVariation[] {
  return imageDatabase[componentId] ?? [];
}
