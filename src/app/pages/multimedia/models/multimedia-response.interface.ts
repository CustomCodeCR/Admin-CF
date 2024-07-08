export interface MultimediaResponse {
    id: number;
    nombre: string;
    multimedia: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoMultimedia: string;
    badgeColor: string;
    icEdit: any;
    icDelete: any;
}

export interface MultimediaByIdResponse {
    id: number;
    nombre: string;
    multimedia: string;
    estado: number;
}