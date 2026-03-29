'use client';

import Image from 'next/image';

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function generatePlaceholderSVG(label: string): string {
  const safeLabel = escapeXml(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#1e293b"/>
  <text x="200" y="215" font-family="sans-serif" font-size="48" font-weight="bold" fill="#f97316" text-anchor="middle" dominant-baseline="middle">${safeLabel}</text>
</svg>`;
  const encoded = encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
  return `data:image/svg+xml;base64,${btoa(encoded)}`;
}

const COMPONENT_IMAGES: Record<string, string> = {
  frame: generatePlaceholderSVG('Frame'),
  motor: generatePlaceholderSVG('Motor'),
  esc: generatePlaceholderSVG('ESC'),
  'flight-controller': generatePlaceholderSVG('FC'),
  propeller: generatePlaceholderSVG('Hélice'),
  battery: generatePlaceholderSVG('Bateria'),
  camera: generatePlaceholderSVG('Câmera'),
  vtx: generatePlaceholderSVG('VTX'),
  receiver: generatePlaceholderSVG('Receptor'),
  radio: generatePlaceholderSVG('Rádio'),
};

const DEFAULT_IMAGE = generatePlaceholderSVG('Drone');

interface DronePreviewPanelProps {
  componentType?: string;
  componentName?: string;
  componentImage?: string;
}

export default function DronePreviewPanel({ componentType, componentName, componentImage }: DronePreviewPanelProps) {
  const imageUrl = componentImage ?? (componentType && COMPONENT_IMAGES[componentType]) ?? DEFAULT_IMAGE;

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
          unoptimized
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
