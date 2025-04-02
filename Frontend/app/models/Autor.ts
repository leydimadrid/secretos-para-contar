export interface AutorResumen {
  id: number;
  nombre: string;
  apellidos: string;
  nacionalidad: string;
  foto: string;
  generos: string;
}
export interface Autor extends AutorResumen {
  pseudonimo: string;
  fechaNacimiento: Date;
  pais: string;
  estaVivo: boolean;
  biografia: string;
  idioma: string;
}

export interface AutorResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: Autor[];
}

export interface AutorCrear {
  id: number;
  nombre: string;
  apellido: string;
  generoId: string;
  foto: string;
  nacionalidad: string;
  biografia: string;
  idioma: string;
}
