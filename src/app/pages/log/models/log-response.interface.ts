export interface LogResponse {
    id: number;
    usuario: string;
    modulo: string;
    tipoMetodo: string;
    parametros: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoLogs: string;
    badgeColor: string;
  }