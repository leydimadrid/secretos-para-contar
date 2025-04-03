import type React from "react";

import { type ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ImageToBase64 } from "~/components/Base64Util";
import type { Genero } from "~/models/Libro";
import { getAllGeneros } from "~/services/generoservice";

import { crearAutor } from "~/services/autorservice";

// Definir el tipo para los errores
type ActionData = {
  errores?: Record<string, string>;
  error?: string;
  success?: boolean;
  debugInfo?: any;
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const debugFormData: Record<string, any> = {};

    // Crear una copia para depuración
    formData.forEach((value, key) => {
      if (value instanceof File) {
        debugFormData[key] = `File: ${value.name} (${value.size} bytes)`;
      } else if (typeof value === "string" && value.startsWith("data:image")) {
        debugFormData[key] = `${value.substring(0, 50)}... (Base64 image)`;
      } else {
        debugFormData[key] = value;
      }
    });

    console.log("Datos del formulario:", debugFormData);

    // Crear un objeto con los datos del autor
    const autorData = {
      Nombre: formData.get("nombre") as string,
      Apellido: formData.get("apellido") as string,
      GeneroId: Number.parseInt(formData.get("generoId") as string) || 0,
      Foto: (formData.get("foto") as string) || "",
      Nacionalidad: (formData.get("nacionalidad") as string) || "",
      Biografia: formData.get("biografia") as string,
      Idioma: (formData.get("idioma") as string) || "",
    };

    // Validar datos requeridos
    const errores: Record<string, string> = {};
    if (!autorData.Nombre) errores["nombre"] = "El nombre es requerido";
    if (!autorData.Apellido) errores["apellido"] = "El apellido es requerido";
    if (!autorData.GeneroId) errores["generoId"] = "Debe seleccionar un género";
    if (!autorData.Nacionalidad)
      errores["nacionalidad"] = "La nacionalidad es requerida";
    if (!autorData.Biografia)
      errores["biografia"] = "La biografía es requerida";
    if (!autorData.Idioma) errores["idioma"] = "El idioma es requerido";

    if (Object.keys(errores).length > 0) {
      return json<ActionData>({ errores }, { status: 400 });
    }

    // Crear un nuevo FormData para enviar al backend
    const nuevoAutor = new FormData();

    // Agregar los campos de texto al FormData
    Object.entries(autorData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        nuevoAutor.append(key, String(value));
      }
    });

    const resultado = await crearAutor(nuevoAutor);
    console.log("Respuesta del backend:", resultado);

    if (resultado.error) {
      return json<ActionData>(
        {
          error: resultado.error,
          debugInfo: debugFormData,
        },
        { status: 400 }
      );
    }
    return redirect("/panel");
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return json<ActionData>(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al procesar el formulario",
      },
      { status: 500 }
    );
  }
};

export default function AgregarAutor() {
  const navigate = useNavigate();
  const actionData = useActionData<ActionData>();
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [bookCoverBase64, setBookCoverBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Obtener los géneros al cargar el componente
    const fetchData = async () => {
      try {
        const generosData = await getAllGeneros();
        setGeneros(generosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleBase64Generated = (base64: string) => {
    setBookCoverBase64(base64);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    navigate("/panel");
  };
  return (
    <div>
      <div className="container rounded-lg max-w-6xl mx-auto mt-7 mb-7">
        <div className="flex justify-between ml-40 items-center">
          <div>
            <h2 className="text-xl font-bold text-[#002847]">
              Agregar nuevo autor
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Complete los detalles del autor y suba los archivos necesarios
            </p>
          </div>
        </div>

        {actionData?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded">
            <p className="font-bold">Error:</p>
            <p>{actionData.error}</p>
            {actionData.debugInfo && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">
                  Ver detalles técnicos
                </summary>
                <pre className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-red-50">
                  {JSON.stringify(actionData.debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        <Form
          method="post"
          className="p-6"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-6">
            <div className="grid grid-cols-[120px,1fr] items-center gap-4">
              <label className="text-right font-medium text-gray-700">
                Nombre
              </label>
              <div>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingrese el nombre"
                  className={`w-full px-3 py-2 border ${
                    actionData?.errores?.nombre
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded`}
                  required
                />
                {actionData?.errores?.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errores.nombre}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-center gap-4">
              <label className="text-right font-medium text-gray-700">
                Apellido
              </label>
              <div>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Ingrese el apellido"
                  className={`w-full px-3 py-2 border ${
                    actionData?.errores?.apellido
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded`}
                  required
                />
                {actionData?.errores?.apellido && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errores.apellido}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-center gap-4">
              <label className="text-right font-medium text-gray-700">
                Género
              </label>
              <div>
                <select
                  name="generoId"
                  className={`w-full px-3 py-2 border ${
                    actionData?.errores?.generoId
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded`}
                  required
                >
                  <option value="">Seleccione un género</option>
                  {generos.map((genero: Genero) => (
                    <option key={genero.id} value={genero.id}>
                      {genero.nombre}
                    </option>
                  ))}
                </select>
                {actionData?.errores?.generoId && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errores.generoId}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-center gap-4">
              <label className="text-right font-medium text-gray-700">
                Nacionalidad
              </label>
              <div>
                <input
                  type="text"
                  name="nacionalidad"
                  placeholder="Ingrese la nacionalidad"
                  className={`w-full px-3 py-2 border ${
                    actionData?.errores?.nacionalidad
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded`}
                  required
                />
                {actionData?.errores?.nacionalidad && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errores.nacionalidad}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-start gap-4">
              <label className="text-right font-medium text-gray-700 pt-2">
                Biografía
              </label>
              <textarea
                name="biografia"
                placeholder="Ingrese la biografía"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded resize-none"
              />
            </div>

            <div className="grid grid-cols-[120px,1fr] items-center gap-4">
              <label className="text-right font-medium text-gray-700">
                Idioma
              </label>
              <input
                type="text"
                name="idioma"
                placeholder="Ingrese el idioma"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="flex flex-col items-center my-10">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto del autor
            </label>
              <ImageToBase64
                onBase64Generated={handleBase64Generated}
                stripPrefix={true}
              />
              {bookCoverBase64 && (
                <div className="mt-4 max-w-lg mx-auto">
                  <img
                    src={
                      bookCoverBase64.startsWith("data:")
                        ? bookCoverBase64
                        : `data:image/jpeg;base64,${bookCoverBase64}`
                    }
                    alt="foto"
                    className="rounded-3xl border"
                  />
                </div>
              )}

              <input type="hidden" name="foto" value={bookCoverBase64 || ""} />
            </div>
          </div>

          <div className="flex justify-end mt-8 gap-6">
            <button
              type="submit"
              className="bg-[#002847] text-white px-6 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            <a
              href="/panel"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded text-center"
            >
              Cancelar
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
