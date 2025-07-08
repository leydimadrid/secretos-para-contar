export interface AudioLibroResumen {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  portada: string;
}

export interface AudioLibro extends AudioLibroResumen {
  duracion: string;
  tamañoMB: number;
  narrador: string;
  idioma: string;
  pathArchivo: string;
}

export interface AudioLibroResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: AudioLibro[];
}

export interface AudiolibroCrear {
  titulo: string;
  autorId: string;
  generoId: string;
  duracion: string;
  portada: string;
  tamañoMB: string;
  narrador: string;
  idioma: string;
  pathArchivo: string;
}
