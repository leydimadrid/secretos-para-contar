const apiUrl = import.meta.env.VITE_API_URL;

export async function getAllUsuarios() {
  try {
    const response = await fetch(`${apiUrl}/api/user/usuarios`);

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    const data = await response.json();
    return data.responseElements || [];
  } catch (error) {
    console.error("Error en getAllUsuarios:", error);
  }
}
