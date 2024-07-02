export interface PolResponse {
    id: number;
    nombre: string;
    whs: number;
    estadoWhs: string;
    fechaCreacionAuditoria: Date;
    estado: number;
    estadoPol: string;
    badgeColor: string;
    badge2Color: string;
    icEdit: any;
    icDelete: any;
}

export interface PolByIdResponse {
    id: number;
    nombre: string;
    whs: number;
    estado: number;
}
