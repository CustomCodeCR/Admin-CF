export interface BcfResponse {
    id: number;
    bcf: string;
    idtra: string;
    cliente: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoBcf: string;
    badgeColor: string;
    icEdit: any;
    icDelete: any;
  }
  
  export interface BcfById {
    id: number;
    idtra: string;
    cliente: string;
    estado: number;
  }
  