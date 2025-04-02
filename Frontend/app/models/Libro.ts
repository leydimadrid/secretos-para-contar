export interface GestionLibrosProps {
  libros: Libro[];
}

export interface LibroResponse {
  message: string;
  statusCode: number;
  totalElements: number;
  responseElements: Libro[];
}

export interface LibroResumen {
  id: number;
  titulo: string;
  autor: string;
  portada: string;
  genero: string[];
}

export interface Libro extends LibroResumen {
  isbn13: string;
  anioPublicacion: number;
  editorial: string;
  formato: string;
  descripcion: string;
  idioma: string;
}

export interface EditarLibro {
  id: number;
  titulo: string;
  autorId: string;
  generoId: string;
  editorial: string;
  contraportada: string;
  idioma: string;
  isbn13: string;
  pdf: string;
  portada: string;
}



export interface LibroFiltro {
  autorId?: number;
  generoId?: number;
  anioPublicacion?: number;
  editorial?: string;
  busqueda?: string;
}

export interface Autor {
  id: number;
  nombre: string;
}

export interface Genero {
  id: number;
  nombre: string;
}

export interface Editorial {
  nombre: string;
}

export interface AnioPublicacion {
  anio: number;
}
