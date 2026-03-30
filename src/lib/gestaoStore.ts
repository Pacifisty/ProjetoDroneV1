import type {
  Orgao, Setor, ServidorPerfil, TipoDocumento,
  Protocolo, Processo, AuditLog, ModeloDocumento,
} from './gestaoTypes';

const KEYS = {
  orgaos: 'gestao_orgaos',
  setores: 'gestao_setores',
  servidores: 'gestao_servidores',
  tiposDocumento: 'gestao_tipos_documento',
  protocolos: 'gestao_protocolos',
  processos: 'gestao_processos',
  auditLogs: 'gestao_audit_logs',
  modelos: 'gestao_modelos',
  counter: 'gestao_protocol_counter',
};

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_ORGAOS: Orgao[] = [
  { id: 'org1', nome: 'Prefeitura Municipal', sigla: 'PMC', ativo: true },
  { id: 'org2', nome: 'Secretaria Municipal de Água e Esgoto', sigla: 'SEMAE', ativo: true },
  { id: 'org3', nome: 'Secretaria de Planejamento', sigla: 'SEPLAN', ativo: true },
];

const SEED_SETORES: Setor[] = [
  { id: 'set1', nome: 'Protocolo Geral', sigla: 'PROT', orgaoId: 'org1', ativo: true },
  { id: 'set2', nome: 'Departamento Jurídico', sigla: 'JUR', orgaoId: 'org1', ativo: true },
  { id: 'set3', nome: 'Recursos Humanos', sigla: 'RH', orgaoId: 'org1', ativo: true },
  { id: 'set4', nome: 'Departamento de Obras', sigla: 'OBRAS', orgaoId: 'org1', ativo: true },
  { id: 'set5', nome: 'Secretaria de Finanças', sigla: 'SFIN', orgaoId: 'org1', ativo: true },
];

const SEED_SERVIDORES: ServidorPerfil[] = [
  { id: 'srv1', nome: 'Ana Paula Ferreira', email: 'ana.ferreira@prefeitura.gov.br', cargo: 'Chefe de Protocolo', setorId: 'set1', perfil: 'administrador', ativo: true, criadoEm: '2024-01-10T08:00:00Z' },
  { id: 'srv2', nome: 'Carlos Eduardo Souza', email: 'carlos.souza@prefeitura.gov.br', cargo: 'Procurador Municipal', setorId: 'set2', perfil: 'juridico', ativo: true, criadoEm: '2024-01-10T08:00:00Z' },
  { id: 'srv3', nome: 'Maria Lúcia Oliveira', email: 'maria.oliveira@prefeitura.gov.br', cargo: 'Analista de RH', setorId: 'set3', perfil: 'rh', ativo: true, criadoEm: '2024-01-10T08:00:00Z' },
  { id: 'srv4', nome: 'Roberto Alves Lima', email: 'roberto.lima@prefeitura.gov.br', cargo: 'Engenheiro Civil', setorId: 'set4', perfil: 'gestor', ativo: true, criadoEm: '2024-01-10T08:00:00Z' },
];

const SEED_TIPOS: TipoDocumento[] = [
  { id: 'td1', nome: 'Ofício', prazo: 15, sigilo: 'publico' },
  { id: 'td2', nome: 'Memorando', prazo: 7, sigilo: 'restrito' },
  { id: 'td3', nome: 'Requerimento', prazo: 30, sigilo: 'publico' },
  { id: 'td4', nome: 'Despacho', prazo: 5, sigilo: 'restrito' },
  { id: 'td5', nome: 'Decreto', prazo: 3, sigilo: 'publico' },
];

const SEED_PROTOCOLOS: Protocolo[] = [
  {
    id: 'prot1',
    numero: '2026/PROT/000001',
    assunto: 'Solicitação de reparo em pavimentação da Rua das Flores',
    tipoDocumentoId: 'td3',
    tipoDocumentoNome: 'Requerimento',
    interessado: 'João da Silva',
    cpfCnpj: '123.456.789-00',
    setorOrigemId: 'set1',
    setorOrigemNome: 'Protocolo Geral',
    setorDestinoId: 'set4',
    setorDestinoNome: 'Departamento de Obras',
    prioridade: 'normal',
    prazo: '2026-03-15',
    status: 'em_andamento',
    descricao: 'Cidadão solicita reparo urgente no pavimento da Rua das Flores, trecho entre os números 100 e 200.',
    dataCriacao: '2026-01-10T09:00:00Z',
    criadoPorId: 'srv1',
    criadoPorNome: 'Ana Paula Ferreira',
    anexos: [],
    tramitacoes: [
      { id: 'tr1', protocoloId: 'prot1', setorOrigem: 'Protocolo Geral', setorDestino: 'Departamento de Obras', acao: 'encaminhamento', observacao: 'Encaminhado para análise técnica.', data: '2026-01-10T09:05:00Z', usuarioNome: 'Ana Paula Ferreira', usuarioId: 'srv1' },
    ],
    sigiloso: false,
    isExterno: true,
  },
  {
    id: 'prot2',
    numero: '2026/JUR/000002',
    assunto: 'Análise de contrato com fornecedor de TI',
    tipoDocumentoId: 'td1',
    tipoDocumentoNome: 'Ofício',
    interessado: 'Prefeitura Municipal',
    setorOrigemId: 'set1',
    setorOrigemNome: 'Protocolo Geral',
    setorDestinoId: 'set2',
    setorDestinoNome: 'Departamento Jurídico',
    prioridade: 'urgente',
    status: 'aberto',
    dataCriacao: '2026-01-12T10:00:00Z',
    criadoPorId: 'srv1',
    criadoPorNome: 'Ana Paula Ferreira',
    anexos: [{ id: 'anx1', nome: 'contrato_ti.pdf', tipo: 'application/pdf', tamanho: 204800, dataUpload: '2026-01-12T10:00:00Z' }],
    tramitacoes: [],
    sigiloso: false,
    isExterno: false,
  },
  {
    id: 'prot3',
    numero: '2026/RH/000003',
    assunto: 'Pedido de licença médica - Servidor matrícula 4512',
    tipoDocumentoId: 'td2',
    tipoDocumentoNome: 'Memorando',
    interessado: 'Marcos Pereira Costa',
    cpfCnpj: '987.654.321-00',
    setorOrigemId: 'set3',
    setorOrigemNome: 'Recursos Humanos',
    setorDestinoId: 'set3',
    setorDestinoNome: 'Recursos Humanos',
    prioridade: 'sigiloso',
    status: 'concluido',
    dataCriacao: '2026-01-05T08:30:00Z',
    criadoPorId: 'srv3',
    criadoPorNome: 'Maria Lúcia Oliveira',
    anexos: [],
    tramitacoes: [
      { id: 'tr2', protocoloId: 'prot3', setorOrigem: 'Recursos Humanos', setorDestino: 'Recursos Humanos', acao: 'conclusao', observacao: 'Licença deferida conforme laudo médico.', data: '2026-01-08T14:00:00Z', usuarioNome: 'Maria Lúcia Oliveira', usuarioId: 'srv3' },
    ],
    sigiloso: true,
    isExterno: false,
  },
];

const SEED_PROCESSOS: Processo[] = [
  {
    id: 'proc1',
    numero: 'PROC-2026-001',
    assunto: 'Licitação para aquisição de computadores',
    tipo: 'licitacao',
    interessado: 'Prefeitura Municipal',
    setorOrigemId: 'set1',
    setorOrigemNome: 'Protocolo Geral',
    status: 'em_andamento',
    dataCriacao: '2026-01-08T08:00:00Z',
    criadoPorId: 'srv1',
    criadoPorNome: 'Ana Paula Ferreira',
    protocolosVinculados: ['prot2'],
    andamentos: [
      { id: 'and1', data: '2026-01-08T08:05:00Z', usuarioNome: 'Ana Paula Ferreira', usuarioId: 'srv1', descricao: 'Processo aberto para licitação de equipamentos de informática.', tipo: 'abertura' },
      { id: 'and2', data: '2026-01-12T10:30:00Z', usuarioNome: 'Carlos Eduardo Souza', usuarioId: 'srv2', descricao: 'Encaminhado ao jurídico para análise do edital.', tipo: 'encaminhamento' },
    ],
  },
  {
    id: 'proc2',
    numero: 'PROC-2026-002',
    assunto: 'Contrato de manutenção de vias públicas',
    tipo: 'contrato',
    interessado: 'Construtora Vias Ltda.',
    cpfCnpj: '12.345.678/0001-90',
    setorOrigemId: 'set4',
    setorOrigemNome: 'Departamento de Obras',
    status: 'em_andamento',
    dataCriacao: '2026-01-03T09:00:00Z',
    criadoPorId: 'srv4',
    criadoPorNome: 'Roberto Alves Lima',
    protocolosVinculados: ['prot1'],
    andamentos: [
      { id: 'and3', data: '2026-01-03T09:05:00Z', usuarioNome: 'Roberto Alves Lima', usuarioId: 'srv4', descricao: 'Processo aberto para formalização do contrato de manutenção.', tipo: 'abertura' },
    ],
  },
];

const SEED_MODELOS: ModeloDocumento[] = [
  { id: 'mod1', nome: 'Ofício Padrão', tipo: 'oficio', conteudo: 'OFÍCIO Nº {{numero}}/{{ano}}\n\nAo(À) Sr(a). {{destinatario}},\n\nAssunto: {{assunto}}\n\n{{corpo}}\n\nAtenciosamente,\n{{remetente}}\n{{cargo}}', ativo: true },
  { id: 'mod2', nome: 'Memorando Interno', tipo: 'memorando', conteudo: 'MEMORANDO INTERNO Nº {{numero}}/{{ano}}\n\nPara: {{destinatario}}\nDe: {{remetente}}\nData: {{data}}\nAssunto: {{assunto}}\n\n{{corpo}}', ativo: true },
];

// ── Storage helpers ────────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Store ──────────────────────────────────────────────────────────────────────

export const gestaoStore = {
  // Orgaos
  getOrgaos(): Orgao[] { return read<Orgao[]>(KEYS.orgaos, SEED_ORGAOS); },
  setOrgaos(orgaos: Orgao[]): void { write(KEYS.orgaos, orgaos); },
  addOrgao(orgao: Orgao): void {
    const list = gestaoStore.getOrgaos();
    list.push(orgao);
    gestaoStore.setOrgaos(list);
  },

  // Setores
  getSetores(): Setor[] { return read<Setor[]>(KEYS.setores, SEED_SETORES); },
  setSetores(setores: Setor[]): void { write(KEYS.setores, setores); },
  addSetor(setor: Setor): void {
    const list = gestaoStore.getSetores();
    list.push(setor);
    gestaoStore.setSetores(list);
  },

  // Servidores
  getServidores(): ServidorPerfil[] { return read<ServidorPerfil[]>(KEYS.servidores, SEED_SERVIDORES); },
  setServidores(servidores: ServidorPerfil[]): void { write(KEYS.servidores, servidores); },
  addServidor(servidor: ServidorPerfil): void {
    const list = gestaoStore.getServidores();
    list.push(servidor);
    gestaoStore.setServidores(list);
  },

  // Tipos de Documento
  getTiposDocumento(): TipoDocumento[] { return read<TipoDocumento[]>(KEYS.tiposDocumento, SEED_TIPOS); },

  // Protocolos
  getProtocolos(): Protocolo[] { return read<Protocolo[]>(KEYS.protocolos, SEED_PROTOCOLOS); },
  setProtocolos(protocolos: Protocolo[]): void { write(KEYS.protocolos, protocolos); },
  addProtocolo(protocolo: Protocolo): Protocolo {
    const list = gestaoStore.getProtocolos();
    list.push(protocolo);
    gestaoStore.setProtocolos(list);
    return protocolo;
  },
  updateProtocolo(id: string, changes: Partial<Protocolo>): void {
    const list = gestaoStore.getProtocolos().map(p => p.id === id ? { ...p, ...changes } : p);
    gestaoStore.setProtocolos(list);
  },
  getProtocolo(id: string): Protocolo | undefined {
    return gestaoStore.getProtocolos().find(p => p.id === id);
  },
  generateNumeroProtocolo(siglaSetor: string): string {
    const year = new Date().getFullYear();
    const counter = read<number>(KEYS.counter, 3) + 1;
    write(KEYS.counter, counter);
    return `${year}/${siglaSetor}/${String(counter).padStart(6, '0')}`;
  },

  // Processos
  getProcessos(): Processo[] { return read<Processo[]>(KEYS.processos, SEED_PROCESSOS); },
  setProcessos(processos: Processo[]): void { write(KEYS.processos, processos); },
  addProcesso(processo: Processo): Processo {
    const list = gestaoStore.getProcessos();
    list.push(processo);
    gestaoStore.setProcessos(list);
    return processo;
  },
  updateProcesso(id: string, changes: Partial<Processo>): void {
    const list = gestaoStore.getProcessos().map(p => p.id === id ? { ...p, ...changes } : p);
    gestaoStore.setProcessos(list);
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] { return read<AuditLog[]>(KEYS.auditLogs, []); },
  addAuditLog(log: Omit<AuditLog, 'id'>): void {
    const list = gestaoStore.getAuditLogs();
    list.unshift({ ...log, id: `log_${Date.now()}` });
    if (list.length > 500) list.length = 500;
    write(KEYS.auditLogs, list);
  },

  // Modelos
  getModelos(): ModeloDocumento[] { return read<ModeloDocumento[]>(KEYS.modelos, SEED_MODELOS); },

  // Initialize seed (call once on client)
  initSeed(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(KEYS.orgaos)) write(KEYS.orgaos, SEED_ORGAOS);
    if (!localStorage.getItem(KEYS.setores)) write(KEYS.setores, SEED_SETORES);
    if (!localStorage.getItem(KEYS.servidores)) write(KEYS.servidores, SEED_SERVIDORES);
    if (!localStorage.getItem(KEYS.tiposDocumento)) write(KEYS.tiposDocumento, SEED_TIPOS);
    if (!localStorage.getItem(KEYS.protocolos)) write(KEYS.protocolos, SEED_PROTOCOLOS);
    if (!localStorage.getItem(KEYS.processos)) write(KEYS.processos, SEED_PROCESSOS);
    if (!localStorage.getItem(KEYS.modelos)) write(KEYS.modelos, SEED_MODELOS);
  },
};
