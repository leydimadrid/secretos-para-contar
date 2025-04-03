import { SetStateAction, useState } from "react";
import { Link } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";

const DonacionesPage = () => {
  const [montoSeleccionado, setMontoSeleccionado] = useState("20");
  const [otroMonto, setOtroMonto] = useState("");
  const [mostrarOtroMonto, setMostrarOtroMonto] = useState(false);
  const [metodoPago, setMetodoPago] = useState("visa");
  const [guardarSeleccion, setGuardarSeleccion] = useState(false);
  const [moneda, setMoneda] = useState("USD");
  const [frecuencia, setFrecuencia] = useState("mensual");

  const handleMontoClick = (monto: SetStateAction<string>) => {
    if (monto === "otro") {
      setMostrarOtroMonto(true);
      setMontoSeleccionado("otro");
    } else {
      setMostrarOtroMonto(false);
      setMontoSeleccionado(monto);
    }
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 bg-white mt-11 mb-11">
      {/* Botón de regreso */}
      <div className="mb-6">
        <Link
          to="/inicio"
          className="inline-flex items-center text-[#002847] hover:text-[#fa4616] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Regresar</span>
        </Link>
      </div>

      {/* Título principal */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#002847] mb-8">
        Dona ahora!
      </h1>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna izquierda - Opciones de donación */}
        <div className="md:col-span-2 space-y-8">
          {/* Selectores de moneda y frecuencia */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mb-6">
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white select-custom"
            >
              <option value="USD">USD$</option>
              <option value="COP">COP$</option>
              <option value="EUR">EUR€</option>
            </select>

            <select
              value={frecuencia}
              onChange={(e) => setFrecuencia(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white select-custom"
            >
              <option value="unica">Donación Única</option>
              <option value="mensual">Donación Mensual</option>
              <option value="anual">Donación Anual</option>
            </select>
          </div>

          {/* Botones de montos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {["10", "20", "30"].map((monto) => (
              <button
                key={monto}
                onClick={() => handleMontoClick(monto)}
                className={`py-3 px-4 rounded-md text-lg font-medium transition-colors ${
                  montoSeleccionado === monto
                    ? "bg-[#fa4616] text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                ${monto}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleMontoClick("60")}
              className={`py-3 px-4 rounded-md text-lg font-medium transition-colors ${
                montoSeleccionado === "60"
                  ? "bg-[#fa4616] text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              $60
            </button>
            <button
              onClick={() => handleMontoClick("otro")}
              className={`py-3 px-4 rounded-md text-lg font-medium transition-colors ${
                montoSeleccionado === "otro"
                  ? "bg-[#fa4616] text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              $ Otro Monto
            </button>
          </div>

          {/* Input para otro monto */}
          {mostrarOtroMonto && (
            <div className="mt-4">
              <label
                htmlFor="otroMonto"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ingrese el monto deseado:
              </label>
              <input
                type="number"
                id="otroMonto"
                value={otroMonto}
                onChange={(e) => setOtroMonto(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ingrese monto"
              />
            </div>
          )}

          {/* Checkbox para guardar selección */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="guardarSeleccion"
              checked={guardarSeleccion}
              onChange={() => setGuardarSeleccion(!guardarSeleccion)}
              className="h-4 w-4 text-[#fa4616] rounded border-gray-300 focus:ring-[#fa4616] checkbox-custom"
            />
            <label
              htmlFor="guardarSeleccion"
              className="ml-2 block text-sm text-gray-700"
            >
              Guardar Selección
            </label>
          </div>

          {/* Métodos de pago */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-[#002847] mb-4">
              Escoja método de pago
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setMetodoPago("visa")}
                className={`px-6 py-3 rounded-md border transition-colors ${
                  metodoPago === "visa"
                    ? "border-[#fa4616] bg-white text-[#002847]"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                VISA
              </button>
              <button
                onClick={() => setMetodoPago("paypal")}
                className={`px-6 py-3 rounded-md border transition-colors ${
                  metodoPago === "paypal"
                    ? "border-[#fa4616] bg-white text-[#002847]"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                PayPal
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha - Resumen y botón de donación */}
        <div className="md:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#002847] mb-4">
              Resumen de donación
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-medium">
                  {moneda === "USD" ? "$" : moneda === "EUR" ? "€" : "COP$"}
                  {montoSeleccionado === "otro"
                    ? otroMonto || "0"
                    : montoSeleccionado}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frecuencia:</span>
                <span className="font-medium">
                  {frecuencia === "unica"
                    ? "Única"
                    : frecuencia === "mensual"
                    ? "Mensual"
                    : "Anual"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Método de pago:</span>
                <span className="font-medium capitalize">{metodoPago}</span>
              </div>
            </div>

            <button className="w-full bg-[#fa4616] hover:bg-[#f94517] text-white font-bold py-3 px-4 rounded-md transition-colors uppercase">
              ¡Donar!
            </button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Tu donación ayuda a llevar educación y lectura a las zonas rurales
              de Colombia.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DonacionesPage;
