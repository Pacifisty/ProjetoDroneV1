'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false });

type FileState =
  | { kind: 'empty' }
  | { kind: 'loading' }
  | { kind: 'image'; url: string; name: string }
  | { kind: '3d'; url: string; name: string; fileType: 'obj' | 'fbx' }
  | { kind: 'error'; message: string };

const ACCEPTED_TYPES: Record<string, string> = {
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/webp': 'image',
};

const EXT_MAP: Record<string, string> = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  obj: '3d-obj',
  fbx: '3d-fbx',
};

function classifyFile(file: File): { kind: 'image' | 'obj' | 'fbx' | 'invalid' } {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const byMime = ACCEPTED_TYPES[file.type];
  if (byMime === 'image' || EXT_MAP[ext] === 'image') return { kind: 'image' };
  if (ext === 'obj') return { kind: 'obj' };
  if (ext === 'fbx') return { kind: 'fbx' };
  return { kind: 'invalid' };
}

export default function DronePreviewPanel() {
  const [state, setState] = useState<FileState>({ kind: 'empty' });
  const [modelReady, setModelReady] = useState(false);
  const currentUrlRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const revokeCurrentUrl = useCallback(() => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      revokeCurrentUrl();
      setModelReady(false);

      const classified = classifyFile(file);

      if (classified.kind === 'invalid') {
        setState({
          kind: 'error',
          message: `Formato não suportado: ".${file.name.split('.').pop()}". Use PNG, JPG, WEBP, OBJ ou FBX.`,
        });
        return;
      }

      const url = URL.createObjectURL(file);
      currentUrlRef.current = url;
      setState({ kind: 'loading' });

      if (classified.kind === 'image') {
        setState({ kind: 'image', url, name: file.name });
      } else {
        setState({
          kind: '3d',
          url,
          name: file.name,
          fileType: classified.kind as 'obj' | 'fbx',
        });
      }
    },
    [revokeCurrentUrl]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    revokeCurrentUrl();
    setModelReady(false);
    setState({ kind: 'empty' });
  };

  const handleModelLoad = useCallback(() => {
    setModelReady(true);
  }, []);

  const handleModelError = useCallback((msg: string) => {
    revokeCurrentUrl();
    setModelReady(false);
    setState({ kind: 'error', message: msg });
  }, [revokeCurrentUrl]);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
      <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
        🖼️ Visualizar drone / peça
      </h3>

      {/* Upload area */}
      {state.kind === 'empty' && (
        <div
          className="border-2 border-dashed border-slate-600 hover:border-orange-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="text-3xl mb-2">📦</div>
          <p className="text-slate-300 text-sm font-medium mb-1">
            Envie uma imagem ou modelo 3D
          </p>
          <p className="text-slate-500 text-xs">
            PNG, JPG, WEBP · OBJ, FBX
          </p>
          <button
            type="button"
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            Selecionar arquivo
          </button>
        </div>
      )}

      {/* Error state */}
      {state.kind === 'error' && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-red-400 text-sm">{state.message}</p>
          <button
            onClick={() => { setState({ kind: 'empty' }); inputRef.current?.click(); }}
            className="mt-3 bg-slate-700 hover:bg-slate-600 text-white text-xs px-4 py-1.5 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Image preview */}
      {state.kind === 'image' && (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
          <Image
            src={state.url}
            alt={state.name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )}

      {/* 3D viewer */}
      {state.kind === '3d' && (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
          {!modelReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-slate-400 text-xs">Carregando modelo…</p>
            </div>
          )}
          <ModelViewer
            url={state.url}
            fileType={state.fileType}
            onLoad={handleModelLoad}
            onError={handleModelError}
          />
          {modelReady && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
              <span className="bg-black/50 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                Arraste para rotacionar · Scroll para zoom
              </span>
            </div>
          )}
        </div>
      )}

      {/* File name + change button */}
      {(state.kind === 'image' || state.kind === '3d') && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-slate-400 text-xs truncate">{state.name}</span>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => inputRef.current?.click()}
              className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              Trocar
            </button>
            <button
              onClick={handleClear}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.obj,.fbx"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
