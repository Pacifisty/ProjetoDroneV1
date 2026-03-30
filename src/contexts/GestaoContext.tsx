'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { gestaoStore } from '@/lib/gestaoStore';
import type {
  Orgao, Setor, ServidorPerfil, TipoDocumento,
  Protocolo, Processo, AuditLog, Tramitacao, Andamento,
} from '@/lib/gestaoTypes';

interface GestaoContextValue {
  // Auth
  servidorAtual: ServidorPerfil | null;
  setServidorAtual: (s: ServidorPerfil | null) => void;

  // Data
  orgaos: Orgao[];
  setores: Setor[];
  servidores: ServidorPerfil[];
  tiposDocumento: TipoDocumento[];
  protocolos: Protocolo[];
  processos: Processo[];
  auditLogs: AuditLog[];

  // Actions – Protocolo
  addProtocolo: (p: Omit<Protocolo, 'id' | 'numero' | 'dataCriacao' | 'tramitacoes' | 'criadoPorId' | 'criadoPorNome'>) => Protocolo;
  tramitar: (protocoloId: string, tram: Omit<Tramitacao, 'id' | 'protocoloId' | 'data' | 'usuarioNome' | 'usuarioId'>) => void;
  updateProtocolo: (id: string, changes: Partial<Protocolo>) => void;

  // Actions – Processo
  addProcesso: (p: Omit<Processo, 'id' | 'dataCriacao' | 'andamentos' | 'criadoPorId' | 'criadoPorNome'>) => Processo;
  addAndamento: (processoId: string, a: Omit<Andamento, 'id' | 'data' | 'usuarioNome' | 'usuarioId'>) => void;

  // Actions – Admin
  addSetor: (s: Omit<Setor, 'id'>) => void;
  updateSetor: (id: string, changes: Partial<Setor>) => void;
  addServidor: (s: Omit<ServidorPerfil, 'id' | 'criadoEm'>) => void;

  // Refresh
  refresh: () => void;
}

const GestaoContext = createContext<GestaoContextValue | null>(null);

export function GestaoProvider({ children }: { children: React.ReactNode }) {
  const [servidorAtual, setServidorAtualState] = useState<ServidorPerfil | null>(null);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [servidores, setServidores] = useState<ServidorPerfil[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const refresh = useCallback(() => {
    setOrgaos(gestaoStore.getOrgaos());
    setSetores(gestaoStore.getSetores());
    setServidores(gestaoStore.getServidores());
    setTiposDocumento(gestaoStore.getTiposDocumento());
    setProtocolos(gestaoStore.getProtocolos());
    setProcessos(gestaoStore.getProcessos());
    setAuditLogs(gestaoStore.getAuditLogs());
  }, []);

  useEffect(() => {
    gestaoStore.initSeed();
    refresh();
    // Default to first servidor
    const srvs = gestaoStore.getServidores();
    if (srvs.length > 0) {
      const saved = localStorage.getItem('gestao_servidor_atual');
      if (saved) {
        const found = srvs.find(s => s.id === saved);
        if (found) setServidorAtualState(found);
        else setServidorAtualState(srvs[0]);
      } else {
        setServidorAtualState(srvs[0]);
      }
    }
  }, [refresh]);

  const setServidorAtual = useCallback((s: ServidorPerfil | null) => {
    setServidorAtualState(s);
    if (typeof window !== 'undefined') {
      if (s) localStorage.setItem('gestao_servidor_atual', s.id);
      else localStorage.removeItem('gestao_servidor_atual');
    }
  }, []);

  const addProtocolo = useCallback((
    p: Omit<Protocolo, 'id' | 'numero' | 'dataCriacao' | 'tramitacoes' | 'criadoPorId' | 'criadoPorNome'>
  ): Protocolo => {
    const srv = servidorAtual;
    const setor = gestaoStore.getSetores().find(s => s.id === p.setorOrigemId);
    const numero = gestaoStore.generateNumeroProtocolo(setor?.sigla ?? 'PROT');
    const protocolo: Protocolo = {
      ...p,
      id: `prot_${Date.now()}`,
      numero,
      dataCriacao: new Date().toISOString(),
      tramitacoes: [],
      criadoPorId: srv?.id ?? 'anon',
      criadoPorNome: srv?.nome ?? 'Anônimo',
    };
    gestaoStore.addProtocolo(protocolo);
    gestaoStore.addAuditLog({ data: new Date().toISOString(), usuarioNome: srv?.nome ?? 'Anônimo', usuarioId: srv?.id ?? 'anon', acao: 'CRIAR', recurso: 'Protocolo', recursoId: protocolo.id, detalhes: protocolo.numero });
    refresh();
    return protocolo;
  }, [servidorAtual, refresh]);

  const tramitar = useCallback((
    protocoloId: string,
    tram: Omit<Tramitacao, 'id' | 'protocoloId' | 'data' | 'usuarioNome' | 'usuarioId'>
  ) => {
    const srv = servidorAtual;
    const t: Tramitacao = {
      ...tram,
      id: `tr_${Date.now()}`,
      protocoloId,
      data: new Date().toISOString(),
      usuarioNome: srv?.nome ?? 'Anônimo',
      usuarioId: srv?.id ?? 'anon',
    };
    const proto = gestaoStore.getProtocolo(protocoloId);
    if (!proto) return;
    const newStatus = tram.acao === 'conclusao' ? 'concluido' : tram.acao === 'encaminhamento' ? 'em_andamento' : proto.status;
    gestaoStore.updateProtocolo(protocoloId, {
      tramitacoes: [...proto.tramitacoes, t],
      status: newStatus,
      setorDestinoId: tram.setorDestino,
      setorDestinoNome: gestaoStore.getSetores().find(s => s.id === tram.setorDestino)?.nome ?? tram.setorDestino,
    });
    gestaoStore.addAuditLog({ data: new Date().toISOString(), usuarioNome: srv?.nome ?? '', usuarioId: srv?.id ?? '', acao: 'TRAMITAR', recurso: 'Protocolo', recursoId: protocoloId, detalhes: tram.acao });
    refresh();
  }, [servidorAtual, refresh]);

  const updateProtocolo = useCallback((id: string, changes: Partial<Protocolo>) => {
    gestaoStore.updateProtocolo(id, changes);
    refresh();
  }, [refresh]);

  const addProcesso = useCallback((
    p: Omit<Processo, 'id' | 'dataCriacao' | 'andamentos' | 'criadoPorId' | 'criadoPorNome'>
  ): Processo => {
    const srv = servidorAtual;
    const processo: Processo = {
      ...p,
      id: `proc_${Date.now()}`,
      dataCriacao: new Date().toISOString(),
      andamentos: [{ id: `and_${Date.now()}`, data: new Date().toISOString(), usuarioNome: srv?.nome ?? 'Anônimo', usuarioId: srv?.id ?? 'anon', descricao: 'Processo aberto.', tipo: 'abertura' }],
      criadoPorId: srv?.id ?? 'anon',
      criadoPorNome: srv?.nome ?? 'Anônimo',
    };
    gestaoStore.addProcesso(processo);
    refresh();
    return processo;
  }, [servidorAtual, refresh]);

  const addAndamento = useCallback((
    processoId: string,
    a: Omit<Andamento, 'id' | 'data' | 'usuarioNome' | 'usuarioId'>
  ) => {
    const srv = servidorAtual;
    const proc = gestaoStore.getProcessos().find(p => p.id === processoId);
    if (!proc) return;
    const and: Andamento = { ...a, id: `and_${Date.now()}`, data: new Date().toISOString(), usuarioNome: srv?.nome ?? '', usuarioId: srv?.id ?? '' };
    gestaoStore.updateProcesso(processoId, { andamentos: [...proc.andamentos, and] });
    refresh();
  }, [servidorAtual, refresh]);

  const addSetor = useCallback((s: Omit<Setor, 'id'>) => {
    gestaoStore.addSetor({ ...s, id: `set_${Date.now()}` });
    refresh();
  }, [refresh]);

  const updateSetor = useCallback((id: string, changes: Partial<Setor>) => {
    const list = gestaoStore.getSetores().map(s => s.id === id ? { ...s, ...changes } : s);
    gestaoStore.setSetores(list);
    refresh();
  }, [refresh]);

  const addServidor = useCallback((s: Omit<ServidorPerfil, 'id' | 'criadoEm'>) => {
    gestaoStore.addServidor({ ...s, id: `srv_${Date.now()}`, criadoEm: new Date().toISOString() });
    refresh();
  }, [refresh]);

  return (
    <GestaoContext.Provider value={{
      servidorAtual, setServidorAtual,
      orgaos, setores, servidores, tiposDocumento, protocolos, processos, auditLogs,
      addProtocolo, tramitar, updateProtocolo,
      addProcesso, addAndamento,
      addSetor, updateSetor, addServidor,
      refresh,
    }}>
      {children}
    </GestaoContext.Provider>
  );
}

export function useGestao() {
  const ctx = useContext(GestaoContext);
  if (!ctx) throw new Error('useGestao must be used within GestaoProvider');
  return ctx;
}
