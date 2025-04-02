import { ArrowUp, Facebook, Linkedin, Twitter } from "lucide-react";
import { Link } from "@remix-run/react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-[#002847] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 relative">
              <img
                src="/public/img/Logotipo vertical.svg"
                alt="Secretos para contar"
                width={90}
                height={90}
              />
            </div>

            <p className="text-center max-w-md mb-6 font-light">
              Cada libro es un viaje. Gracias por permitirnos ser tu punto de
              partida.{" "}
            </p>

            <nav className="flex flex-wrap justify-center gap-8 mb-6">
              <Link to="/" className="hover:text-[#f94517]">
                Inicio
              </Link>
              <Link to="/libros" className="hover:text-[#f94517]">
                Libros
              </Link>
              <Link to="/audio-libros" className="hover:text-[#f94517]">
                Audio libros
              </Link>
              <Link to="/autores" className="hover:text-[#f94517]">
                Autores
              </Link>
              <Link to="/contacto" className="hover:text-[#f94517]">
                Contacto
              </Link>
            </nav>

            <div className="flex space-x-4 mb-6">
              <Link to="#" className="hover:text-[#f94517]">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="hover:text-[#f94517]">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="hover:text-[#f94517]">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>

            <p className="text-sm">
              Copyright © 2025. Secretosparacontar. All rights reserved.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 bg-white text-[#002847] p-2 rounded-full shadow-lg"
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </footer>
    </div>
  );
};

export default Footer;
