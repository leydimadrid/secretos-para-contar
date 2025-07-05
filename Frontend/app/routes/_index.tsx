import type { MetaFunction } from "@remix-run/node";
import { LibroResumen } from "~/models/Libro";
import Card from "~/components/Card";
import { ArrowRight } from "lucide-react";
import { json, Link, useLoaderData } from "@remix-run/react";
import { getAllLibros } from "~/services/libroservice";

export const meta: MetaFunction = () => {
  return [
    { title: "Biblioteca Secretos para contar" },
    { name: "description", content: "Secretos para contar" },
  ];
};

const apiUrl = import.meta.env.VITE_API_URL;

export const loader = async () => {
  try {
    const libros = await getAllLibros();
    return json(libros ?? []);
  } catch (error) {
    console.error("Error cargando libros:", error);
    return json([]);
  }
};

export default function Index() {
  //Conexión BACK
  const data = useLoaderData<typeof loader>();

  return (
    <main className="w-full overflow-hidden">
      <section className="relative w-full">
        <div className="relative w-full h-[550px] md:h-[600px]">
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/65 z-10"></div>
          {/* Background image */}
          <img
            src="/public/img/paisaje.png?height=651&width=1440&&top=121px&text=paisaje"
            alt="Paisaje rural"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Content container */}
          <div className="absolute inset-0 flex flex-col items-start justify-center z-20 container mx-auto px-6 md:px-10">
            <div className="max-w-3xl">
              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Lectura y educación para el{" "}
                <span className="text-[#fa4616]">campo</span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg mb-8 text-white/90 leading-relaxed max-w-2xl">
                Llegamos hasta los pliegues más apartados de las montañas y los
                recodos escondidos de los ríos, para compartir sonrisas,
                alegrías y nuevas experiencias con las familias del campo.
              </p>

              {/* CTA Button */}
              <Link
                to="/libros"
                className="bg-[#fa4616] hover:bg-[#e03a0e] text-white font-medium py-3 px-8 rounded-md inline-flex items-center transition-colors"
              >
                <span>Biblioteca de libros</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-1 bg-[#002847] mb-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#002847]">
              Novedades
            </h2>
            <p className="text-gray-600 mt-3 text-center max-w-2xl">
              Descubre nuestras últimas publicaciones y mantente al día con
              nuestra biblioteca
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl gap-8 md:gap-10 m-auto">
            {Array.isArray(data?.responseElements) &&
              data.responseElements
                .slice(0, 4)
                .map((item: LibroResumen) => (
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
      </section>
    </main>
  );
}
