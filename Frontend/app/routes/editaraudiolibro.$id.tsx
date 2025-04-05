import type React from "react";

import {
  type ActionFunction,
  json,
  type LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { ImageToBase64 } from "~/components/Base64Util";
import type { AutorResumen } from "~/models/Autor";
import type { EditarLibro } from "~/models/Libro";
import type { Genero } from "~/models/Genero";
import { getAllAutores } from "~/services/autorservice";
import { getAllGeneros } from "~/services/generoservice";
import {
  actualizarAudiolibro,
  getAudiolibroById,
} from "~/services/audiolibroservice";
import { AudiolibroCrear } from "~/models/AudioLibro";

// Definir el tipo para los errores
type ActionData = {
  errores?: Record<string, string>;
  error?: string;
  success?: boolean;
  debugInfo?: any;
};

export const loader: LoaderFunction = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  if (!id) {
    return redirect("/panel");
  }

  try {
    const audiolibro = await getAudiolibroById(id.toString());
    if (!audiolibro) {
      throw new Error("Audiolibro no encontrado");
    }
    return json({ audiolibro });
  } catch (error) {
    console.error("Error al cargar el audiolibro:", error);
    return json({ error: "No se pudo cargar el audiolibro" }, { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const id = Number.parseInt(params.id || "0");
    if (!id) {
      return json<ActionData>(
        { error: "ID de audiolibro no válido" },
        { status: 400 }
      );
    }

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

    // Crear un objeto con los datos del libro
    const audiolibroData = {
      Titulo: formData.get("titulo") as string,
      AutorId: Number.parseInt(formData.get("autorId") as string) || 0,
      GeneroId: Number.parseInt(formData.get("generoId") as string) || 0,
      Duracion: formData.get("duracion") as string,
      Portada: (formData.get("portada") as string) || "",
      TamañoMB: (formData.get("tamaño_m_b") as string) || "",
      Narrador: formData.get("narrador") as string,
      Idioma: (formData.get("idioma") as string) || "",
    };

    // Validar datos requeridos
    const errores: Record<string, string> = {};
    if (!audiolibroData.Titulo) errores["titulo"] = "El título es requerido";
    if (!audiolibroData.AutorId)
      errores["autorId"] = "Debe seleccionar un autor";
    if (!audiolibroData.GeneroId)
      errores["generoId"] = "Debe seleccionar un género";
    if (!audiolibroData.Duracion)
      errores["duracion"] = "La duracion es requerida";
    if (!audiolibroData.TamañoMB)
      errores["tamanomb"] = "El Tamaño es requerido";
    if (!audiolibroData.Narrador)
      errores["narrador"] = "El narrador es requerido";
    if (!audiolibroData.Idioma) errores["idioma"] = "El idioma es requerido";

    if (Object.keys(errores).length > 0) {
      return json<ActionData>({ errores }, { status: 400 });
    }

    // Crear un nuevo FormData para enviar al backend
    const audiolibroActualizado = new FormData();

    // Agregar el ID del audiolibro
    audiolibroActualizado.append("Id", id.toString());

    // Agregar los campos de texto al FormData
    Object.entries(audiolibroData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== "Id") {
        audiolibroActualizado.append(key, String(value));
      }
    });

    // Agregar el archivo si existe
    const archivo = formData.get("pathArchivo") as File;
    if (archivo && archivo.size > 0) {
      audiolibroActualizado.append("pathArchivo", archivo);
    }

    const resultado = await actualizarAudiolibro(id, audiolibroActualizado);
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

export default function EditarAudiolibro() {
  const { audiolibro } = useLoaderData<{
    audiolibro: AudiolibroCrear;
    error?: string;
  }>();

  console.log(audiolibro);

  const actionData = useActionData<ActionData>();
  const [autores, setAutores] = useState<AutorResumen[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [bookCoverBase64, setBookCoverBase64] = useState<string | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArchivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setArchivo(file);
  };

  useEffect(() => {
    // Obtener los autores y géneros al cargar el componente
    const fetchData = async () => {
      try {
        const autoresData = await getAllAutores();
        const generosData = await getAllGeneros();
        setAutores(autoresData);
        setGeneros(generosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();

    // Inicializar el estado con los datos del libro
    if (audiolibro?.portada) {
      setBookCoverBase64(audiolibro.portada);
    }
  }, [audiolibro]);

  const handleBase64Generated = (base64: string) => {
    setBookCoverBase64(base64);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
  };
  return (
    <div>
      <div className="container rounded-lg max-w-6xl mx-auto mt-7 mb-7">
        <div className="flex justify-between ml-40 items-center">
          <div>
            <h2 className="text-xl font-bold text-[#002847]">
              Editar audiolibro
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Modifique los detalles del audiolibro
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
                Título
              </label>
              <div>
                <input
                  type="text"
                  name="titulo"
                  placeholder="Ingrese el título"
                  className={`w-full px-3 py-2 border ${
                    actionData?.errores?.titulo
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded`}
                  required
                />
                {actionData?.errores?.titulo && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errores.titulo}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-center gap-4">
              <label className="text-right font-medium text-gray-700">
                Autor
              </label>
              <div>
                <select
                  name="autorId"
                  defaultValue={audiolibro.autorId}
                  className={`w-full px-3 py-2 border ${
                    actionData?.errores?.autorId
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded`}
                  required
                >
                  <option value="">Seleccione un autor</option>
                  {autores.map((autor: AutorResumen) => (
                    <option key={autor.id} value={autor.id}>
                      {autor.nombre} {autor.apellidos}
                    </option>
                  ))}
                </select>
                {actionData?.errores?.autorId && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errores.autorId}
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
                Duracion
              </label>
              <div>
                <input
                  type="text"
                  name="duracion"
                  placeholder="Ingrese la duración"
                  className={`w-full px-3 py-2 border ${
                    actionData?.errores?.duracion
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded`}
                  required
                />
                {actionData?.errores?.duracion && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errores.duracion}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-start gap-4">
              <label className="text-right font-medium text-gray-700 pt-2">
                Tamaño MB
              </label>
              <input
                type="text"
                name="tamaño_m_b"
                placeholder="Ingrese el tamaño"
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

            <div className="grid grid-cols-[120px,1fr] items-center gap-4">
              <label className="text-right font-medium text-gray-700">
                Narrador
              </label>
              <div>
                <input
                  type="text"
                  name="narrador"
                  placeholder="Ingrese el narrador"
                  className={`w-full px-3 py-2 border ${
                    actionData?.errores?.narrador
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded`}
                  required
                />
                {actionData?.errores?.isnarradorbn && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errores.narrador}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-center gap-4">
              <label
                htmlFor="pdf"
                className="text-right font-medium text-gray-700"
              >
                Audio o video
              </label>
              <div className="flex">
                <input
                  type="file"
                  id="pathArchivo"
                  name="pathArchivo"
                  accept=".mp3, .mp4"
                  required
                  onChange={handleArchivoChange}
                />
              </div>
            </div>

            <div className="flex flex-col items-center my-10">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portada del audiolibro
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
                    alt="Portada"
                    className="rounded-3xl border"
                  />
                </div>
              )}

              <input
                type="hidden"
                name="portada"
                value={bookCoverBase64 || ""}
              />
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
