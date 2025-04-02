import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Login } from "~/services/auth";

const InicioSesion = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    // Validación del email
    if (!form.email) {
      newErrors.email = "El email es obligatorio.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "El email no es válido.";
      isValid = false;
    }

    // Validación de la contraseña
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria.";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = await Login(form.email, form.password);

    if (data) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      navigate("/");
    }
  };
  return (
    <div>
      <div
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/img/image-login.jpg')" }}
      >
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-white-800 dark:border-gray-700">
          {" "}
          <form className="space-y-6" action="#" onSubmit={handleSubmit}>
            <h5 className="text-xl text-center font-medium text-gray-900 dark:text-white">
              Iniciar sesión
            </h5>
            <div className="space-y-0">
              <label
                htmlFor="correo"
                className="block mb-2 text-sm font-semibold"
              >
                {" "}
                Email{" "}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"></div>
                <input
                  type="text"
                  id="correo"
                  className="bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-withe-700 dark:border-gray-600 
                dark:placeholder-black-400 dark:text-black dark:focus:ring-gray-400 dark:focus:border-gray-500"
                  placeholder="example@example.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-[#002847] dark:text-white"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div className="flex items-start">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Recuérdame
                </label>
              </div>
              <a
                href="#"
                className="ms-auto text-sm text-[#002847] hover:underline dark:text-blue-500"
              >
                Olvidaste la contraseña?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-[#002847] hover:bg-[#002847] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Ingresar
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              No estás registrado?
              <Link
                to="/registro"
                className="text-[#002847] hover:underline dark:text-blue-500"
              >
                Crear cuenta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
