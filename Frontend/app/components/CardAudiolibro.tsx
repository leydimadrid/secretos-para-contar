import { ArrowRight } from "lucide-react";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { LibroResumen } from "~/models/Libro";
import { AudioLibroResumen } from "~/models/AudioLibro";

const CardAudiolibro = ({
  id,
  titulo,
  portada,
  autor,
  genero,
}: AudioLibroResumen) => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    if (path === `/audiolibros/${id}` && pathname === `/audiolibros/${id}`)
      return true;
    return false;
  };
  return (
    <div className="flex flex-col justify-around rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl group">
      <div className="border-b-2">
        <img
          src={portada || "/img/image-audio.jpg"}
          alt={`Portada de ${titulo}`}
          className="w-64 h-32 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="space-y-2">
          <h3 className="font-bold text-md text-gray-900 line-clamp-2">
            {titulo}
          </h3>
          <p className="text-sm font-medium text-gray-500">{autor}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {genero}
          </span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Link
          to={`/audiolibros/${id.toString()}`}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#fa4616] rounded-md hover:bg-[#fa5316] transition-colors"
        >
          <span>Ver detalles</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default CardAudiolibro;
