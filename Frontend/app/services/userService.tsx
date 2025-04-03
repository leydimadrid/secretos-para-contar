const API_URL = "http://localhost:5046/api/user";

export async function getAllUsuarios() {
  try {
    const response = await fetch(`${API_URL}/usuarios`);

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    const data = await response.json();
    return data.responseElements || [];
  } catch (error) {
    console.error("Error en getAllUsuarios:", error);
  }
}
