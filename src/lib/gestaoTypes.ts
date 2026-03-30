export type Prioridade = 'normal' | 'urgente' | 'sigiloso';
export type StatusProtocolo = 'aberto' | 'em_andamento' | 'concluido' | 'arquivado';
export type AcaoTramitacao = 'encaminhamento' | 'despacho' | 'devolucao' | 'aceite' | 'conclusao';
export type PerfilUsuario = 'administrador' | 'gestor' | 'protocolo' | 'servidor' | 'controladoria' | 'juridico' | 'rh' | 'cidadao' | 'auditor';
export type TipoProcesso = 'compra' | 'licitacao' | 'contrato' | 'rh' | 'fiscalizacao' | 'obra' | 'oficio' | 'requerimento' | 'sindicancia' | 'interno';
export type StatusProcesso = 'em_andamento' | 'concluido' | 'arquivado' | 'suspenso';
export type TipoAndamento = 'parecer' | 'despacho' | 'decisao' | 'encaminhamento' | 'abertura' | 'conclusao';

export interface Orgao {
  id: string;
  nome: string;
  sigla: string;
  ativo: boolean;
}

export interface Setor {
  id: string;
  nome: string;
  sigla: string;
  orgaoId: string;
  responsavelId?: string;
  ativo: boolean;
}

export interface ServidorPerfil {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  cargo?: string;
  setorId: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  criadoEm: string;
}

export interface TipoDocumento {
  id: string;
  nome: string;
  prazo: number;
  sigilo: 'publico' | 'restrito' | 'sigiloso';
}

export interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataUpload: string;
  url?: string;
}

export interface Tramitacao {
  id: string;
  protocoloId: string;
  setorOrigem: string;
  setorDestino: string;
  acao: AcaoTramitacao;
  observacao?: string;
  data: string;
  usuarioNome: string;
  usuarioId: string;
}

export interface Protocolo {
  id: string;
  numero: string;
  assunto: string;
  tipoDocumentoId: string;
  tipoDocumentoNome: string;
  interessado: string;
  cpfCnpj?: string;
  setorOrigemId: string;
  setorOrigemNome: string;
  setorDestinoId: string;
  setorDestinoNome: string;
  prioridade: Prioridade;
  prazo?: string;
  status: StatusProtocolo;
  descricao?: string;
  observacoes?: string;
  dataCriacao: string;
  criadoPorId: string;
  criadoPorNome: string;
  anexos: Anexo[];
  tramitacoes: Tramitacao[];
  sigiloso: boolean;
  isExterno: boolean;
}

export interface Andamento {
  id: string;
  data: string;
  usuarioNome: string;
  usuarioId: string;
  descricao: string;
  tipo: TipoAndamento;
}

export interface Processo {
  id: string;
  numero: string;
  assunto: string;
  tipo: TipoProcesso;
  interessado: string;
  cpfCnpj?: string;
  setorOrigemId: string;
  setorOrigemNome: string;
  status: StatusProcesso;
  dataCriacao: string;
  criadoPorId: string;
  criadoPorNome: string;
  protocolosVinculados: string[];
  andamentos: Andamento[];
  observacoes?: string;
}

export interface ModeloDocumento {
  id: string;
  nome: string;
  tipo: string;
  conteudo: string;
  ativo: boolean;
}

export interface AuditLog {
  id: string;
  data: string;
  usuarioNome: string;
  usuarioId: string;
  acao: string;
  recurso: string;
  recursoId: string;
  detalhes?: string;
}
