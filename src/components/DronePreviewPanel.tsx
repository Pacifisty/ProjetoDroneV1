'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ImageVariation } from '@/lib/imageVariations';

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function svgToDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
  return `data:image/svg+xml;base64,${btoa(encoded)}`;
}

const BG = '#1e293b';
const ACCENT = '#f97316';
const MUTED = '#475569';
const LIGHT = '#94a3b8';

function wrapSvg(shapes: string, label: string): string {
  const safeLabel = escapeXml(label);
  return svgToDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">` +
      `<rect width="400" height="400" fill="${BG}"/>` +
      shapes +
      `<text x="200" y="382" font-family="sans-serif" font-size="13" fill="${LIGHT}" text-anchor="middle" opacity="0.8">${safeLabel}</text>` +
      `</svg>`
  );
}

const COMPONENT_IMAGES: Record<string, string> = {
  frame: wrapSvg(
    /* X-frame with 4 motor mounts */
    `<line x1="112" y1="112" x2="288" y2="288" stroke="${ACCENT}" stroke-width="10" stroke-linecap="round"/>` +
    `<line x1="288" y1="112" x2="112" y2="288" stroke="${ACCENT}" stroke-width="10" stroke-linecap="round"/>` +
    `<rect x="176" y="176" width="48" height="48" rx="6" fill="${MUTED}" stroke="${ACCENT}" stroke-width="2"/>` +
    `<circle cx="100" cy="100" r="24" fill="${MUTED}" stroke="${ACCENT}" stroke-width="3"/>` +
    `<circle cx="300" cy="100" r="24" fill="${MUTED}" stroke="${ACCENT}" stroke-width="3"/>` +
    `<circle cx="100" cy="300" r="24" fill="${MUTED}" stroke="${ACCENT}" stroke-width="3"/>` +
    `<circle cx="300" cy="300" r="24" fill="${MUTED}" stroke="${ACCENT}" stroke-width="3"/>` +
    `<circle cx="100" cy="100" r="9" fill="${BG}"/>` +
    `<circle cx="300" cy="100" r="9" fill="${BG}"/>` +
    `<circle cx="100" cy="300" r="9" fill="${BG}"/>` +
    `<circle cx="300" cy="300" r="9" fill="${BG}"/>`,
    'Frame'
  ),

  motor: wrapSvg(
    /* Brushless motor – stator + bell + shaft */
    `<ellipse cx="200" cy="275" rx="66" ry="18" fill="${MUTED}"/>` +
    `<rect x="134" y="175" width="132" height="100" fill="${MUTED}"/>` +
    `<rect x="146" y="118" width="108" height="60" rx="4" fill="${LIGHT}"/>` +
    `<ellipse cx="200" cy="118" rx="54" ry="15" fill="${LIGHT}"/>` +
    `<ellipse cx="200" cy="175" rx="66" ry="18" fill="${LIGHT}" stroke="${ACCENT}" stroke-width="4"/>` +
    `<rect x="194" y="58" width="12" height="64" rx="3" fill="${ACCENT}"/>` +
    `<ellipse cx="200" cy="58" rx="8" ry="5" fill="${ACCENT}"/>` +
    `<line x1="152" y1="195" x2="152" y2="265" stroke="#334155" stroke-width="7"/>` +
    `<line x1="172" y1="190" x2="172" y2="270" stroke="#334155" stroke-width="7"/>` +
    `<line x1="192" y1="188" x2="192" y2="272" stroke="#334155" stroke-width="7"/>` +
    `<line x1="212" y1="190" x2="212" y2="270" stroke="#334155" stroke-width="7"/>` +
    `<line x1="232" y1="195" x2="232" y2="265" stroke="#334155" stroke-width="7"/>` +
    `<line x1="252" y1="200" x2="252" y2="260" stroke="#334155" stroke-width="7"/>` +
    `<ellipse cx="200" cy="275" rx="66" ry="18" fill="none" stroke="${MUTED}" stroke-width="2"/>`,
    'Motor'
  ),

  esc: wrapSvg(
    /* ESC PCB with FETs */
    `<rect x="80" y="95" width="240" height="205" rx="8" fill="#166534"/>` +
    `<rect x="88" y="103" width="224" height="189" rx="6" fill="#15803d" opacity="0.45"/>` +
    `<circle cx="105" cy="120" r="9" fill="${BG}"/>` +
    `<circle cx="295" cy="120" r="9" fill="${BG}"/>` +
    `<circle cx="105" cy="275" r="9" fill="${BG}"/>` +
    `<circle cx="295" cy="275" r="9" fill="${BG}"/>` +
    `<rect x="108" y="148" width="44" height="32" rx="2" fill="#0f172a" stroke="${ACCENT}" stroke-width="1.5"/>` +
    `<rect x="164" y="148" width="44" height="32" rx="2" fill="#0f172a" stroke="${ACCENT}" stroke-width="1.5"/>` +
    `<rect x="220" y="148" width="44" height="32" rx="2" fill="#0f172a" stroke="${ACCENT}" stroke-width="1.5"/>` +
    `<rect x="152" y="196" width="96" height="68" rx="4" fill="#0f172a" stroke="${ACCENT}" stroke-width="2"/>` +
    `<line x1="152" y1="212" x2="136" y2="212" stroke="${LIGHT}" stroke-width="2"/>` +
    `<line x1="152" y1="228" x2="136" y2="228" stroke="${LIGHT}" stroke-width="2"/>` +
    `<line x1="152" y1="244" x2="136" y2="244" stroke="${LIGHT}" stroke-width="2"/>` +
    `<line x1="152" y1="258" x2="136" y2="258" stroke="${LIGHT}" stroke-width="2"/>` +
    `<line x1="248" y1="212" x2="264" y2="212" stroke="${LIGHT}" stroke-width="2"/>` +
    `<line x1="248" y1="228" x2="264" y2="228" stroke="${LIGHT}" stroke-width="2"/>` +
    `<line x1="248" y1="244" x2="264" y2="244" stroke="${LIGHT}" stroke-width="2"/>` +
    `<line x1="248" y1="258" x2="264" y2="258" stroke="${LIGHT}" stroke-width="2"/>` +
    `<rect x="93" y="288" width="22" height="7" rx="1" fill="${ACCENT}"/>` +
    `<rect x="123" y="288" width="22" height="7" rx="1" fill="${ACCENT}"/>` +
    `<rect x="255" y="288" width="22" height="7" rx="1" fill="${ACCENT}"/>` +
    `<rect x="285" y="288" width="22" height="7" rx="1" fill="${ACCENT}"/>`,
    'ESC'
  ),

  'flight-controller': wrapSvg(
    /* Square FC PCB with IMU chip */
    `<rect x="98" y="98" width="204" height="204" rx="10" fill="#1e3a5f"/>` +
    `<rect x="106" y="106" width="188" height="188" rx="8" fill="#1e40af" opacity="0.35"/>` +
    `<circle cx="124" cy="124" r="10" fill="${BG}"/>` +
    `<circle cx="276" cy="124" r="10" fill="${BG}"/>` +
    `<circle cx="124" cy="276" r="10" fill="${BG}"/>` +
    `<circle cx="276" cy="276" r="10" fill="${BG}"/>` +
    `<rect x="162" y="162" width="76" height="76" rx="6" fill="#0f172a" stroke="${ACCENT}" stroke-width="2.5"/>` +
    `<text x="200" y="205" font-family="sans-serif" font-size="12" fill="${ACCENT}" text-anchor="middle" font-weight="bold">IMU</text>` +
    `<rect x="126" y="136" width="48" height="48" rx="3" fill="#0f172a" stroke="${LIGHT}" stroke-width="1.5"/>` +
    `<rect x="252" y="148" width="16" height="10" rx="2" fill="${MUTED}"/>` +
    `<rect x="252" y="168" width="16" height="10" rx="2" fill="${MUTED}"/>` +
    `<rect x="252" y="188" width="16" height="10" rx="2" fill="${MUTED}"/>` +
    `<rect x="186" y="282" width="28" height="18" rx="3" fill="${MUTED}" stroke="${LIGHT}" stroke-width="1"/>` +
    `<circle cx="268" cy="268" r="7" fill="${ACCENT}" opacity="0.85"/>` +
    `<line x1="162" y1="190" x2="174" y2="190" stroke="#93c5fd" stroke-width="1.5" opacity="0.6"/>` +
    `<line x1="200" y1="162" x2="200" y2="150" stroke="#93c5fd" stroke-width="1.5" opacity="0.6"/>` +
    `<line x1="238" y1="190" x2="252" y2="184" stroke="#93c5fd" stroke-width="1.5" opacity="0.6"/>`,
    'FC'
  ),

  propeller: wrapSvg(
    /* 2-blade propeller from above */
    `<circle cx="200" cy="200" r="20" fill="${MUTED}" stroke="${ACCENT}" stroke-width="2.5"/>` +
    `<circle cx="200" cy="200" r="8" fill="${BG}"/>` +
    `<ellipse cx="284" cy="124" rx="58" ry="22" fill="${ACCENT}" opacity="0.88" transform="rotate(-38 284 124)"/>` +
    `<ellipse cx="116" cy="276" rx="58" ry="22" fill="${ACCENT}" opacity="0.88" transform="rotate(-38 116 276)"/>` +
    `<line x1="200" y1="200" x2="258" y2="148" stroke="${ACCENT}" stroke-width="5" stroke-linecap="round"/>` +
    `<line x1="200" y1="200" x2="142" y2="252" stroke="${ACCENT}" stroke-width="5" stroke-linecap="round"/>`,
    'H\u00e9lice'
  ),

  battery: wrapSvg(
    /* LiPo battery pack */
    `<rect x="88" y="128" width="224" height="144" rx="10" fill="${MUTED}"/>` +
    `<rect x="96" y="136" width="208" height="24" rx="5" fill="${LIGHT}" opacity="0.13"/>` +
    `<rect x="312" y="152" width="24" height="44" rx="4" fill="${LIGHT}"/>` +
    `<text x="324" y="179" font-family="sans-serif" font-size="15" fill="${BG}" text-anchor="middle" font-weight="bold">+</text>` +
    `<rect x="92" y="154" width="20" height="40" rx="3" fill="#334155"/>` +
    `<text x="102" y="179" font-family="sans-serif" font-size="15" fill="${LIGHT}" text-anchor="middle" font-weight="bold">-</text>` +
    `<line x1="172" y1="142" x2="172" y2="258" stroke="#334155" stroke-width="3"/>` +
    `<line x1="228" y1="142" x2="228" y2="258" stroke="#334155" stroke-width="3"/>` +
    `<rect x="118" y="152" width="148" height="96" rx="5" fill="#0f172a" opacity="0.4"/>` +
    `<text x="192" y="196" font-family="sans-serif" font-size="14" fill="${ACCENT}" text-anchor="middle" font-weight="bold">LiPo</text>` +
    `<text x="192" y="220" font-family="sans-serif" font-size="12" fill="${LIGHT}" text-anchor="middle">4S 1500mAh</text>` +
    `<rect x="88" y="128" width="224" height="144" rx="10" fill="none" stroke="${ACCENT}" stroke-width="2"/>`,
    'Bateria'
  ),

  camera: wrapSvg(
    /* FPV camera */
    `<rect x="128" y="148" width="144" height="112" rx="8" fill="${MUTED}"/>` +
    `<circle cx="200" cy="200" r="52" fill="#0f172a" stroke="${LIGHT}" stroke-width="3"/>` +
    `<circle cx="200" cy="200" r="40" fill="#0a0a0a" stroke="${MUTED}" stroke-width="2"/>` +
    `<circle cx="200" cy="200" r="30" fill="#0d1117"/>` +
    `<circle cx="183" cy="183" r="11" fill="${LIGHT}" opacity="0.12"/>` +
    `<circle cx="214" cy="186" r="5" fill="${LIGHT}" opacity="0.07"/>` +
    `<circle cx="200" cy="200" r="20" fill="none" stroke="${ACCENT}" stroke-width="2"/>` +
    `<circle cx="200" cy="200" r="6" fill="${ACCENT}"/>` +
    `<rect x="158" y="140" width="44" height="10" rx="3" fill="#334155"/>` +
    `<circle cx="258" cy="162" r="6" fill="#ef4444" opacity="0.8"/>` +
    `<rect x="128" y="148" width="144" height="112" rx="8" fill="none" stroke="${LIGHT}" stroke-width="1"/>`,
    'C\u00e2mera'
  ),

  vtx: wrapSvg(
    /* VTX PCB with SMA antenna connector */
    `<rect x="128" y="128" width="144" height="144" rx="8" fill="#7c2d12"/>` +
    `<rect x="136" y="136" width="128" height="128" rx="6" fill="#9a3412" opacity="0.45"/>` +
    `<circle cx="152" cy="152" r="9" fill="${BG}"/>` +
    `<circle cx="248" cy="152" r="9" fill="${BG}"/>` +
    `<circle cx="152" cy="248" r="9" fill="${BG}"/>` +
    `<circle cx="248" cy="248" r="9" fill="${BG}"/>` +
    `<rect x="192" y="88" width="16" height="44" rx="2" fill="${LIGHT}"/>` +
    `<circle cx="200" cy="84" rx="14" ry="14" fill="${LIGHT}" stroke="${MUTED}" stroke-width="2"/>` +
    `<circle cx="200" cy="84" r="6" fill="${BG}"/>` +
    `<rect x="163" y="158" width="74" height="58" rx="4" fill="#0f172a" stroke="${ACCENT}" stroke-width="2"/>` +
    `<text x="200" y="191" font-family="sans-serif" font-size="12" fill="${ACCENT}" text-anchor="middle">VTX</text>` +
    `<rect x="144" y="183" width="12" height="18" rx="2" fill="${MUTED}"/>` +
    `<rect x="244" y="183" width="12" height="18" rx="2" fill="${MUTED}"/>` +
    `<circle cx="252" cy="248" r="7" fill="${ACCENT}" opacity="0.9"/>`,
    'VTX'
  ),

  receiver: wrapSvg(
    /* ELRS receiver with two antennas */
    `<rect x="140" y="158" width="120" height="84" rx="6" fill="#312e81"/>` +
    `<line x1="162" y1="158" x2="136" y2="72" stroke="${LIGHT}" stroke-width="3"/>` +
    `<circle cx="135" cy="70" r="5" fill="${ACCENT}"/>` +
    `<line x1="238" y1="158" x2="264" y2="72" stroke="${LIGHT}" stroke-width="3"/>` +
    `<circle cx="265" cy="70" r="5" fill="${ACCENT}"/>` +
    `<rect x="165" y="172" width="70" height="54" rx="3" fill="#0f172a" stroke="${ACCENT}" stroke-width="1.5"/>` +
    `<text x="200" y="202" font-family="sans-serif" font-size="11" fill="${ACCENT}" text-anchor="middle">ELRS</text>` +
    `<circle cx="154" cy="188" r="6" fill="#22c55e" opacity="0.9"/>` +
    `<rect x="148" y="236" width="12" height="6" rx="1" fill="${ACCENT}"/>` +
    `<rect x="168" y="236" width="12" height="6" rx="1" fill="${ACCENT}"/>` +
    `<rect x="188" y="236" width="12" height="6" rx="1" fill="${ACCENT}"/>` +
    `<rect x="208" y="236" width="12" height="6" rx="1" fill="${ACCENT}"/>` +
    `<rect x="228" y="236" width="12" height="6" rx="1" fill="${ACCENT}"/>` +
    `<rect x="140" y="158" width="120" height="84" rx="6" fill="none" stroke="${LIGHT}" stroke-width="1"/>`,
    'Receptor'
  ),

  radio: wrapSvg(
    /* Radio transmitter / controller */
    `<rect x="78" y="138" width="244" height="162" rx="14" fill="${MUTED}"/>` +
    `<rect x="78" y="222" width="58" height="78" rx="12" fill="#334155"/>` +
    `<rect x="264" y="222" width="58" height="78" rx="12" fill="#334155"/>` +
    `<rect x="128" y="152" width="144" height="72" rx="5" fill="#0f172a"/>` +
    `<rect x="134" y="157" width="132" height="62" rx="3" fill="#0d2137"/>` +
    `<polyline points="140,188 160,172 180,194 200,168 220,184 242,170 262,190" fill="none" stroke="${ACCENT}" stroke-width="2.5"/>` +
    `<circle cx="118" cy="258" r="22" fill="#334155" stroke="${LIGHT}" stroke-width="2"/>` +
    `<circle cx="118" cy="258" r="11" fill="${MUTED}"/>` +
    `<circle cx="282" cy="258" r="22" fill="#334155" stroke="${LIGHT}" stroke-width="2"/>` +
    `<circle cx="282" cy="258" r="11" fill="${MUTED}"/>` +
    `<rect x="166" y="95" width="8" height="46" rx="2" fill="${LIGHT}"/>` +
    `<rect x="226" y="95" width="8" height="46" rx="2" fill="${LIGHT}"/>` +
    `<circle cx="188" cy="250" r="8" fill="#3b82f6"/>` +
    `<circle cx="212" cy="250" r="8" fill="#ef4444"/>` +
    `<rect x="78" y="138" width="244" height="162" rx="14" fill="none" stroke="${LIGHT}" stroke-width="1"/>`,
    'R\u00e1dio'
  ),
};

const DEFAULT_IMAGE = wrapSvg(
  /* Generic drone top-down silhouette */
  `<line x1="112" y1="112" x2="288" y2="288" stroke="${ACCENT}" stroke-width="8" stroke-linecap="round"/>` +
  `<line x1="288" y1="112" x2="112" y2="288" stroke="${ACCENT}" stroke-width="8" stroke-linecap="round"/>` +
  `<circle cx="200" cy="200" r="24" fill="${MUTED}" stroke="${ACCENT}" stroke-width="2"/>` +
  `<circle cx="100" cy="100" r="22" fill="${MUTED}" stroke="${ACCENT}" stroke-width="2"/>` +
  `<circle cx="300" cy="100" r="22" fill="${MUTED}" stroke="${ACCENT}" stroke-width="2"/>` +
  `<circle cx="100" cy="300" r="22" fill="${MUTED}" stroke="${ACCENT}" stroke-width="2"/>` +
  `<circle cx="300" cy="300" r="22" fill="${MUTED}" stroke="${ACCENT}" stroke-width="2"/>` +
  `<ellipse cx="100" cy="100" rx="18" ry="6" fill="${ACCENT}" opacity="0.6" transform="rotate(-45 100 100)"/>` +
  `<ellipse cx="300" cy="100" rx="18" ry="6" fill="${ACCENT}" opacity="0.6" transform="rotate(45 300 100)"/>` +
  `<ellipse cx="100" cy="300" rx="18" ry="6" fill="${ACCENT}" opacity="0.6" transform="rotate(45 100 300)"/>` +
  `<ellipse cx="300" cy="300" rx="18" ry="6" fill="${ACCENT}" opacity="0.6" transform="rotate(-45 300 300)"/>`,
  'Drone'
);

type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'no-key';

interface DronePreviewPanelProps {
  componentType?: string;
  componentName?: string;
  componentBrand?: string;
  componentImage?: string;
  /** Available image colour / style variations for the current component. */
  variations?: ImageVariation[];
  /** ID of the currently selected variation. */
  selectedVariationId?: string;
  /** Called when the user picks a different variation. */
  onVariationChange?: (variationId: string) => void;
}

export default function DronePreviewPanel({
  componentType,
  componentName,
  componentBrand,
  componentImage,
  variations = [],
  selectedVariationId,
  onVariationChange,
}: DronePreviewPanelProps) {
  const selectedVariation = variations.find((v) => v.id === selectedVariationId);

  const getFallback = () =>
    selectedVariation?.src ||
    componentImage ||
    (componentType ? COMPONENT_IMAGES[componentType] : undefined) ||
    DEFAULT_IMAGE;

  const [displayImage, setDisplayImage] = useState<string>(DEFAULT_IMAGE);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');

  useEffect(() => {
    // If a local variation is chosen, show it immediately without calling the API.
    if (selectedVariation) {
      setDisplayImage(selectedVariation.src);
      setApiStatus('idle');
      return;
    }

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
  }, [componentName, componentBrand, componentType, componentImage, selectedVariationId]);

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

      {/* Variation colour swatches */}
      {variations.length > 0 && onVariationChange && (
        <div className="mt-3">
          <p className="text-slate-400 text-xs mb-2">Cor / variação:</p>
          <div className="flex flex-wrap gap-2">
            {variations.map((v) => {
              const isSelected = v.id === selectedVariationId;
              return (
                <button
                  key={v.id}
                  onClick={() => onVariationChange(v.id)}
                  title={v.label}
                  className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                    isSelected
                      ? 'border-orange-500 scale-110 ring-2 ring-orange-500/40'
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: v.color }}
                  aria-label={v.label}
                  aria-pressed={isSelected}
                />
              );
            })}
          </div>
          {selectedVariation && (
            <p className="text-slate-500 text-xs mt-1">{selectedVariation.label}</p>
          )}
        </div>
      )}
    </div>
  );
}