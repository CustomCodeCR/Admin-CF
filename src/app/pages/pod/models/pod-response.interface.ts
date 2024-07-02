export interface PodResponse {
    id: number;
    nombre: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoPol: string;
    badgeColor: string;
    icEdit: any;
    icDelete: any;
}

export interface PodByIdResponse {
    id: number;
    nombre: string;
    estado: number;
}
