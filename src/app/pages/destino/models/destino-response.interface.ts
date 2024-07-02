export interface DestinoResponse {
    id: number;
    nombre: string;
    imagen: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoDestino: string;
    badgeColor: string;
    icEdit: any;
    icDelete: any;
}

export interface DestinoByIdResponse {
    id: number;
    nombre: string;
    imagen: string;
    estado: number;
}