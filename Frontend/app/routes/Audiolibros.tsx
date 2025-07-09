import { Home, Plus, Search } from "lucide-react";
import Card from "../components/Card";
import { json, Link, useLoaderData } from "@remix-run/react";
import { AudioLibroResumen } from "~/models/AudioLibro";
import { getAllAudiolibros } from "~/services/audiolibroservice";
import CardAudiolibro from "~/components/CardAudiolibro";



export const loader = async () => {
  try {
    const audiolibros = await getAllAudiolibros();
    return json(audiolibros ?? []);
  } catch (error) {
    console.error("Error cargando audiolibros:", error);
    return json([]);
  }
};

const apiUrl = import.meta.env.VITE_API_URL;

const pagina_Audiolibros = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <main>
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#002847]/90 to-[#002847]/80 mix-blend-multiply"></div>
          <img
            src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Biblioteca de libros"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
              Audiolibros y videolibros
            </h1>
            <p className="text-lg md:text-xl max-w-2xl text-center text-white/80">
              Descubre historias narradas por las mejores voces y disfruta en
              cualquier momento.
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
            <Link
              to="/audiolibros"
              className="text-gray-600 hover:text-[#fa4616]"
            >
              Audiolibros
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-4 mt-6">
          <p className="text-gray-600 text-sm">
            Mostrando {data?.totalElements ?? 0} resultados
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-6xl mx-auto mt-8 mb-16">
          {Array.isArray(data?.responseElements) &&
            data.responseElements.map((item: AudioLibroResumen) => (
              <CardAudiolibro
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                autor={item.autor}
                genero={item.genero}
                portada={`${apiUrl}/portadasAudio/${item.portada}`}
              />
            ))}
        </div>
      </main>
    </div>
  );
};

export default pagina_Audiolibros;
