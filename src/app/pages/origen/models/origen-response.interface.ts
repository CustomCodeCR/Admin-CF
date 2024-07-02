export interface OrigenResponse {
    id: number;
    nombre: string;
    imagen: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoOrigen: string;
    badgeColor: string;
    icEdit: any;
    icDelete: any;
}

export interface OrigenByIdResponse {
    id: number;
    nombre: string;
    imagen: string;
    estado: number;
}