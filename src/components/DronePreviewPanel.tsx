'use client';

import Image from 'next/image';

const COMPONENT_IMAGES: Record<string, string> = {
  frame: 'https://placehold.co/400x400/1e293b/f97316?text=🛩️+Frame',
  motor: 'https://placehold.co/400x400/1e293b/f97316?text=⚙️+Motor',
  esc: 'https://placehold.co/400x400/1e293b/f97316?text=🔌+ESC',
  'flight-controller': 'https://placehold.co/400x400/1e293b/f97316?text=🧠+FC',
  propeller: 'https://placehold.co/400x400/1e293b/f97316?text=🌀+Hélice',
  battery: 'https://placehold.co/400x400/1e293b/f97316?text=🔋+Bateria',
  camera: 'https://placehold.co/400x400/1e293b/f97316?text=📷+Câmera',
  vtx: 'https://placehold.co/400x400/1e293b/f97316?text=📡+VTX',
  receiver: 'https://placehold.co/400x400/1e293b/f97316?text=📻+Receptor',
  radio: 'https://placehold.co/400x400/1e293b/f97316?text=🎮+Rádio',
};

const DEFAULT_IMAGE = 'https://placehold.co/400x400/1e293b/f97316?text=🚁+Drone';

interface DronePreviewPanelProps {
  componentType?: string;
  componentName?: string;
}

export default function DronePreviewPanel({ componentType, componentName }: DronePreviewPanelProps) {
  const imageUrl = (componentType && COMPONENT_IMAGES[componentType]) ?? DEFAULT_IMAGE;

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
      <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
        🖼️ Visualizar drone / peça
      </h3>

      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
        <Image
          src={imageUrl}
          alt={componentName ?? componentType ?? 'Drone'}
          fill
          className="object-contain"
        />
      </div>

      <div className="mt-3 text-center">
        {componentName ? (
          <p className="text-slate-200 text-sm font-medium truncate">{componentName}</p>
        ) : (
          <p className="text-slate-500 text-xs">Selecione um componente para visualizar</p>
        )}
      </div>
    </div>
  );
}
