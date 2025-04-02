const API_URL = "http://localhost:5046/api/audiolibro";

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
  const response = await fetch(`http://localhost:5046/api/audiolibro/${Id}`);

  if (!response.ok) {
    throw new Error(`Error al obtener el audiolibro con ID ${Id}`);
  }

  const data = await response.json();
  console.log("Audiolibro recibido:", data);
  return data;
}


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