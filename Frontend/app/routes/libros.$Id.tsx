import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Download, FileText, Home } from "lucide-react";
import { LibroResumen } from "~/models/Libro";
import { descargarLibro, getLibroById } from "~/services/libroservice";
import Card from "~/components/Card";
import { useState } from "react";

// Loader para cargar datos del servidor
export async function loader({ params }: LoaderFunctionArgs) {
  const { Id } = params;

  if (!Id) {
    throw new Response("ID de libro no proporcionado", { status: 400 });
  }

  const response = await getLibroById(Id);

  if (!response) {
    throw new Response("Libro no encontrado", { status: 404 });
  }

  return json({ response });
}



const apiUrl = import.meta.env.VITE_API_URL;

const LibroDetalle = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const { response } = useLoaderData<typeof loader>();

  if (!response.responseElements || response.responseElements.length === 0) {
    return (
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-center">
          No se encontró información del libro
        </h1>
      </div>
    );
  }

  const libro = response.responseElements[0];

  const descargarArchivo = async (idLibro: string) => {
    try {
      const blob = await descargarLibro(idLibro);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${libro.titulo}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const verPdf = async (idLibro: string) => {
    try {
      const blob = await descargarLibro(idLibro);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPdf(true);
    } catch (error) {
      console.error(error);
    }
  };

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
            <Link to="/libros" className="text-gray-600 hover:text-[#fa4616]">
              Libros
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-800">{libro.titulo}</span>
          </div>
        </div>

        {/* Book Detail */}
        <main className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1 mx-auto shadow-xl">
                <img
                  src={`${apiUrl}/portadas/${libro.portada}`}
                  alt={`Portada de ${libro.titulo}`}
                  className="bg-[#fa4616] w-96 object-cover"
                />
            </div>

            {/* Book Info */}
            <div className="md:col-span-2">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {libro.genero &&
                  libro.genero
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

              {/* Title and Author */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#fa4616] mb-2">
                {libro.titulo}
              </h1>
              <h2 className="text-xl mb-4">{libro.autor}</h2>

              {/* Editorial */}
              <div className="mb-4">
                <p className="text-gray-600">Editorial:</p>
                <p>{libro.editorial || "No disponible"}</p>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">
                {libro.contraPortada || "No hay descripción disponible"}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  className="bg-[#fa4616] text-white px-6 py-3 rounded-md flex items-center hover:bg-[#f94517] transition-colors"
                  onClick={() => descargarArchivo(libro.id)}
                >
                  Descargar <Download className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => verPdf(libro.id)}
                  className="bg-[#fa4616] text-white px-6 py-3 rounded-md flex items-center hover:bg-[#f94517] transition-colors"
                >
                  Ver PDF <FileText className="ml-2 h-5 w-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 text-center">
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold">
                      {libro.totalDescargas}
                    </span>
                    <Download className="h-5 w-5 text-gray-500" />
                  </div>
                  {libro.totalDescargas == 1 ? (
                  <p className="text-gray-600 text-sm">Vez descargado</p>
                ) : (
                  <p className="text-gray-600 text-sm">Veces descargado</p>
                )}
                </div>
              </div>
            </div>
          </div>
          <div>
            {showPdf && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
              />
            )}
          </div>

          {libro.librosRelacionados && libro.librosRelacionados.length > 0 ? (
            <section className="mt-16 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-[#002847]">
                Libros relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
                {libro.librosRelacionados.map(
                  (libroRelacionado: LibroResumen) => (
                    <Card
                      key={libroRelacionado.id}
                      id={libroRelacionado.id}
                      titulo={libroRelacionado.titulo}
                      portada={`${apiUrl}/portadas/${libroRelacionado.portada}`}
                      autor={libroRelacionado.autor}
                      genero={libroRelacionado.genero}
                    />
                  )
                )}
              </div>
            </section>
          ) : (
            <div className="container mx-auto px-6 py-10">
              <h1 className="text-2xl font-bold text-center">
                No hay libros relacionados
              </h1>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LibroDetalle;
