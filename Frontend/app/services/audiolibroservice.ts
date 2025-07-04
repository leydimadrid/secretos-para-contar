const API_URL = "http://3.140.73.64:5000/api/audiolibro";

export async function getAllAudiolibros() {
  try {
    const response = await fetch(`${API_URL}/audiolibros`);

    if (!response.ok) {
      throw new Error("Error al obtener los audiolibros");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAllAudiolibros:", error);
  }
}

export async function getAudiolibroById(Id: string) {
  const response = await fetch(`http://3.140.73.64:5000/api/audiolibro/${Id}`);

  if (!response.ok) {
    throw new Error(`Error al obtener el audiolibro con ID ${Id}`);
  }

  const data = await response.json();
  console.log("Audiolibro recibido:", data);
  return data;
}

export const crearAudiolibro = async (formData: FormData) => {
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

    // Verificar que la URL termine correctamente
    const url = API_URL.endsWith("/create") ? API_URL : `${API_URL}/create`;

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
        error instanceof Error ? error.message : "No se pudo crear el audiolibro",
    };
  }
};

export const actualizarAudiolibro = async (id: number, formData: FormData) => {
  try {
    // Imprimir los datos que se están enviando para depuración
    console.log("Datos enviados al backend para actualizar:", {
      url: `${API_URL}/update/${id}`,
      method: "PUT",
      formData: Object.fromEntries(formData.entries()),
    });

    // Verificar que la URL termine correctamente
    const url = `${API_URL}/update/${id}`;

    console.log("URL final para actualizar:", url);

    const response = await fetch(url, {
      method: "PUT", 
      body: formData,
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);

      // Intentar parsear el error como JSON si es posible
      try {
        const errorJson = JSON.parse(errorText);
        return {
          error:
            errorJson.message ||
            errorJson.error ||
            `Error ${response.status}: ${response.statusText}`,
        };
      } catch (e) {
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
    console.error("Error en actualizarAudiolibro:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el audiolibro",
    };
  }
};

export const eliminarAudiolibro = async (id: number) => {
  try {
    // Construir la URL correctamente
    const url = `${API_URL}/delete/${id}`;
    console.log("URL para eliminar:", url);

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar el audiolibro: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error en eliminarAudioLibro(${id}):`, error);
    throw error;
  }
};

export async function descargarAudiolibro(id: string) {
  const url = `${API_URL}/descargar/${id}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al descargar el audiolibro: ${response.status}`);
  }

  const blob = await response.blob();
  return blob;
}