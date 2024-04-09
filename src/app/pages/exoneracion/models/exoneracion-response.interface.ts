export interface ExoneracionResponse {
    id: number;
    idtra: string;
    cliente: string;
    tipoExoneracion: string;
    statusExoneracion: string;
    producto: string;
    categoria: string;
    clasificacionArancelaria: string;
    numeroSolicitud: string;
    solicitud: string;
    numeroAutorizacion: string;
    autorizacion: string;
    desde: Date;
    hasta: Date;
    descripcion: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoExoneracion: string;
    badgeColor: string;
    icEdit: any;
    icDelete: any;
  }
  
  export interface ExoneracionById {
    id: number;
    idtra: string;
    cliente: string;
    tipoExoneracion: string;
    statusExoneracion: string;
    producto: string;
    categoria: string;
    clasificacionArancelaria: string;
    numeroSolicitud: string;
    solicitud: string;
    numeroAutorizacion: string;
    autorizacion: string;
    desde: Date;
    hasta: Date;
    descripcion: string;
    estado: number;
  }
  