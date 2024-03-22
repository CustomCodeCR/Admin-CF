export interface EmpleoResponse {
  id: number;
  titulo: string;
  puesto: string;
  descripcion: string;
  imagen: string;
  fechaCreacionAuditoria: Date;
  estado: number;
  estadoEmpleo: string;
  badgeColor: string;
  icEdit: any;
  icDelete: any;
}

export interface EmpleoById {
  id: number;
  titulo: string;
  puesto: string;
  descripcion: string;
  imagen: string;
  estado: number;
}
