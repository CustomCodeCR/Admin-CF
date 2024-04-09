export interface ExoneracionRequest {
    idtra: string;
    cliente: string;
    tipoExoneracion: string;
    statusExoneracion: string;
    producto: string;
    categoria: string;
    clasificacionArancelaria: string;
    numeroSolicitud: string;
    solicitud: File;
    numeroAutorizacion: string;
    autorizacion: File;
    desde: Date;
    hasta: Date;
    descripcion: string;
    estado: number;
  }
  