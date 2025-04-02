import { type ChangeEvent, useState } from "react";

interface ImageToBase64Props {
  onBase64Generated: (base64: string) => void;
  stripPrefix?: boolean;
}

export const ImageToBase64 = ({
  onBase64Generated,
  stripPrefix = true,
}: ImageToBase64Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);

    if (file) {
      // Verificar el tamaño del archivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("La imagen es demasiado grande. El tamaño máximo es 2MB.");
        setSelectedFile(null);
        setPreviewUrl(null);
        onBase64Generated("");
        return;
      }

      setIsLoading(true);

      // Crear una vista previa (siempre con prefijo para mostrar correctamente)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onerror = () => {
        setError("Error al leer el archivo. Intente con otra imagen.");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);

      // Convertir a base64 con compresión
      compressImage(file, 800, 0.8)
        .then((compressedBase64) => {
          // Si stripPrefix es true, eliminamos el prefijo
          if (stripPrefix) {
            const base64Data =
              compressedBase64.split(",")[1] || compressedBase64;
            onBase64Generated(base64Data);
          } else {
            onBase64Generated(compressedBase64);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error al comprimir la imagen:", err);
          setError("Error al procesar la imagen. Intente con otra imagen.");
          setIsLoading(false);
        });
    } else {
      setPreviewUrl(null);
      onBase64Generated("");
    }
  };

  // Función para comprimir la imagen
  const compressImage = (
    file: File,
    maxWidth: number,
    quality: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Calcular las nuevas dimensiones manteniendo la proporción
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No se pudo obtener el contexto del canvas"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a base64 con compresión
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.onerror = () => {
          reject(new Error("Error al cargar la imagen"));
        };
      };
      reader.onerror = () => {
        reject(new Error("Error al leer el archivo"));
      };
    });
  };

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Portada del libro
      </label>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="portada-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500">Cargando imagen...</p>
            </div>
          ) : previewUrl ? (
            <div className="relative w-full h-full">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Vista previa"
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  onBase64Generated("");
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Haga clic para cargar</span> o
                arrastre y suelte
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG o JPEG (MAX. 2MB)
              </p>
            </div>
          )}
          <input
            id="portada-upload"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};
