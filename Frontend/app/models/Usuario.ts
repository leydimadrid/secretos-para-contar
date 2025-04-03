export interface Usuario {
  id: string;
  name: string;
  lastName: string;
  userName: string;
  email: string;
}

export interface UsuarioResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: Usuario[];
}