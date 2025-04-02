import { Link, useLoaderData } from "@remix-run/react";
import {
  ArrowRight,
  ChevronUp,
  Download,
  Facebook,
  FileText,
  Heart,
  Home,
  Linkedin,
  Star,
  Twitter,
  Volume2,
} from "lucide-react";

import CardAutor from "../components/CardAutor";
import { getAllAutores, getAutorById } from "~/services/autorservice";
import { AutorResumen } from "~/models/Autor";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { LibroResumen } from "~/models/Libro";
import Card from "~/components/Card";

// Loader para cargar datos del servidor
export async function loader({ params }: LoaderFunctionArgs) {
  const { Id } = params;

  if (!Id) {
    throw new Response("ID de libro no proporcionado", { status: 400 });
  }

  const response = await getAutorById(Id);

  if (!response) {
    throw new Response("Libro no encontrado", { status: 404 });
  }

  return json({ response });
}
const AutorDetalle = () => {
  const { response } = useLoaderData<typeof loader>();

  if (!response.responseElements || response.responseElements.length === 0) {
    return (
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-center">
          No se encontró información del autor
        </h1>
      </div>
    );
  }

  const autor = response.responseElements[0];
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        {/* Breadcrumbs */}
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
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-800">{autor.nombre}</span>
          </div>
        </div>

        {/* Autor Detail */}
        <main className="mx-auto max-w-7xl px-6 md:px-12 py-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {/* Book Cover */}
            <div className="md:col-span-1 mx-auto">
              <img
                src={`http://localhost:5046/autores/${autor.foto}`}
                alt="Portada del libro"
                width={400}
                height={650}
                className="bg-[#fa4616] shadow-lg"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {autor.generos &&
                  autor.generos
                    .split(",")
                    .map((genero: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {genero.trim()}
                      </span>
                    ))}
              </div>
              <h1 className="text-3xl md:text-4xl mb-2 font-bold text-[#fa4616]">
                {`${autor.nombre} ${autor.apellidos}`}
              </h1>
              <div>
                <p className="text-gray-600">Nacionalidad:</p>
                <p className="mb-2">{autor.nacionalidad}</p>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">
                {" "}
                Biografía:
                <p>{autor.biografia || "No hay biografía disponible"}</p>
              </p>
            </div>
          </div>

          {autor.librosRelacionados && autor.librosRelacionados.length > 0 ? (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-[#002847]">
                Otros libros del autor
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
                {autor.librosRelacionados.map(
                  (libroRelacionado: LibroResumen) => (
                    <Card
                      key={libroRelacionado.id}
                      id={libroRelacionado.id}
                      titulo={libroRelacionado.titulo}
                      autor={libroRelacionado.autor}
                      portada={`http://localhost:5046/portadas/${libroRelacionado.portada}`}
                      genero={libroRelacionado.genero}
                    />
                  )
                )}
              </div>
            </section>
          ) : (
            <div className="container mx-auto px-6 py-10">
              <h1 className="text-2xl font-bold text-center">
                No hay Libros relacionados
              </h1>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AutorDetalle;
