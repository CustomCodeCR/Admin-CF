export interface WhsRequest {
  idtra: string;
  numeroWHS: string;
  cliente: string;
  tipoRegistro: string;
  po: string;
  statusWHS: string;
  pol: string;
  pod: string;
  detalle: string;
  cantidadBultos: string;
  tipoBultos: string;
  vinculacionOtroRegistro: string;
  whsReceipt: File;
  documentoregistro: File;
  imagen1: File;
  imagen2: File;
  imagen3: File;
  imagen4: File;
  imagen5: File;
  estado: number;
}
