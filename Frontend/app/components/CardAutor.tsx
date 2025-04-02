import { ArrowRight } from "lucide-react";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { Libro } from "~/models/Libro";
import { AutorResumen } from "~/models/Autor";

const CardAutor = ({
  id,
  nombre,
  apellidos,
  generos,
  foto,
}: AutorResumen) => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    if (path === "/autor-detalle" && pathname === "/autor-detalle") return true;
    return false;
  };
  return (
    <div className=" rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl group">
      <div className="border-b-2">
        <img
          src={foto}
          alt={`Portada de ${nombre}`}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
            {`${nombre} ${apellidos}`}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {generos}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Link
          to={`/autores/${id.toString()}`}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#fa4616] rounded-md hover:bg-[#fa5316] transition-colors"
        >
          <span>Ver detalles</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default CardAutor;
