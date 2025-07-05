import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { ChevronDown, Home, Plus, Search } from "lucide-react";
import { json, Link, useLoaderData } from "@remix-run/react";
import { getAllLibros, getLibrosFiltrados } from "~/services/libroservice";
import { LibroResumen } from "~/models/Libro";

export const loader = async () => {
  try {
    const libros = await getAllLibros();
    
    return json(libros ?? []);
  } catch (error) {
    console.error("Error cargando libros:", error);
    return json([]);
  }
};

const apiUrl = import.meta.env.VITE_API_URL;

const Libros = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#002847]/90 to-[#002847]/80 mix-blend-multiply"></div>
        <img
          src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Biblioteca de libros"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
            Libros
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-center text-white/80">
            Explora nuestra colección de libros y encuentra tu próxima lectura
            favorita
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
          <Link to="/libros" className="text-gray-600 hover:text-[#fa4616]">
            Libros
          </Link>
        </div>
      </div>

      <div className="py-6">
        {/* Contador de resultados */}
        <div className="max-w-6xl mx-auto mb-4">
          <p className="text-gray-600 text-sm">
            Mostrando {data?.totalElements ?? 0} resultados
          </p>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-6xl mx-auto mt-8 mb-16">
          {Array.isArray(data?.responseElements) &&
            data.responseElements.map((item: LibroResumen) => (
              <Card
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                portada={`${apiUrl}/portadas/${item.portada}`}
                autor={item.autor}
                genero={item.genero}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Libros;
