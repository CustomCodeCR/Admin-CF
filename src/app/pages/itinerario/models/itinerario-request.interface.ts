export interface ItinerarioRequest {
  pol: string;
  pod: string;
  closing: Date;
  etd: Date;
  eta: Date;
  carrier: string;
  vessel: string;
  voyage: string;
  origen: string;
  destino: string;
  transporte: string;
  modalidad: string;
  estado: number;
}
