export interface UsuarioRequest {
  nombre: string;
  apellido: string;
  pass: string;
  correo: string;
  tipo: string;
  cliente: string;
  idRol: number;
  imagen: File;
  estado: number;
}
