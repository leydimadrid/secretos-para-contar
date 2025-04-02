const API_URL = "http://localhost:5046/api/genero";

export async function getAllGeneros() {
  try {
    const response = await fetch(`${API_URL}/generos`);

    if (!response.ok) {
      throw new Error("Error al obtener los generos");
    }

    const data = await response.json();
    return data.responseElements || [];
  } catch (error) {
    console.error("Error en getAllgeneros:", error);
  }
}
