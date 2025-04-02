import { Link } from "@remix-run/react";
import { useState } from "react";
import Swal from "sweetalert2";
import { Register } from "~/services/auth";

const Registro = () => {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      name: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    };

    // Validación del nombre
    if (!form.name) {
      newErrors.name = "El nombre es obligatorio.";
      isValid = false;
    }

    // Validación de los apellidos
    if (!form.lastName) {
      newErrors.lastName = "El apellido es obligatorio.";
      isValid = false;
    }

    // Validación de username
    if (!form.userName) {
      newErrors.userName = "El username es obligatorio.";
      isValid = false;
    }

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

    if (!validateForm()) return; // No envía el formulario si hay errores

    const data = await Register(form);

    if (data) {
      Swal.fire("Usuario registrado con éxito");
      setForm({
        name: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/img/image-login.jpg')" }}
    >
      <div className="w-full max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-white-800 dark:border-gray-700">
        <form className="space-y-6" action="#" onSubmit={handleSubmit}>
          <h5
            className="text-xl font-medium text-center font-semibold"
            style={{ color: "#002847" }}
          >
            {" "}
            Registrarse{" "}
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm mb-2 font-medium font-semibold"
              >
                {" "}
                Nombre{" "}
              </label>
              <input
                type="text"
                id="nombre"
                className="rounded-md bg-white border border-gray-300 
                text-black focus:ring-black focus:border-black block flex-1 min-w-0 w-full text-sm p-2.5 
                dark:bg-white dark:border-gray-600 dark:text-black dark:focus:ring-black dark:focus:border-gray-200"
                placeholder="Nombres"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block text-sm mb-2 font-medium font-semibold"
              >
                {" "}
                Apellido{" "}
              </label>
              <input
                type="text"
                id="apellido"
                className="rounded-md bg-white border border-gray-300 
                text-black focus:ring-black focus:border-black block flex-1 min-w-0 w-full text-sm p-2.5 
                dark:bg-white dark:border-gray-600 dark:text-black dark:focus:ring-black dark:focus:border-gray-200"
                placeholder="Apellidos"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium font-semibold"
                style={{ color: "#002847" }}
              >
                {" "}
                Username{" "}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="correo"
                  className="bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-withe-700 dark:border-gray-600 
                dark:placeholder-black-400 dark:text-black dark:focus:ring-gray-400 dark:focus:border-gray-500"
                  placeholder="username"
                  value={form.userName}
                  onChange={(e) =>
                    setForm({ ...form, userName: e.target.value })
                  }
                />
                {errors.userName && (
                  <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
                )}
              </div>
            </div>
            <div className="space-y-0">
              <label
                htmlFor="correo"
                className="block mb-2 text-sm font-medium font-semibold"
              >
                {" "}
                Email{" "}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="correo"
                  className="bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-withe-700 dark:border-gray-600 
                dark:placeholder-black-400 dark:text-black dark:focus:ring-gray-400 dark:focus:border-gray-500"
                  placeholder="example@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="contraseña"
              className="block text-sm font-medium font-semibold"
              style={{ color: "#002847" }}
            >
              {" "}
              Contraseña{" "}
            </label>
            <input
              type="password"
              name="contraseña"
              id="contraseña"
              placeholder="**********"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              value={form.password}
              className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-400 block w-full p-2.5 dark:bg-white-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/*Términos y condiciones*/}
          <div className="flex items-start">
            <div className="flex items-center justify-start gap-1">
              <input id="aceptar" type="checkbox" />
              <label htmlFor="aceptar" className="ms-1 text-sm">
                Aceptar términos y condiciones
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-[#002847] hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900"
          >
            Registrarse
          </button>
          <div className="flex gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ya tienes una cuenta?
            </p>

            <Link
              to="/login"
              className="text-[#002847] hover:underline font-semibold text-sm"
            >
              Iniciar sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
