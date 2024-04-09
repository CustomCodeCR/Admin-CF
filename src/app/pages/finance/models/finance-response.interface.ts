export interface FinanceResponse {
    id: number;
    cliente: string;
    nombreCliente: string;
    estadoCuenta: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoFinance: string;
    badgeColor: string;
    icEdit: any;
    icDelete: any;
  }
  
  export interface FinanceById {
    id: number;
    cliente: string;
    estadoCuenta: string;
    estado: number;
  }
  