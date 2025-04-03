import React from "react";
import Card from "../components/Card";
import { ChevronDown, Home, Plus, Search } from "lucide-react";
import { Link, useLoaderData } from "@remix-run/react";
import CardAutor from "../components/CardAutor";
import { getAllAutores } from "~/services/autorservice";
import { AutorResumen } from "~/models/Autor";

export function loader() {
  return getAllAutores();
}

const paginaAutores = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#002847]/90 to-[#002847]/80 mix-blend-multiply"></div>
        <img
          src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Biblioteca de libros"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            Autores
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-center text-white/80">
            Conoce a los escritores detrás de tus obras favoritas y explora su
            bibliografía
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center text-sm">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-[#fa4616]"
          >
            <Home className="h-4 w-4 mr-1" />
            <span>Inicio</span>
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <Link to="/autores" className="text-gray-600 hover:text-[#fa4616]">
            Autores
          </Link>
        </div>
      </div>
      <div className="py-6">
        {/* <div className="container mx-auto px-4">

          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar autor"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#fa4616] focus:border-[#fa4616] focus:outline-none"
                />
              </div>
              <button className="bg-[#fa4616] hover:bg-[#e03a0e] text-white px-6 py-3 rounded-r-lg font-medium transition-colors">
                Buscar
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <div className="relative">
              <button className="flex items-center justify-between w-full md:w-auto px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#fa4616]">
                <span className="font-medium">País</span>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center justify-between w-full md:w-auto px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#fa4616]">
                <span className="font-medium">Género</span>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div> */}
          <div className="max-w-6xl mx-auto mb-4">
            <p className="text-gray-600 text-sm">
              Mostrando {data.length} resultados
            </p>
          </div>

        <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-6xl mx-auto mt-8 mb-16">
          {data.map((item: AutorResumen) => (
            <CardAutor
              key={item.id}
              id={item.id}
              nombre={item.nombre}
              apellidos={item.apellidos}
              foto={`http://localhost:5046/autores/${item.foto}`}
              generos={item.generos}
              nacionalidad={""}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default paginaAutores;
