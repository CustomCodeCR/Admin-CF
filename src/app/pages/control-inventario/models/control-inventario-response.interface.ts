export interface ControlInventarioResponse {
    id: number;
    cliente: string;
    nombreCliente: string;
    pol: string;
    controlInventario: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoControlInventario: string;
    badgeColor: string;
    icEdit: any;
    icDelete: any;
  }
  
  export interface ControlInventarioById {
    id: number;
    cliente: string;
    pol: string;
    controlInventario: string;
    estado: number;
  }
  