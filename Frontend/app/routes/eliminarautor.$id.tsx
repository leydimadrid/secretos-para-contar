"use client";

import {
  type ActionFunction,
  json,
  type LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { X } from "lucide-react";
import { eliminarAutor } from "~/services/autorservice";
import { eliminarLibro, getLibroById } from "~/services/libroservice";

// Definir el tipo para los datos del loader
type LoaderData = {
  autor: {
    id: number;
    nombre: string;
    apellido: string;
    genero?: {
      nombre: string;
    };
  };
  error?: string;
};

// Loader para cargar los datos básicos del autor a eliminar
export const loader: LoaderFunction = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  if (!id) {
    return redirect("/panel");
  }

  try {
    const autor = await getLibroById(id.toString());
    if (!autor) {
      throw new Error("Autor no encontrado");
    }

    return json<LoaderData>({ autor });
  } catch (error) {
    console.error("Error al cargar el autor:", error);
    return json<LoaderData>(
      {
        autor: { id: 0, nombre: "", apellido: "" },
        error: "No se pudo cargar el autor",
      },
      { status: 404 }
    );
  }
};

export const action: ActionFunction = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");

  try {
    await eliminarAutor(id);
    return redirect("/panel");
  } catch (error) {
    console.error("Error al eliminar el autor:", error);
    return redirect("/panel");
  }
};

export default function EliminarAutor() {
  return (
    <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-[#002847]">Eliminar autor</h2>
            <p className="text-gray-500 text-sm mt-1">
              Confirme la eliminación del autor
            </p>
          </div>
          <a href="/panel" className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </a>
        </div>

        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  ¿Está seguro que desea eliminar este autor? Esta acción no se
                  puede deshacer.
                </p>
              </div>
            </div>
          </div>

          <Form method="post">
            <div className="flex justify-end gap-4 mt-6">
              <a
                href="/panel"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancelar
              </a>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
