import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Download, Volume2 } from "lucide-react";
import { Star } from "lucide-react";
import CardAudiolibro from "~/components/CardAudiolibro";
import { AudioLibroResumen } from "~/models/AudioLibro";
import {
  descargarAudiolibro,
  getAudiolibroById,
} from "~/services/audiolibroservice";

// Loader para cargar datos del servidor
export async function loader({ params }: LoaderFunctionArgs) {
  const { Id } = params;

  if (!Id) {
    throw new Response("ID de Audiolibro no proporcionado", { status: 400 });
  }

  const response = await getAudiolibroById(Id);

  if (!response) {
    throw new Response("Audiolibro no encontrado", { status: 404 });
  }

  return json({ response });
}

const audiolibroDetalle = () => {
  const { response } = useLoaderData<typeof loader>();

  if (!response.responseElements || response.responseElements.length === 0) {
    return (
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-center">
          No se encontró información del audiolibro
        </h1>
      </div>
    );
  }

  const audiolibro = response.responseElements[0];
  const videoUrl = `${audiolibro.urlReproduccion}`;

  const descargarArchivo = async (idLibro: string) => {
    try {
      const blob = await descargarAudiolibro(idLibro);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${audiolibro.titulo}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center text-sm">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-[#fa4616]"
          >
            <span>Inicio</span>
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <Link
            to="/audiolibros"
            className="text-gray-600 hover:text-[#fa4616]"
          >
            Audiolibro
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-800">{audiolibro.titulo}</span>
        </div>
      </div>

      <main className="container mx-auto min-h-full">
        <div className="w-full max-w-3xl mx-auto mt-8 mb-16">
          <audio
            className="w-full h-full"
            controls
            src={videoUrl}
          >Audio</audio>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-8 mb-16">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <div className="md:col-span-2">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {audiolibro.generos &&
                audiolibro.generos
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
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#fa4616] mb-2">
            {audiolibro.titulo}
          </h1>
          <h2 className="text-xl mb-4 text-black">{audiolibro.autor}</h2>

          <p className="text-gray-700 mb-2">Duración: {audiolibro.duracion}</p>
          <p className="text-gray-700 mb-2">Tamaño: {audiolibro.tamañoMB}</p>

          <div className="flex justify-center gap-16 mb-12 mt-12">
            <button
              onClick={() => descargarArchivo(audiolibro.id)}
              className="bg-[#fa4616] text-white px-6 py-3 rounded-md flex items-center hover:bg-[#f94517] transition-colors"
            >
              Descargar <Download className="ml-2 h-5 w-5" />
            </button>
            <button className="bg-[#fa4616] text-white px-6 py-3 rounded-md flex items-center hover:bg-[#f94517] transition-colors">
              Escuchar <Volume2 className="ml-2 h-5 w-5" />
            </button>
          </div>
          <div>
            <div className="grid grid-cols-2 text-center">
              <div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold">
                    {audiolibro.totalDescargas}
                  </span>
                  <Download className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-gray-600 text-sm">Veces descargado</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold">
                    {audiolibro.totalEscuchas}
                  </span>
                  <Volume2 className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-gray-600 text-sm">Veces reproducido</p>
              </div>
            </div>
          </div>
        </div>
        {audiolibro.audiolibrosRelacionados &&
        audiolibro.audiolibrosRelacionados.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-[#002847]">
              Audiolibros relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
              {audiolibro.audiolibrosRelacionados.map(
                (audiolibroRelacionado: AudioLibroResumen) => (
                  <CardAudiolibro
                    key={audiolibroRelacionado.id}
                    id={audiolibroRelacionado.id}
                    titulo={audiolibroRelacionado.titulo}
                    portada={"img/image-audio.jpg"}
                    autor={audiolibroRelacionado.autor}
                    genero={audiolibroRelacionado.genero}
                  />
                )
              )}
            </div>
          </section>
        ) : (
          <div className="container mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold text-center">
              No hay Audiolibros relacionados
            </h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default audiolibroDetalle;
