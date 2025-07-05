const apiUrl = import.meta.env.VITE_API_URL;

export async function getAllGeneros() {
  try {
    const response = await fetch(`${apiUrl}/api/genero/generos`);

    if (!response.ok) {
      throw new Error("Error al obtener los generos");
    }

    const data = await response.json();
    return data.responseElements || [];
  } catch (error) {
    console.error("Error en getAllgeneros:", error);
  }
}
