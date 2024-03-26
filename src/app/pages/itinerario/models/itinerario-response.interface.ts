export interface ItinerarioResponse {
  id: number;
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
  fechaCreacionAuditoria: Date;
  estado: number;
  estadoItinerario: string;
  badgeColor: string;
  icEdit: any;
  icDelete: any;
}

export interface ItinerarioById {
  id: number;
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
