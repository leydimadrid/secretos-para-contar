const apiUrl = import.meta.env.VITE_API_URL;

export async function getAllAutores() {
  try {
    const response = await fetch(`${apiUrl}/api/autor/autores`);

    if (!response.ok) {
      throw new Error("Error al obtener los autores");
    }

    const data = await response.json();
    return data.responseElements || [];
  } catch (error) {
    console.error("Error en getAllAutores:", error);
  }
}
export async function getAutorById(Id: string) {
  const response = await fetch(`${apiUrl}/api/autor/${Id}`);

  if (!response.ok) {
    throw new Error(`Error al obtener el autor con ID ${Id}`);
  }

  const data = await response.json();
  console.log("Autor recibido:", data);
  return data;
}

export const crearAutor = async (formData: FormData) => {
  try {
    const formDataObj: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        formDataObj[key] = `File: ${value.name} (${value.size} bytes)`;
      } else {
        if (typeof value === "string" && value.startsWith("data:image")) {
          formDataObj[key] = `${value.substring(0, 50)}... (Base64 image)`;
        } else {
          formDataObj[key] = value;
        }
      }
    });

    // Verificar que apiUrl esté definido y que la URL termine correctamente
    if (!apiUrl) {
      throw new Error("La variable de entorno PUBLIC_API_URL no está definida.");
    }
    const url = apiUrl.endsWith("/create") ? apiUrl : `${apiUrl}/api/autor/create`;

    console.log("URL final:", url);

    // Intentar hacer la solicitud con opciones adicionales
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);
    }

    // Intentar parsear la respuesta como JSON
    try {
      return await response.json();
    } catch (jsonError) {
      // Si no es JSON, devolver la respuesta como texto
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error en crearLibro:", error);
    return {
      error:
        error instanceof Error ? error.message : "No se pudo crear el libro",
    };
  }
};

export const actualizarAutor = async (id: number, formData: FormData) => {
  try {
    // Imprimir los datos que se están enviando para depuración
    console.log("Datos enviados al backend para actualizar:", {
      url: `${apiUrl}/api/autor/update/${id}`,
      method: "PUT",
      formData: Object.fromEntries(formData.entries()),
    });

    // Verificar que la URL termine correctamente
    const url = `${apiUrl}/api/autor/update/${id}`;

    console.log("URL final para actualizar:", url);

    const response = await fetch(url, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);

      try {
        const errorJson = JSON.parse(errorText);
        return {
          error:
            errorJson.message ||
            errorJson.error ||
            `Error ${response.status}: ${response.statusText}`,
        };
      } catch (e) {
        // Si no es JSON, devolver el texto del error
        return {
          error: `Error ${response.status}: ${
            errorText || response.statusText
          }`,
        };
      }
    }

    // Intentar parsear la respuesta como JSON
    try {
      return await response.json();
    } catch (jsonError) {
      // Si no es JSON, devolver la respuesta como texto
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error en actualizarAutor:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el autor",
    };
  }
};


export const eliminarAutor = async (id: number) => {
  try {
    // Construir la URL correctamente
    const url = `${apiUrl}/api/autor/delete/${id}`;
    console.log("URL para eliminar:", url);

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar el autor: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error en eliminarAutor(${id}):`, error);
    throw error;
  }
};