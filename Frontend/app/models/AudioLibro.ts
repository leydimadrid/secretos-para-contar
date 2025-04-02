export interface AudioLibroResumen {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  portada: string;
}

export interface AudioLibro extends AudioLibroResumen {
  duracion: number;
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
