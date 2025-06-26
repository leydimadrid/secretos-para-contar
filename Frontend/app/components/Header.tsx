import { Heart, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname; // Obtener la ruta actual
  const [name, setName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("name");
    if (storedUser) {
      setName(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (
      path === "/panel-administracion" &&
      pathname === "/panel-administracion"
    )
      return true;
    if (path === "/libros" && pathname === "/libros") return true;
    if (path === "audiolibros" && pathname === "audiolibros") return true;
    if (path === "autores" && pathname === "autores") return true;
    if (path === "/donaciones" && pathname === "/donaciones") return true;
    if (path === "/login" && pathname === "/login") return true;
    if (path === "/registro" && pathname === "/registro") return true;
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    return false;
  };

  return (
    <div className="flex w-11/12 justify-center">
      <div className="navbar bg-[#F9FAFB] shadow-sm justify-between max-w-7xl">
        <div className="flex">
          <Link to="/">
            <img
              src="/img/Logotipo vertical.svg"
              alt="Secretos para contar"
              width={90}
              height={90}
            />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex gap-10">
          <ul className="menu menu-horizontal px-1 text-sm gap-4">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/libros">Libros</Link>
            </li>
            <li>
              <Link to="/audiolibros">Audiolibros</Link>
            </li>
            <li>
              <Link to="/autores">Autores</Link>
            </li>
          </ul>
          <Link to="/donaciones">
            <button className="btn bg-[#fa4616] text-white">
              Donar ahora
              <Heart className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {name ? (
          <>
            <div className="flex gap-2">
              <div className="dropdown dropdown-end">
                <div className="flex gap-3">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <p className="content-center">{name}</p>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to="/panel">Panel de Administración</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>
                      <span>Cerrar Sesión</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="flex content-center gap-5">
            <Link to="/login" className="btn">
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="btn bg-[#fc5122] hover:bg-[#fa4616] text-white"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
