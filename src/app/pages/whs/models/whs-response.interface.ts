export interface WhsResponse {
  id: number;
  idtra: string;
  numeroWHS: string;
  cliente: string;
  nombreCliente: string;
  tipoRegistro: string;
  po: string;
  statusWhs: string;
  pol: string;
  pod: string;
  detalle: string;
  cantidadBultos: string;
  tipoBultos: string;
  vinculacionOtroRegistro: string;
  whsReceipt: string;
  documentoregistro: string;
  imagen1: string;
  imagen2: string;
  imagen3: string;
  imagen4: string;
  imagen5: string;
  fechaCreacionAuditoria: Date;
  estado: number;
  estadoWhs: string;
  badgeColor: string;
  icEdit: any;
  icDelete: any;
}

export interface WhsById {
  id: number;
  idtra: string;
  numeroWHS: string;
  cliente: string;
  tipoRegistro: string;
  po: string;
  statusWhs: string;
  pol: string;
  pod: string;
  detalle: string;
  cantidadBultos: string;
  tipoBultos: string;
  vinculacionOtroRegistro: string;
  whsReceipt: string;
  documentoregistro: string;
  imagen1: string;
  imagen2: string;
  imagen3: string;
  imagen4: string;
  imagen5: string;
  estado: number;
}
