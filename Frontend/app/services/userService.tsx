const API_URL = "http://localhost:5046/api/user";

export async function getAllUsuarios() {
  try {
    const response = await fetch(`${API_URL}/usuarios`);

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAllUsers:", error);
  }
}
