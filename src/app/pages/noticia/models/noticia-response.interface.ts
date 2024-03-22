export interface NoticiaResponse {
  id: number;
  titulo: string;
  subtitulo: string;
  contenido: string;
  imagen: string;
  fechaCreacionAuditoria: Date;
  estado: number;
  estadoNoticia: string;
  badgeColor: string;
  icEdit: any;
  icDelete: any;
}

export interface NoticiaById {
  id: number;
  titulo: string;
  subtitulo: string;
  contenido: string;
  imagen: string;
  estado: number;
}
