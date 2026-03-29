'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

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

type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'no-key';

interface DronePreviewPanelProps {
  componentType?: string;
  componentName?: string;
  componentBrand?: string;
  componentImage?: string;
}

export default function DronePreviewPanel({
  componentType,
  componentName,
  componentBrand,
  componentImage,
}: DronePreviewPanelProps) {
  const getFallback = () =>
    componentImage ||
    (componentType ? COMPONENT_IMAGES[componentType] : undefined) ||
    DEFAULT_IMAGE;

  const [displayImage, setDisplayImage] = useState<string>(DEFAULT_IMAGE);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');

  useEffect(() => {
    const fallback = getFallback();
    setDisplayImage(fallback);
    setApiStatus('idle');

    if (!componentName) return;

    let cancelled = false;
    setApiStatus('loading');

    const params = new URLSearchParams({ name: componentName });
    if (componentBrand) params.set('brand', componentBrand);
    if (componentType) params.set('type', componentType);

    fetch(`/api/preview-asset?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        if (data.error) {
          setApiStatus(data.error.includes('SERPAPI_API_KEY') ? 'no-key' : 'error');
          return;
        }

        const url: string | undefined =
          data.selected?.original || data.selected?.thumbnail;
        if (url) {
          setDisplayImage(url);
          setApiStatus('success');
        } else {
          setApiStatus('error');
        }
      })
      .catch(() => {
        if (!cancelled) setApiStatus('error');
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentName, componentBrand, componentType, componentImage]);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
      <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
        🖼️ Visualizar drone / peça
        {apiStatus === 'loading' && (
          <span className="ml-auto text-xs text-blue-400 animate-pulse">Buscando…</span>
        )}
        {apiStatus === 'success' && (
          <span className="ml-auto text-xs text-green-400">✓ via API</span>
        )}
        {apiStatus === 'error' && (
          <span className="ml-auto text-xs text-yellow-400">⚠ Placeholder</span>
        )}
        {apiStatus === 'no-key' && (
          <span className="ml-auto text-xs text-red-400" title="Configure SERPAPI_API_KEY no .env.local">
            ⚠ Sem chave API
          </span>
        )}
      </h3>

      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
        {apiStatus === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
            <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              <span>Buscando imagem…</span>
            </div>
          </div>
        )}
        <Image
          src={displayImage}
          alt={componentName ?? componentType ?? 'Drone'}
          fill
          unoptimized
          className="object-contain"
          onError={() => {
            setDisplayImage(getFallback());
            if (apiStatus === 'success') setApiStatus('error');
          }}
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