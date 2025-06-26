import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, redirect, json } from "@remix-run/node";
import { RemixServer, useLocation, useNavigate, Link, Outlet, Meta, Links, ScrollRestoration, Scripts, Form, useLoaderData, useActionData } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Heart, Facebook, Twitter, Linkedin, ArrowUp, X, ArrowRight, Download, Home, ArrowLeft, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  location.pathname;
  const [name, setName] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("name");
    if (storedUser) {
      setName(storedUser);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };
  return /* @__PURE__ */ jsx("div", { className: "flex w-11/12 justify-center", children: /* @__PURE__ */ jsxs("div", { className: "navbar bg-[#F9FAFB] shadow-sm justify-between max-w-7xl", children: [
    /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/public/img/Logotipo vertical.svg",
        alt: "Secretos para contar",
        width: 90,
        height: 90
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "navbar-center hidden lg:flex gap-10", children: [
      /* @__PURE__ */ jsxs("ul", { className: "menu menu-horizontal px-1 text-sm gap-4", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Inicio" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/libros", children: "Libros" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/audiolibros", children: "Audiolibros" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/autores", children: "Autores" }) })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/donaciones", children: /* @__PURE__ */ jsxs("button", { className: "btn bg-[#fa4616] text-white", children: [
        "Donar ahora",
        /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4" })
      ] }) })
    ] }),
    name ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs("div", { className: "dropdown dropdown-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            tabIndex: 0,
            role: "button",
            className: "btn btn-ghost btn-circle avatar",
            children: /* @__PURE__ */ jsx("div", { className: "w-10 rounded-full", children: /* @__PURE__ */ jsx(
              "img",
              {
                alt: "Tailwind CSS Navbar component",
                src: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "content-center", children: name })
      ] }),
      /* @__PURE__ */ jsxs(
        "ul",
        {
          tabIndex: 0,
          className: "menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow",
          children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/panel", children: "Panel de Administración" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: handleLogout, children: /* @__PURE__ */ jsx("span", { children: "Cerrar Sesión" }) }) })
          ]
        }
      )
    ] }) }) }) : /* @__PURE__ */ jsxs("div", { className: "flex content-center gap-5", children: [
      /* @__PURE__ */ jsx(Link, { to: "/login", className: "btn", children: "Iniciar sesión" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/registro",
          className: "btn bg-[#fc5122] hover:bg-[#fa4616] text-white",
          children: "Registrarse"
        }
      )
    ] })
  ] }) });
};
const Footer = () => {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("footer", { className: "bg-[#002847] text-white", children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 relative", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/public/img/Logotipo vertical.svg",
          alt: "Secretos para contar",
          width: 90,
          height: 90
        }
      ) }),
      /* @__PURE__ */ jsxs("p", { className: "text-center max-w-md mb-6 font-light", children: [
        "Cada libro es un viaje. Gracias por permitirnos ser tu punto de partida.",
        " "
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex flex-wrap justify-center gap-8 mb-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-[#f94517]", children: "Inicio" }),
        /* @__PURE__ */ jsx(Link, { to: "/libros", className: "hover:text-[#f94517]", children: "Libros" }),
        /* @__PURE__ */ jsx(Link, { to: "/audiolibros", className: "hover:text-[#f94517]", children: "Audio libros" }),
        /* @__PURE__ */ jsx(Link, { to: "/autores", className: "hover:text-[#f94517]", children: "Autores" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-4 mb-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "#", className: "hover:text-[#f94517]", children: /* @__PURE__ */ jsx(Facebook, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(Link, { to: "#", className: "hover:text-[#f94517]", children: /* @__PURE__ */ jsx(Twitter, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(Link, { to: "#", className: "hover:text-[#f94517]", children: /* @__PURE__ */ jsx(Linkedin, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Copyright © 2025. Secretosparacontar. All rights reserved." })
    ] }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          const scrollDuration = 500;
          const scrollStep = -window.scrollY / (scrollDuration / 16);
          const scrollInterval = setInterval(() => {
            window.scrollBy(0, scrollStep);
            if (window.scrollY === 0) {
              clearInterval(scrollInterval);
            }
          }, 16);
        },
        className: "fixed bottom-4 right-4 bg-white text-[#002847] p-2 rounded-full shadow-lg",
        "aria-label": "Volver arriba",
        children: /* @__PURE__ */ jsx(ArrowUp, { className: "h-5 w-5" })
      }
    )
  ] }) });
};
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "icon", type: "image/x-icon", href: "/public/favicon.png" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500&display=swap"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Header, {}),
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const API_URL$3 = "http://localhost:5046/api/audiolibro";
async function getAllAudiolibros() {
  try {
    const response = await fetch(`${API_URL$3}/audiolibros`);
    if (!response.ok) {
      throw new Error("Error al obtener los audiolibros");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getAllAudiolibros:", error);
  }
}
async function getAudiolibroById(Id) {
  const response = await fetch(`http://localhost:5046/api/audiolibro/${Id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener el audiolibro con ID ${Id}`);
  }
  const data = await response.json();
  console.log("Audiolibro recibido:", data);
  return data;
}
const crearAudiolibro = async (formData) => {
  try {
    const formDataObj = {};
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
    const url = API_URL$3.endsWith("/create") ? API_URL$3 : `${API_URL$3}/create`;
    console.log("URL final:", url);
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);
    }
    try {
      return await response.json();
    } catch (jsonError) {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error en crearLibro:", error);
    return {
      error: error instanceof Error ? error.message : "No se pudo crear el audiolibro"
    };
  }
};
const actualizarAudiolibro = async (id, formData) => {
  try {
    console.log("Datos enviados al backend para actualizar:", {
      url: `${API_URL$3}/update/${id}`,
      method: "PUT",
      formData: Object.fromEntries(formData.entries())
    });
    const url = `${API_URL$3}/update/${id}`;
    console.log("URL final para actualizar:", url);
    const response = await fetch(url, {
      method: "PUT",
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return {
          error: errorJson.message || errorJson.error || `Error ${response.status}: ${response.statusText}`
        };
      } catch (e) {
        return {
          error: `Error ${response.status}: ${errorText || response.statusText}`
        };
      }
    }
    try {
      return await response.json();
    } catch (jsonError) {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error en actualizarAudiolibro:", error);
    return {
      error: error instanceof Error ? error.message : "No se pudo actualizar el audiolibro"
    };
  }
};
const eliminarAudiolibro = async (id) => {
  try {
    const url = `${API_URL$3}/delete/${id}`;
    console.log("URL para eliminar:", url);
    const response = await fetch(url, {
      method: "DELETE"
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
async function descargarAudiolibro(id) {
  const url = `${API_URL$3}/descargar/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Error al descargar el audiolibro: ${response.status}`);
  }
  const blob = await response.blob();
  return blob;
}
const loader$d = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  if (!id) {
    return redirect("/panel");
  }
  try {
    const libro = await getAudiolibroById(id.toString());
    if (!libro) {
      throw new Error("Audiolibro no encontrado");
    }
    return json({ libro });
  } catch (error) {
    console.error("Error al cargar el audiolibro:", error);
    return json(
      {
        libro: { id: 0, titulo: "" },
        error: "No se pudo cargar el audiolibro"
      },
      { status: 404 }
    );
  }
};
const action$8 = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  try {
    await eliminarAudiolibro(id);
    return redirect("/panel");
  } catch (error) {
    console.error("Error al eliminar el audiolibro:", error);
    return redirect("/panel");
  }
};
function EliminarAudioLibro() {
  return /* @__PURE__ */ jsx("div", { className: "inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Eliminar audiolibro" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Confirme la eliminación del audiolibro" })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/panel", className: "text-gray-500 hover:text-gray-700", children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: "¿Está seguro que desea eliminar este audiolibro? Esta acción no se puede deshacer." }) }) }) }),
      /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4 mt-6", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/panel",
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
            children: "Eliminar"
          }
        )
      ] }) })
    ] })
  ] }) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: EliminarAudioLibro,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
const ImageToBase64 = ({
  onBase64Generated,
  stripPrefix = true
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleFileChange = (event) => {
    var _a;
    const file = ((_a = event.target.files) == null ? void 0 : _a[0]) || null;
    setSelectedFile(file);
    setError(null);
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("La imagen es demasiado grande. El tamaño máximo es 2MB.");
        setSelectedFile(null);
        setPreviewUrl(null);
        onBase64Generated("");
        return;
      }
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.onerror = () => {
        setError("Error al leer el archivo. Intente con otra imagen.");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
      compressImage(file, 800, 0.8).then((compressedBase64) => {
        if (stripPrefix) {
          const base64Data = compressedBase64.split(",")[1] || compressedBase64;
          onBase64Generated(base64Data);
        } else {
          onBase64Generated(compressedBase64);
        }
        setIsLoading(false);
      }).catch((err) => {
        console.error("Error al comprimir la imagen:", err);
        setError("Error al procesar la imagen. Intente con otra imagen.");
        setIsLoading(false);
      });
    } else {
      setPreviewUrl(null);
      onBase64Generated("");
    }
  };
  const compressImage = (file, maxWidth, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        var _a;
        const img = new Image();
        img.src = (_a = event.target) == null ? void 0 : _a.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = height * maxWidth / width;
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
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full", children: /* @__PURE__ */ jsxs(
      "label",
      {
        htmlFor: "portada-upload",
        className: "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100",
        children: [
          isLoading ? /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center pt-5 pb-6", children: /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm text-gray-500", children: "Cargando imagen..." }) }) : previewUrl ? /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: previewUrl || "/placeholder.svg",
                alt: "Vista previa",
                className: "w-full h-full object-contain rounded-lg"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.preventDefault();
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  onBase64Generated("");
                },
                className: "absolute top-2 right-2 bg-red-500 text-white rounded-full p-1",
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center pt-5 pb-6", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-10 h-10 mb-3 text-gray-400",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm text-gray-500", children: /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Haga clic para cargar" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "PNG, JPG o JPEG (MAX. 2MB)" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "portada-upload",
              type: "file",
              className: "hidden",
              accept: "image/png, image/jpeg, image/jpg",
              onChange: handleFileChange
            }
          )
        ]
      }
    ) }),
    error && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-red-600", children: error })
  ] });
};
const API_URL$2 = "http://localhost:5046/api/autor";
async function getAllAutores() {
  try {
    const response = await fetch(`${API_URL$2}/autores`);
    if (!response.ok) {
      throw new Error("Error al obtener los autores");
    }
    const data = await response.json();
    return data.responseElements || [];
  } catch (error) {
    console.error("Error en getAllAutores:", error);
  }
}
async function getAutorById(Id) {
  const response = await fetch(`http://localhost:5046/api/autor/${Id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener el autor con ID ${Id}`);
  }
  const data = await response.json();
  console.log("Autor recibido:", data);
  return data;
}
const crearAutor = async (formData) => {
  try {
    const formDataObj = {};
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
    const url = API_URL$2.endsWith("/create") ? API_URL$2 : `${API_URL$2}/create`;
    console.log("URL final:", url);
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);
    }
    try {
      return await response.json();
    } catch (jsonError) {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error en crearLibro:", error);
    return {
      error: error instanceof Error ? error.message : "No se pudo crear el libro"
    };
  }
};
const actualizarAutor = async (id, formData) => {
  try {
    console.log("Datos enviados al backend para actualizar:", {
      url: `${API_URL$2}/update/${id}`,
      method: "PUT",
      formData: Object.fromEntries(formData.entries())
    });
    const url = `${API_URL$2}/update/${id}`;
    console.log("URL final para actualizar:", url);
    const response = await fetch(url, {
      method: "PUT",
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return {
          error: errorJson.message || errorJson.error || `Error ${response.status}: ${response.statusText}`
        };
      } catch (e) {
        return {
          error: `Error ${response.status}: ${errorText || response.statusText}`
        };
      }
    }
    try {
      return await response.json();
    } catch (jsonError) {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error en actualizarAutor:", error);
    return {
      error: error instanceof Error ? error.message : "No se pudo actualizar el autor"
    };
  }
};
const eliminarAutor = async (id) => {
  try {
    const url = `${API_URL$2}/delete/${id}`;
    console.log("URL para eliminar:", url);
    const response = await fetch(url, {
      method: "DELETE"
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
const API_URL$1 = "http://localhost:5046/api/genero";
async function getAllGeneros() {
  try {
    const response = await fetch(`${API_URL$1}/generos`);
    if (!response.ok) {
      throw new Error("Error al obtener los generos");
    }
    const data = await response.json();
    return data.responseElements || [];
  } catch (error) {
    console.error("Error en getAllgeneros:", error);
  }
}
const loader$c = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  if (!id) {
    return redirect("/panel");
  }
  try {
    const audiolibro = await getAudiolibroById(id.toString());
    if (!audiolibro) {
      throw new Error("Audiolibro no encontrado");
    }
    return json({ audiolibro });
  } catch (error) {
    console.error("Error al cargar el audiolibro:", error);
    return json({ error: "No se pudo cargar el audiolibro" }, { status: 404 });
  }
};
const action$7 = async ({ request, params }) => {
  try {
    const id = Number.parseInt(params.id || "0");
    if (!id) {
      return json(
        { error: "ID de audiolibro no válido" },
        { status: 400 }
      );
    }
    const formData = await request.formData();
    const debugFormData = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        debugFormData[key] = `File: ${value.name} (${value.size} bytes)`;
      } else if (typeof value === "string" && value.startsWith("data:image")) {
        debugFormData[key] = `${value.substring(0, 50)}... (Base64 image)`;
      } else {
        debugFormData[key] = value;
      }
    });
    console.log("Datos del formulario:", debugFormData);
    const audiolibroData = {
      Titulo: formData.get("titulo"),
      AutorId: Number.parseInt(formData.get("autorId")) || 0,
      GeneroId: Number.parseInt(formData.get("generoId")) || 0,
      Duracion: formData.get("duracion"),
      Portada: formData.get("portada") || "",
      TamañoMB: formData.get("tamaño_m_b") || "",
      Narrador: formData.get("narrador"),
      Idioma: formData.get("idioma") || ""
    };
    const errores = {};
    if (!audiolibroData.Titulo) errores["titulo"] = "El título es requerido";
    if (!audiolibroData.AutorId)
      errores["autorId"] = "Debe seleccionar un autor";
    if (!audiolibroData.GeneroId)
      errores["generoId"] = "Debe seleccionar un género";
    if (!audiolibroData.Duracion)
      errores["duracion"] = "La duracion es requerida";
    if (!audiolibroData.TamañoMB)
      errores["tamanomb"] = "El Tamaño es requerido";
    if (!audiolibroData.Narrador)
      errores["narrador"] = "El narrador es requerido";
    if (!audiolibroData.Idioma) errores["idioma"] = "El idioma es requerido";
    if (Object.keys(errores).length > 0) {
      return json({ errores }, { status: 400 });
    }
    const audiolibroActualizado = new FormData();
    audiolibroActualizado.append("Id", id.toString());
    Object.entries(audiolibroData).forEach(([key, value]) => {
      if (value !== null && value !== void 0 && key !== "Id") {
        audiolibroActualizado.append(key, String(value));
      }
    });
    const archivo = formData.get("pathArchivo");
    if (archivo && archivo.size > 0) {
      audiolibroActualizado.append("pathArchivo", archivo);
    }
    const resultado = await actualizarAudiolibro(id, audiolibroActualizado);
    console.log("Respuesta del backend:", resultado);
    if (resultado.error) {
      return json(
        {
          error: resultado.error,
          debugInfo: debugFormData
        },
        { status: 400 }
      );
    }
    return redirect("/panel");
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Error al procesar el formulario"
      },
      { status: 500 }
    );
  }
};
function EditarAudiolibro() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const { audiolibro } = useLoaderData();
  console.log(audiolibro);
  const actionData = useActionData();
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [bookCoverBase64, setBookCoverBase64] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleArchivoChange = (event) => {
    var _a2;
    const file = ((_a2 = event.target.files) == null ? void 0 : _a2[0]) || null;
    setArchivo(file);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const autoresData = await getAllAutores();
        const generosData = await getAllGeneros();
        setAutores(autoresData);
        setGeneros(generosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
    if (audiolibro == null ? void 0 : audiolibro.portada) {
      setBookCoverBase64(audiolibro.portada);
    }
  }, [audiolibro]);
  const handleBase64Generated = (base64) => {
    setBookCoverBase64(base64);
  };
  const handleSubmit = (event) => {
    setIsSubmitting(true);
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "container rounded-lg max-w-6xl mx-auto mt-7 mb-7", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between ml-40 items-center", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Editar audiolibro" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Modifique los detalles del audiolibro" })
    ] }) }),
    (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error:" }),
      /* @__PURE__ */ jsx("p", { children: actionData.error }),
      actionData.debugInfo && /* @__PURE__ */ jsxs("details", { className: "mt-2", children: [
        /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-sm", children: "Ver detalles técnicos" }),
        /* @__PURE__ */ jsx("pre", { className: "mt-2 text-xs overflow-auto max-h-40 p-2 bg-red-50", children: JSON.stringify(actionData.debugInfo, null, 2) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "post",
        className: "p-6",
        encType: "multipart/form-data",
        onSubmit: handleSubmit,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Título" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "titulo",
                    placeholder: "Ingrese el título",
                    className: `w-full px-3 py-2 border ${((_a = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _a.titulo) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_b = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _b.titulo) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.titulo })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Autor" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "autorId",
                    defaultValue: audiolibro.autorId,
                    className: `w-full px-3 py-2 border ${((_c = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _c.autorId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un autor" }),
                      autores.map((autor) => /* @__PURE__ */ jsxs("option", { value: autor.id, children: [
                        autor.nombre,
                        " ",
                        autor.apellidos
                      ] }, autor.id))
                    ]
                  }
                ),
                ((_d = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _d.autorId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.autorId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Género" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "generoId",
                    className: `w-full px-3 py-2 border ${((_e = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _e.generoId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un género" }),
                      generos.map((genero) => /* @__PURE__ */ jsx("option", { value: genero.id, children: genero.nombre }, genero.id))
                    ]
                  }
                ),
                ((_f = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _f.generoId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.generoId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Duracion" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "duracion",
                    placeholder: "Ingrese la duración",
                    className: `w-full px-3 py-2 border ${((_g = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _g.duracion) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_h = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _h.duracion) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.duracion })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-start gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700 pt-2", children: "Tamaño MB" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "tamaño_m_b",
                  placeholder: "Ingrese el tamaño",
                  className: "w-full px-3 py-2 border border-gray-300 rounded resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Idioma" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "idioma",
                  placeholder: "Ingrese el idioma",
                  className: "w-full px-3 py-2 border border-gray-300 rounded"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Narrador" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "narrador",
                    placeholder: "Ingrese el narrador",
                    className: `w-full px-3 py-2 border ${((_i = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _i.narrador) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_j = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _j.isnarradorbn) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.narrador })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "pdf",
                  className: "text-right font-medium text-gray-700",
                  children: "Audio o video"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  id: "pathArchivo",
                  name: "pathArchivo",
                  accept: ".mp3, .mp4",
                  required: true,
                  onChange: handleArchivoChange
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-10", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Portada del audiolibro" }),
              /* @__PURE__ */ jsx(
                ImageToBase64,
                {
                  onBase64Generated: handleBase64Generated,
                  stripPrefix: true
                }
              ),
              bookCoverBase64 && /* @__PURE__ */ jsx("div", { className: "mt-4 max-w-lg mx-auto", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: bookCoverBase64.startsWith("data:") ? bookCoverBase64 : `data:image/jpeg;base64,${bookCoverBase64}`,
                  alt: "Portada",
                  className: "rounded-3xl border"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "hidden",
                  name: "portada",
                  value: bookCoverBase64 || ""
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end mt-8 gap-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-[#002847] text-white px-6 py-2 rounded",
                disabled: isSubmitting,
                children: isSubmitting ? "Guardando..." : "Guardar"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/panel",
                className: "bg-gray-200 text-gray-800 px-6 py-2 rounded text-center",
                children: "Cancelar"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: EditarAudiolibro,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
const action$6 = async ({ request }) => {
  try {
    const formData = await request.formData();
    const debugFormData = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        debugFormData[key] = `File: ${value.name} (${value.size} bytes)`;
      } else if (typeof value === "string" && value.startsWith("data:image")) {
        debugFormData[key] = `${value.substring(0, 50)}... (Base64 image)`;
      } else {
        debugFormData[key] = value;
      }
    });
    console.log("Datos del formulario:", debugFormData);
    const audiolibroData = {
      Titulo: formData.get("titulo"),
      AutorId: Number.parseInt(formData.get("autorId")) || 0,
      GeneroId: Number.parseInt(formData.get("generoId")) || 0,
      Duracion: formData.get("duracion"),
      Portada: formData.get("portada") || "",
      TamañoMB: formData.get("tamaño_m_b") || "",
      Narrador: formData.get("narrador"),
      Idioma: formData.get("idioma") || ""
    };
    const errores = {};
    if (!audiolibroData.Titulo) errores["titulo"] = "El título es requerido";
    if (!audiolibroData.AutorId)
      errores["autorId"] = "Debe seleccionar un autor";
    if (!audiolibroData.GeneroId)
      errores["generoId"] = "Debe seleccionar un género";
    if (!audiolibroData.Duracion)
      errores["duracion"] = "La duracion es requerida";
    if (!audiolibroData.TamañoMB)
      errores["tamanomb"] = "El Tamaño es requerido";
    if (!audiolibroData.Narrador)
      errores["narrador"] = "El narrador es requerido";
    if (!audiolibroData.Idioma) errores["idioma"] = "El idioma es requerido";
    if (Object.keys(errores).length > 0) {
      return json({ errores }, { status: 400 });
    }
    const nuevoAudiolibro = new FormData();
    Object.entries(audiolibroData).forEach(([key, value]) => {
      if (value !== null && value !== void 0) {
        nuevoAudiolibro.append(key, String(value));
      }
    });
    const archivo = formData.get("pathArchivo");
    if (archivo && archivo.size > 0) {
      nuevoAudiolibro.append("pathArchivo", archivo);
    }
    const resultado = await crearAudiolibro(nuevoAudiolibro);
    console.log("Respuesta del backend:", resultado);
    if (resultado.error) {
      return json(
        {
          error: resultado.error,
          debugInfo: debugFormData
        },
        { status: 400 }
      );
    }
    return redirect("/panel");
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Error al procesar el formulario"
      },
      { status: 500 }
    );
  }
};
function AgregarAudiolibro() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const navigate = useNavigate();
  const actionData = useActionData();
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [bookCoverBase64, setBookCoverBase64] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleArchivoChange = (event) => {
    var _a2;
    const file = ((_a2 = event.target.files) == null ? void 0 : _a2[0]) || null;
    setArchivo(file);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const autoresData = await getAllAutores();
        const generosData = await getAllGeneros();
        setAutores(autoresData);
        setGeneros(generosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);
  const handleBase64Generated = (base64) => {
    setBookCoverBase64(base64);
  };
  const handleSubmit = (event) => {
    setIsSubmitting(true);
    navigate("/panel");
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "container rounded-lg max-w-6xl mx-auto mt-7 mb-7", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between ml-40 items-center", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Agregar nuevo audiolibro" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Complete los detalles del audiolibro y suba los archivos necesarios" })
    ] }) }),
    (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error:" }),
      /* @__PURE__ */ jsx("p", { children: actionData.error }),
      actionData.debugInfo && /* @__PURE__ */ jsxs("details", { className: "mt-2", children: [
        /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-sm", children: "Ver detalles técnicos" }),
        /* @__PURE__ */ jsx("pre", { className: "mt-2 text-xs overflow-auto max-h-40 p-2 bg-red-50", children: JSON.stringify(actionData.debugInfo, null, 2) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "post",
        className: "p-6",
        encType: "multipart/form-data",
        onSubmit: handleSubmit,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Título" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "titulo",
                    placeholder: "Ingrese el título",
                    className: `w-full px-3 py-2 border ${((_a = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _a.titulo) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_b = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _b.titulo) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.titulo })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Autor" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "autorId",
                    className: `w-full px-3 py-2 border ${((_c = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _c.autorId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un autor" }),
                      autores.map((autor) => /* @__PURE__ */ jsxs("option", { value: autor.id, children: [
                        autor.nombre,
                        " ",
                        autor.apellidos
                      ] }, autor.id))
                    ]
                  }
                ),
                ((_d = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _d.autorId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.autorId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Género" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "generoId",
                    className: `w-full px-3 py-2 border ${((_e = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _e.generoId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un género" }),
                      generos.map((genero) => /* @__PURE__ */ jsx("option", { value: genero.id, children: genero.nombre }, genero.id))
                    ]
                  }
                ),
                ((_f = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _f.generoId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.generoId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Duracion" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "duracion",
                    placeholder: "Ingrese la duración",
                    className: `w-full px-3 py-2 border ${((_g = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _g.duracion) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_h = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _h.duracion) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.duracion })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-start gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700 pt-2", children: "Tamaño MB" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "tamaño_m_b",
                  placeholder: "Ingrese el tamaño",
                  className: "w-full px-3 py-2 border border-gray-300 rounded resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Idioma" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "idioma",
                  placeholder: "Ingrese el idioma",
                  className: "w-full px-3 py-2 border border-gray-300 rounded"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Narrador" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "narrador",
                    placeholder: "Ingrese el narrador",
                    className: `w-full px-3 py-2 border ${((_i = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _i.narrador) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_j = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _j.isnarradorbn) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.narrador })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "pdf",
                  className: "text-right font-medium text-gray-700",
                  children: "Audio o video"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  id: "pathArchivo",
                  name: "pathArchivo",
                  accept: ".mp3, .mp4",
                  required: true,
                  onChange: handleArchivoChange
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-10", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Portada del audiolibro" }),
              /* @__PURE__ */ jsx(
                ImageToBase64,
                {
                  onBase64Generated: handleBase64Generated,
                  stripPrefix: true
                }
              ),
              bookCoverBase64 && /* @__PURE__ */ jsx("div", { className: "mt-4 max-w-lg mx-auto", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: bookCoverBase64.startsWith("data:") ? bookCoverBase64 : `data:image/jpeg;base64,${bookCoverBase64}`,
                  alt: "Portada",
                  className: "rounded-3xl border"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "hidden",
                  name: "portada",
                  value: bookCoverBase64 || ""
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end mt-8 gap-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-[#002847] text-white px-6 py-2 rounded",
                disabled: isSubmitting,
                children: isSubmitting ? "Guardando..." : "Guardar"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/panel",
                className: "bg-gray-200 text-gray-800 px-6 py-2 rounded text-center",
                children: "Cancelar"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  default: AgregarAudiolibro
}, Symbol.toStringTag, { value: "Module" }));
const API_URL = "http://localhost:5046/api/libro";
async function getAllLibros() {
  try {
    const response = await fetch(`${API_URL}/libros`);
    if (!response.ok) {
      throw new Error("Error al obtener los libros");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getAllLibros:", error);
  }
}
async function getLibroById(Id) {
  const response = await fetch(`${API_URL}/${Id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener el libro con ID ${Id}`);
  }
  const data = await response.json();
  console.log("Libro recibido:", data);
  return data;
}
const crearLibro = async (formData) => {
  try {
    const formDataObj = {};
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
    const url = API_URL.endsWith("/create") ? API_URL : `${API_URL}/create`;
    console.log("URL final:", url);
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);
    }
    try {
      return await response.json();
    } catch (jsonError) {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error en crearLibro:", error);
    return {
      error: error instanceof Error ? error.message : "No se pudo crear el libro"
    };
  }
};
const actualizarLibro = async (id, formData) => {
  try {
    console.log("Datos enviados al backend para actualizar:", {
      url: `${API_URL}/update/${id}`,
      method: "PUT",
      formData: Object.fromEntries(formData.entries())
    });
    const url = `${API_URL}/update/${id}`;
    console.log("URL final para actualizar:", url);
    const response = await fetch(url, {
      method: "PUT",
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error del servidor (${response.status}):`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return {
          error: errorJson.message || errorJson.error || `Error ${response.status}: ${response.statusText}`
        };
      } catch (e) {
        return {
          error: `Error ${response.status}: ${errorText || response.statusText}`
        };
      }
    }
    try {
      return await response.json();
    } catch (jsonError) {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error en actualizarLibro:", error);
    return {
      error: error instanceof Error ? error.message : "No se pudo actualizar el libro"
    };
  }
};
async function descargarLibro(id) {
  const url = `${API_URL}/descargar/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Error al descargar el libro: ${response.status}`);
  }
  const blob = await response.blob();
  return blob;
}
const eliminarLibro = async (id) => {
  try {
    const url = `${API_URL}/delete/${id}`;
    console.log("URL para eliminar:", url);
    const response = await fetch(url, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el libro: ${response.status}`);
    }
    return { success: true };
  } catch (error) {
    console.error(`Error en eliminarLibro(${id}):`, error);
    throw error;
  }
};
const loader$b = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  if (!id) {
    return redirect("/panel");
  }
  try {
    const autor = await getLibroById(id.toString());
    if (!autor) {
      throw new Error("Autor no encontrado");
    }
    return json({ autor });
  } catch (error) {
    console.error("Error al cargar el autor:", error);
    return json(
      {
        autor: { id: 0, nombre: "", apellido: "" },
        error: "No se pudo cargar el autor"
      },
      { status: 404 }
    );
  }
};
const action$5 = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  try {
    await eliminarAutor(id);
    return redirect("/panel");
  } catch (error) {
    console.error("Error al eliminar el autor:", error);
    return redirect("/panel");
  }
};
function EliminarAutor() {
  return /* @__PURE__ */ jsx("div", { className: "inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Eliminar autor" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Confirme la eliminación del autor" })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/panel", className: "text-gray-500 hover:text-gray-700", children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: "¿Está seguro que desea eliminar este autor? Esta acción no se puede deshacer." }) }) }) }),
      /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4 mt-6", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/panel",
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
            children: "Eliminar"
          }
        )
      ] }) })
    ] })
  ] }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: EliminarAutor,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
const loader$a = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  if (!id) {
    return redirect("/panel");
  }
  try {
    const libro = await getLibroById(id.toString());
    if (!libro) {
      throw new Error("Libro no encontrado");
    }
    return json({ libro });
  } catch (error) {
    console.error("Error al cargar el libro:", error);
    return json(
      {
        libro: { id: 0, titulo: "" },
        error: "No se pudo cargar el libro"
      },
      { status: 404 }
    );
  }
};
const action$4 = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  try {
    await eliminarLibro(id);
    return redirect("/panel");
  } catch (error) {
    console.error("Error al eliminar el libro:", error);
    return redirect("/panel");
  }
};
function EliminarLibro() {
  return /* @__PURE__ */ jsx("div", { className: "inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Eliminar libro" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Confirme la eliminación del libro" })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/panel", className: "text-gray-500 hover:text-gray-700", children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: "¿Está seguro que desea eliminar este libro? Esta acción no se puede deshacer." }) }) }) }),
      /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4 mt-6", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/panel",
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
            children: "Eliminar"
          }
        )
      ] }) })
    ] })
  ] }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: EliminarLibro,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
const CardAudiolibro = ({
  id,
  titulo,
  portada,
  autor,
  genero
}) => {
  const location = useLocation();
  location.pathname;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-around rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl group", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b-2", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: portada || "/img/image-audio.jpg",
        alt: `Portada de ${titulo}`,
        className: "w-64 h-32 transition-transform duration-500 group-hover:scale-105"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-md text-gray-900 line-clamp-2", children: titulo }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: autor })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm", children: genero }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 pb-5", children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/audiolibros/${id.toString()}`,
        className: "flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#fa4616] rounded-md hover:bg-[#fa5316] transition-colors",
        children: [
          /* @__PURE__ */ jsx("span", { children: "Ver detalles" }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ]
      }
    ) })
  ] });
};
async function loader$9({ params }) {
  const { Id } = params;
  if (!Id) {
    throw new Response("ID de Audiolibro no proporcionado", { status: 400 });
  }
  const response = await getAudiolibroById(Id);
  if (!response) {
    throw new Response("Audiolibro no encontrado", { status: 404 });
  }
  return json({ response });
}
const audiolibroDetalle = () => {
  const { response } = useLoaderData();
  if (!response.responseElements || response.responseElements.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-10", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center", children: "No se encontró información del audiolibro" }) });
  }
  const audiolibro = response.responseElements[0];
  const descargarArchivo = async (idLibro) => {
    try {
      const blob = await descargarAudiolibro(idLibro);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${audiolibro.pathArchivo}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "flex items-center text-gray-600 hover:text-[#fa4616]",
          children: /* @__PURE__ */ jsx("span", { children: "Inicio" })
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/audiolibros",
          className: "text-gray-600 hover:text-[#fa4616]",
          children: "Audiolibro"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: audiolibro.titulo })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "container mx-auto min-h-full", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full h-fit max-w-3xl mx-auto mb-8 mt-16", children: audiolibro.pathArchivo.endsWith(".mp3") ? /* @__PURE__ */ jsx(
        "audio",
        {
          className: "w-full h-20",
          controls: true,
          src: `http://localhost:5046/archivos/${audiolibro.pathArchivo}`,
          children: "Audio"
        }
      ) : /* @__PURE__ */ jsx(
        "video",
        {
          className: "w-full h-full",
          controls: true,
          src: `http://localhost:5046/archivos/${audiolibro.pathArchivo}`,
          children: "Video"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: audiolibro.generos && audiolibro.generos.split(",").map((genero, index) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm",
            children: genero.trim()
          },
          index
        )) }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-[#fa4616] mb-2", children: audiolibro.titulo }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2 text-black", children: audiolibro.autor }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
          "Duración: ",
          audiolibro.duracion
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-16 mb-12 mt-12", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => descargarArchivo(audiolibro.id),
            className: "bg-[#fa4616] text-white px-6 py-3 rounded-md flex items-center hover:bg-[#f94517] transition-colors",
            children: [
              "Descargar ",
              /* @__PURE__ */ jsx(Download, { className: "ml-2 h-5 w-5" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "flex justify-center text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: audiolibro.totalDescargas }),
            /* @__PURE__ */ jsx(Download, { className: "h-5 w-5 text-gray-500" })
          ] }),
          audiolibro.totalDescargas == 1 ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "Vez descargado" }) : /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "Veces descargado" })
        ] }) }) })
      ] }),
      audiolibro.audiolibrosRelacionados && audiolibro.audiolibrosRelacionados.length > 0 ? /* @__PURE__ */ jsxs("section", { className: "mt-16 max-w-6xl mx-auto mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-8 text-[#002847]", children: "Audiolibros relacionados" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10", children: audiolibro.audiolibrosRelacionados.map(
          (audiolibroRelacionado) => /* @__PURE__ */ jsx(
            CardAudiolibro,
            {
              id: audiolibroRelacionado.id,
              titulo: audiolibroRelacionado.titulo,
              portada: `http://localhost:5046/portadasAudio/${audiolibroRelacionado.portada}`,
              autor: audiolibroRelacionado.autor,
              genero: audiolibroRelacionado.genero
            },
            audiolibroRelacionado.id
          )
        ) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-10", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center", children: "No hay Audiolibros relacionados" }) })
    ] })
  ] });
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: audiolibroDetalle,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const loader$8 = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  if (!id) {
    return redirect("/panel");
  }
  try {
    const autor = await getAutorById(id.toString());
    if (!autor) {
      throw new Error("Autor no encontrado");
    }
    return json({ autor });
  } catch (error) {
    console.error("Error al cargar el autor:", error);
    return json({ error: "No se pudo cargar el autor" }, { status: 404 });
  }
};
const action$3 = async ({ request, params }) => {
  try {
    const id = Number.parseInt(params.id || "0");
    if (!id) {
      return json(
        { error: "ID de autor no válido" },
        { status: 400 }
      );
    }
    const formData = await request.formData();
    const debugFormData = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        debugFormData[key] = `File: ${value.name} (${value.size} bytes)`;
      } else if (typeof value === "string" && value.startsWith("data:image")) {
        debugFormData[key] = `${value.substring(0, 50)}... (Base64 image)`;
      } else {
        debugFormData[key] = value;
      }
    });
    console.log("Datos del formulario:", debugFormData);
    const autorData = {
      Nombre: formData.get("nombre"),
      Apellido: formData.get("apellido"),
      GeneroId: Number.parseInt(formData.get("generoId")) || 0,
      Foto: formData.get("foto") || "",
      Nacionalidad: formData.get("nacionalidad") || "",
      Biografia: formData.get("biografia"),
      Idioma: formData.get("idioma") || ""
    };
    const errores = {};
    if (!autorData.Nombre) errores["nombre"] = "El nombre es requerido";
    if (!autorData.Apellido) errores["apellido"] = "El apellido es requerido";
    if (!autorData.GeneroId) errores["generoId"] = "Debe seleccionar un género";
    if (!autorData.Nacionalidad)
      errores["nacionalidad"] = "La nacionalidad es requerida";
    if (!autorData.Biografia)
      errores["biografia"] = "La biografía es requerida";
    if (!autorData.Idioma) errores["idioma"] = "El idioma es requerido";
    if (Object.keys(errores).length > 0) {
      return json({ errores }, { status: 400 });
    }
    const autorActualizado = new FormData();
    autorActualizado.append("Id", id.toString());
    Object.entries(autorData).forEach(([key, value]) => {
      if (value !== null && value !== void 0 && key !== "Id") {
        autorActualizado.append(key, String(value));
      }
    });
    const resultado = await actualizarAutor(id, autorActualizado);
    console.log("Respuesta del backend:", resultado);
    if (resultado.error) {
      return json(
        {
          error: resultado.error,
          debugInfo: debugFormData
        },
        { status: 400 }
      );
    }
    return redirect("/panel");
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Error al procesar el formulario"
      },
      { status: 500 }
    );
  }
};
function EditarAutor() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const { autor } = useLoaderData();
  const actionData = useActionData();
  const [generos, setGeneros] = useState([]);
  const [bookCoverBase64, setBookCoverBase64] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const generosData = await getAllGeneros();
        setGeneros(generosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
    if (autor == null ? void 0 : autor.foto) {
      setBookCoverBase64(autor.foto);
    }
  }, [autor]);
  const handleBase64Generated = (base64) => {
    setBookCoverBase64(base64);
  };
  const handleSubmit = (event) => {
    setIsSubmitting(true);
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "container rounded-lg max-w-6xl mx-auto mt-7 mb-7", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center ml-40", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Editar autor" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Modifique los detalles del autor" })
    ] }) }),
    (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error:" }),
      /* @__PURE__ */ jsx("p", { children: actionData.error }),
      actionData.debugInfo && /* @__PURE__ */ jsxs("details", { className: "mt-2", children: [
        /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-sm", children: "Ver detalles técnicos" }),
        /* @__PURE__ */ jsx("pre", { className: "mt-2 text-xs overflow-auto max-h-40 p-2 bg-red-50", children: JSON.stringify(actionData.debugInfo, null, 2) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "post",
        className: "p-6",
        encType: "multipart/form-data",
        onSubmit: handleSubmit,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Nombre" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "nombre",
                    defaultValue: autor == null ? void 0 : autor.nombre,
                    placeholder: "Ingrese el nombre",
                    className: `w-full px-3 py-2 border ${((_a = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _a.nombre) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_b = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _b.nombre) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.nombre })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Apellido" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "apellido",
                    defaultValue: (autor == null ? void 0 : autor.apellido) || "",
                    placeholder: "Ingrese el apellido",
                    className: `w-full px-3 py-2 border ${((_c = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _c.apellido) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_d = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _d.apellido) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.apellido })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Género" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "generoId",
                    defaultValue: (autor == null ? void 0 : autor.generoId) || "",
                    className: `w-full px-3 py-2 border ${((_e = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _e.generoId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un género" }),
                      generos.map((genero) => /* @__PURE__ */ jsx("option", { value: genero.id, children: genero.nombre }, genero.id))
                    ]
                  }
                ),
                ((_f = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _f.generoId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.generoId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Nacionalidad" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "nacionalidad",
                    placeholder: "Ingrese la nacionalidad",
                    className: `w-full px-3 py-2 border ${((_g = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _g.nacionalidad) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_h = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _h.nacionalidad) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.nacionalidad })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-start gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700 pt-2", children: "Biografía" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  name: "biografia",
                  placeholder: "Ingrese la biografía",
                  rows: 4,
                  className: "w-full px-3 py-2 border border-gray-300 rounded resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Idioma" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "idioma",
                  defaultValue: (autor == null ? void 0 : autor.idioma) || "",
                  placeholder: "Ingrese el idioma",
                  className: "w-full px-3 py-2 border border-gray-300 rounded"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-10", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Foto del autor" }),
              /* @__PURE__ */ jsx(
                ImageToBase64,
                {
                  onBase64Generated: handleBase64Generated,
                  stripPrefix: true
                }
              ),
              (bookCoverBase64 || (autor == null ? void 0 : autor.foto)) && /* @__PURE__ */ jsx("div", { className: "mt-4 max-w-lg mx-auto", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: bookCoverBase64 ? bookCoverBase64.startsWith("data:") ? bookCoverBase64 : `data:image/jpeg;base64,${bookCoverBase64}` : ((_i = autor == null ? void 0 : autor.foto) == null ? void 0 : _i.startsWith("data:")) ? autor.foto : `data:image/jpeg;base64,${autor == null ? void 0 : autor.foto}`,
                  alt: "Portada",
                  className: "rounded-3xl border"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "hidden",
                  name: "foto",
                  value: bookCoverBase64 || (autor == null ? void 0 : autor.foto) || ""
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end mt-8 gap-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-[#002847] text-white px-6 py-2 rounded",
                disabled: isSubmitting,
                children: isSubmitting ? "Guardando..." : "Guardar cambios"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/panel",
                className: "bg-gray-200 text-gray-800 px-6 py-2 rounded text-center",
                children: "Cancelar"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: EditarAutor,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const loader$7 = async ({ params }) => {
  const id = Number.parseInt(params.id || "0");
  if (!id) {
    return redirect("/panel");
  }
  try {
    const libro = await getLibroById(id.toString());
    if (!libro) {
      throw new Error("Libro no encontrado");
    }
    return json({ libro });
  } catch (error) {
    console.error("Error al cargar el libro:", error);
    return json({ error: "No se pudo cargar el libro" }, { status: 404 });
  }
};
const action$2 = async ({ request, params }) => {
  try {
    const id = Number.parseInt(params.id || "0");
    if (!id) {
      return json(
        { error: "ID de libro no válido" },
        { status: 400 }
      );
    }
    const formData = await request.formData();
    const debugFormData = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        debugFormData[key] = `File: ${value.name} (${value.size} bytes)`;
      } else if (typeof value === "string" && value.startsWith("data:image")) {
        debugFormData[key] = `${value.substring(0, 50)}... (Base64 image)`;
      } else {
        debugFormData[key] = value;
      }
    });
    console.log("Datos del formulario:", debugFormData);
    const libroData = {
      Id: id,
      Titulo: formData.get("titulo"),
      AutorId: Number.parseInt(formData.get("autorId")) || 0,
      GeneroId: Number.parseInt(formData.get("generoId")) || 0,
      Editorial: formData.get("editorial"),
      Contraportada: formData.get("contraportada") || "",
      ISBN13: formData.get("isbn"),
      Idioma: formData.get("idioma") || "",
      Portada: formData.get("portada") || ""
      // Base64 ya sin prefijo
    };
    const errores = {};
    if (!libroData.Titulo) errores["titulo"] = "El título es requerido";
    if (!libroData.AutorId) errores["autorId"] = "Debe seleccionar un autor";
    if (!libroData.GeneroId) errores["generoId"] = "Debe seleccionar un género";
    if (!libroData.Editorial)
      errores["editorial"] = "La editorial es requerida";
    if (!libroData.ISBN13) errores["isbn"] = "El ISBN es requerido";
    if (Object.keys(errores).length > 0) {
      return json({ errores }, { status: 400 });
    }
    const libroActualizado = new FormData();
    libroActualizado.append("Id", id.toString());
    Object.entries(libroData).forEach(([key, value]) => {
      if (value !== null && value !== void 0 && key !== "Id") {
        libroActualizado.append(key, String(value));
      }
    });
    const pdfFile = formData.get("pdf");
    if (pdfFile && pdfFile.size > 0) {
      libroActualizado.append("Pdf", pdfFile);
    }
    const resultado = await actualizarLibro(id, libroActualizado);
    console.log("Respuesta del backend:", resultado);
    if (resultado.error) {
      return json(
        {
          error: resultado.error,
          debugInfo: debugFormData
        },
        { status: 400 }
      );
    }
    return redirect("/panel");
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Error al procesar el formulario"
      },
      { status: 500 }
    );
  }
};
function EditarLibro() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const { libro } = useLoaderData();
  const actionData = useActionData();
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [bookCoverBase64, setBookCoverBase64] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePdfChange = (event) => {
    var _a2;
    const file = ((_a2 = event.target.files) == null ? void 0 : _a2[0]) || null;
    setPdfFile(file);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const autoresData = await getAllAutores();
        const generosData = await getAllGeneros();
        setAutores(autoresData);
        setGeneros(generosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
    if (libro == null ? void 0 : libro.portada) {
      setBookCoverBase64(libro.portada);
    }
  }, [libro]);
  const handleBase64Generated = (base64) => {
    setBookCoverBase64(base64);
  };
  const handleSubmit = (event) => {
    setIsSubmitting(true);
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "container rounded-lg max-w-6xl mx-auto mt-7 mb-7", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center ml-40", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Editar libro" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Modifique los detalles del libro" })
    ] }) }),
    (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error:" }),
      /* @__PURE__ */ jsx("p", { children: actionData.error }),
      actionData.debugInfo && /* @__PURE__ */ jsxs("details", { className: "mt-2", children: [
        /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-sm", children: "Ver detalles técnicos" }),
        /* @__PURE__ */ jsx("pre", { className: "mt-2 text-xs overflow-auto max-h-40 p-2 bg-red-50", children: JSON.stringify(actionData.debugInfo, null, 2) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "post",
        className: "p-6",
        encType: "multipart/form-data",
        onSubmit: handleSubmit,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Título" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "titulo",
                    placeholder: "Ingrese el título",
                    className: `w-full px-3 py-2 border ${((_a = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _a.titulo) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_b = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _b.titulo) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.titulo })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Autor" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "autorId",
                    defaultValue: (libro == null ? void 0 : libro.autorId) || "",
                    className: `w-full px-3 py-2 border ${((_c = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _c.autorId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un autor" }),
                      autores.map((autor) => /* @__PURE__ */ jsxs("option", { value: autor.id, children: [
                        autor.nombre,
                        " ",
                        autor.apellidos
                      ] }, autor.id))
                    ]
                  }
                ),
                ((_d = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _d.autorId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.autorId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Género" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "generoId",
                    defaultValue: (libro == null ? void 0 : libro.generoId) || "",
                    className: `w-full px-3 py-2 border ${((_e = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _e.generoId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un género" }),
                      generos.map((genero) => /* @__PURE__ */ jsx("option", { value: genero.id, children: genero.nombre }, genero.id))
                    ]
                  }
                ),
                ((_f = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _f.generoId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.generoId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Editorial" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "editorial",
                    defaultValue: (libro == null ? void 0 : libro.editorial) || "",
                    placeholder: "Ingrese la editorial",
                    className: `w-full px-3 py-2 border ${((_g = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _g.editorial) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_h = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _h.editorial) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.editorial })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-start gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700 pt-2", children: "Contraportada" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  name: "contraportada",
                  defaultValue: (libro == null ? void 0 : libro.contraportada) || "",
                  placeholder: "Ingrese la descripción de la contraportada",
                  rows: 4,
                  className: "w-full px-3 py-2 border border-gray-300 rounded resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Idioma" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "idioma",
                  defaultValue: (libro == null ? void 0 : libro.idioma) || "",
                  placeholder: "Ingrese el idioma",
                  className: "w-full px-3 py-2 border border-gray-300 rounded"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "ISBN" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "isbn",
                    defaultValue: (libro == null ? void 0 : libro.isbn13) || "",
                    placeholder: "Ingrese el ISBN",
                    className: `w-full px-3 py-2 border ${((_i = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _i.isbn) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_j = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _j.isbn) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.isbn })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "pdf",
                  className: "text-right font-medium text-gray-700",
                  children: "PDF"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    id: "pdf",
                    name: "pdf",
                    accept: ".pdf",
                    onChange: handlePdfChange
                  }
                ),
                (libro == null ? void 0 : libro.pdf) && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Ya existe un PDF. Si no selecciona uno nuevo, se mantendrá el actual." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-10", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Portada del libro" }),
              /* @__PURE__ */ jsx(
                ImageToBase64,
                {
                  onBase64Generated: handleBase64Generated,
                  stripPrefix: true
                }
              ),
              (bookCoverBase64 || (libro == null ? void 0 : libro.portada)) && /* @__PURE__ */ jsx("div", { className: "mt-4 max-w-lg mx-auto", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: bookCoverBase64 ? bookCoverBase64.startsWith("data:") ? bookCoverBase64 : `data:image/jpeg;base64,${bookCoverBase64}` : ((_k = libro == null ? void 0 : libro.portada) == null ? void 0 : _k.startsWith("data:")) ? libro.portada : `data:image/jpeg;base64,${libro == null ? void 0 : libro.portada}`,
                  alt: "Portada",
                  className: "rounded-3xl border"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "hidden",
                  name: "portada",
                  value: bookCoverBase64 || (libro == null ? void 0 : libro.portada) || ""
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end mt-8 gap-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-[#002847] text-white px-6 py-2 rounded",
                disabled: isSubmitting,
                children: isSubmitting ? "Guardando..." : "Guardar cambios"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/panel",
                className: "bg-gray-200 text-gray-800 px-6 py-2 rounded text-center",
                children: "Cancelar"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: EditarLibro,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ request }) => {
  try {
    const formData = await request.formData();
    const debugFormData = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        debugFormData[key] = `File: ${value.name} (${value.size} bytes)`;
      } else if (typeof value === "string" && value.startsWith("data:image")) {
        debugFormData[key] = `${value.substring(0, 50)}... (Base64 image)`;
      } else {
        debugFormData[key] = value;
      }
    });
    console.log("Datos del formulario:", debugFormData);
    const autorData = {
      Nombre: formData.get("nombre"),
      Apellido: formData.get("apellido"),
      GeneroId: Number.parseInt(formData.get("generoId")) || 0,
      Foto: formData.get("foto") || "",
      Nacionalidad: formData.get("nacionalidad") || "",
      Biografia: formData.get("biografia"),
      Idioma: formData.get("idioma") || ""
    };
    const errores = {};
    if (!autorData.Nombre) errores["nombre"] = "El nombre es requerido";
    if (!autorData.Apellido) errores["apellido"] = "El apellido es requerido";
    if (!autorData.GeneroId) errores["generoId"] = "Debe seleccionar un género";
    if (!autorData.Nacionalidad)
      errores["nacionalidad"] = "La nacionalidad es requerida";
    if (!autorData.Biografia)
      errores["biografia"] = "La biografía es requerida";
    if (!autorData.Idioma) errores["idioma"] = "El idioma es requerido";
    if (Object.keys(errores).length > 0) {
      return json({ errores }, { status: 400 });
    }
    const nuevoAutor = new FormData();
    Object.entries(autorData).forEach(([key, value]) => {
      if (value !== null && value !== void 0) {
        nuevoAutor.append(key, String(value));
      }
    });
    const resultado = await crearAutor(nuevoAutor);
    console.log("Respuesta del backend:", resultado);
    if (resultado.error) {
      return json(
        {
          error: resultado.error,
          debugInfo: debugFormData
        },
        { status: 400 }
      );
    }
    return redirect("/panel");
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Error al procesar el formulario"
      },
      { status: 500 }
    );
  }
};
function AgregarAutor() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const navigate = useNavigate();
  const actionData = useActionData();
  const [generos, setGeneros] = useState([]);
  const [bookCoverBase64, setBookCoverBase64] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const generosData = await getAllGeneros();
        setGeneros(generosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);
  const handleBase64Generated = (base64) => {
    setBookCoverBase64(base64);
  };
  const handleSubmit = (event) => {
    setIsSubmitting(true);
    navigate("/panel");
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "container rounded-lg max-w-6xl mx-auto mt-7 mb-7", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between ml-40 items-center", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Agregar nuevo autor" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Complete los detalles del autor y suba los archivos necesarios" })
    ] }) }),
    (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error:" }),
      /* @__PURE__ */ jsx("p", { children: actionData.error }),
      actionData.debugInfo && /* @__PURE__ */ jsxs("details", { className: "mt-2", children: [
        /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-sm", children: "Ver detalles técnicos" }),
        /* @__PURE__ */ jsx("pre", { className: "mt-2 text-xs overflow-auto max-h-40 p-2 bg-red-50", children: JSON.stringify(actionData.debugInfo, null, 2) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "post",
        className: "p-6",
        encType: "multipart/form-data",
        onSubmit: handleSubmit,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Nombre" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "nombre",
                    placeholder: "Ingrese el nombre",
                    className: `w-full px-3 py-2 border ${((_a = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _a.nombre) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_b = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _b.nombre) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.nombre })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Apellido" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "apellido",
                    placeholder: "Ingrese el apellido",
                    className: `w-full px-3 py-2 border ${((_c = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _c.apellido) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_d = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _d.apellido) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.apellido })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Género" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "generoId",
                    className: `w-full px-3 py-2 border ${((_e = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _e.generoId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un género" }),
                      generos.map((genero) => /* @__PURE__ */ jsx("option", { value: genero.id, children: genero.nombre }, genero.id))
                    ]
                  }
                ),
                ((_f = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _f.generoId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.generoId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Nacionalidad" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "nacionalidad",
                    placeholder: "Ingrese la nacionalidad",
                    className: `w-full px-3 py-2 border ${((_g = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _g.nacionalidad) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_h = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _h.nacionalidad) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.nacionalidad })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-start gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700 pt-2", children: "Biografía" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  name: "biografia",
                  placeholder: "Ingrese la biografía",
                  rows: 4,
                  className: "w-full px-3 py-2 border border-gray-300 rounded resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Idioma" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "idioma",
                  placeholder: "Ingrese el idioma",
                  className: "w-full px-3 py-2 border border-gray-300 rounded"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-10", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Foto del autor" }),
              /* @__PURE__ */ jsx(
                ImageToBase64,
                {
                  onBase64Generated: handleBase64Generated,
                  stripPrefix: true
                }
              ),
              bookCoverBase64 && /* @__PURE__ */ jsx("div", { className: "mt-4 max-w-lg mx-auto", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: bookCoverBase64.startsWith("data:") ? bookCoverBase64 : `data:image/jpeg;base64,${bookCoverBase64}`,
                  alt: "foto",
                  className: "rounded-3xl border"
                }
              ) }),
              /* @__PURE__ */ jsx("input", { type: "hidden", name: "foto", value: bookCoverBase64 || "" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end mt-8 gap-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-[#002847] text-white px-6 py-2 rounded",
                disabled: isSubmitting,
                children: isSubmitting ? "Guardando..." : "Guardar"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/panel",
                className: "bg-gray-200 text-gray-800 px-6 py-2 rounded text-center",
                children: "Cancelar"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: AgregarAutor
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const debugFormData = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        debugFormData[key] = `File: ${value.name} (${value.size} bytes)`;
      } else if (typeof value === "string" && value.startsWith("data:image")) {
        debugFormData[key] = `${value.substring(0, 50)}... (Base64 image)`;
      } else {
        debugFormData[key] = value;
      }
    });
    console.log("Datos del formulario:", debugFormData);
    const libroData = {
      Titulo: formData.get("titulo"),
      AutorId: Number.parseInt(formData.get("autorId")) || 0,
      GeneroId: Number.parseInt(formData.get("generoId")) || 0,
      Editorial: formData.get("editorial"),
      Contraportada: formData.get("contraportada") || "",
      ISBN13: formData.get("isbn"),
      Idioma: formData.get("idioma") || "",
      Portada: formData.get("portada") || ""
    };
    const errores = {};
    if (!libroData.Titulo) errores["titulo"] = "El título es requerido";
    if (!libroData.AutorId) errores["autorId"] = "Debe seleccionar un autor";
    if (!libroData.GeneroId) errores["generoId"] = "Debe seleccionar un género";
    if (!libroData.Editorial)
      errores["editorial"] = "La editorial es requerida";
    if (!libroData.ISBN13) errores["isbn"] = "El ISBN es requerido";
    if (Object.keys(errores).length > 0) {
      return json({ errores }, { status: 400 });
    }
    const nuevoLibro = new FormData();
    Object.entries(libroData).forEach(([key, value]) => {
      if (value !== null && value !== void 0) {
        nuevoLibro.append(key, String(value));
      }
    });
    const pdfFile = formData.get("pdf");
    if (pdfFile && pdfFile.size > 0) {
      nuevoLibro.append("Pdf", pdfFile);
    }
    const resultado = await crearLibro(nuevoLibro);
    console.log("Respuesta del backend:", resultado);
    if (resultado.error) {
      return json(
        {
          error: resultado.error,
          debugInfo: debugFormData
        },
        { status: 400 }
      );
    }
    return redirect("/panel");
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Error al procesar el formulario"
      },
      { status: 500 }
    );
  }
};
function AgregarLibro() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const navigate = useNavigate();
  const actionData = useActionData();
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [bookCoverBase64, setBookCoverBase64] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePdfChange = (event) => {
    var _a2;
    const file = ((_a2 = event.target.files) == null ? void 0 : _a2[0]) || null;
    setPdfFile(file);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const autoresData = await getAllAutores();
        const generosData = await getAllGeneros();
        setAutores(autoresData);
        setGeneros(generosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);
  const handleBase64Generated = (base64) => {
    setBookCoverBase64(base64);
  };
  const handleSubmit = (event) => {
    setIsSubmitting(true);
    navigate("/panel");
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "container rounded-lg max-w-6xl mx-auto mt-7 mb-7", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between ml-40 items-center", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#002847]", children: "Agregar nuevo libro" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Complete los detalles del libro y suba los archivos necesarios" })
    ] }) }),
    (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Error:" }),
      /* @__PURE__ */ jsx("p", { children: actionData.error }),
      actionData.debugInfo && /* @__PURE__ */ jsxs("details", { className: "mt-2", children: [
        /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-sm", children: "Ver detalles técnicos" }),
        /* @__PURE__ */ jsx("pre", { className: "mt-2 text-xs overflow-auto max-h-40 p-2 bg-red-50", children: JSON.stringify(actionData.debugInfo, null, 2) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "post",
        className: "p-6",
        encType: "multipart/form-data",
        onSubmit: handleSubmit,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Título" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "titulo",
                    placeholder: "Ingrese el título",
                    className: `w-full px-3 py-2 border ${((_a = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _a.titulo) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_b = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _b.titulo) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.titulo })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Autor" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "autorId",
                    className: `w-full px-3 py-2 border ${((_c = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _c.autorId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un autor" }),
                      autores.map((autor) => /* @__PURE__ */ jsxs("option", { value: autor.id, children: [
                        autor.nombre,
                        " ",
                        autor.apellidos
                      ] }, autor.id))
                    ]
                  }
                ),
                ((_d = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _d.autorId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.autorId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Género" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "generoId",
                    className: `w-full px-3 py-2 border ${((_e = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _e.generoId) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un género" }),
                      generos.map((genero) => /* @__PURE__ */ jsx("option", { value: genero.id, children: genero.nombre }, genero.id))
                    ]
                  }
                ),
                ((_f = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _f.generoId) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.generoId })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Editorial" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "editorial",
                    placeholder: "Ingrese la editorial",
                    className: `w-full px-3 py-2 border ${((_g = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _g.editorial) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_h = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _h.editorial) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.editorial })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-start gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700 pt-2", children: "Contraportada" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  name: "contraportada",
                  placeholder: "Ingrese la descripción de la contraportada",
                  rows: 4,
                  className: "w-full px-3 py-2 border border-gray-300 rounded resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "Idioma" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "idioma",
                  placeholder: "Ingrese el idioma",
                  className: "w-full px-3 py-2 border border-gray-300 rounded"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-right font-medium text-gray-700", children: "ISBN" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "isbn",
                    placeholder: "Ingrese el ISBN",
                    className: `w-full px-3 py-2 border ${((_i = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _i.isbn) ? "border-red-500" : "border-gray-300"} rounded`,
                    required: true
                  }
                ),
                ((_j = actionData == null ? void 0 : actionData.errores) == null ? void 0 : _j.isbn) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: actionData.errores.isbn })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px,1fr] items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "pdf",
                  className: "text-right font-medium text-gray-700",
                  children: "PDF"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  id: "pdf",
                  name: "pdf",
                  accept: ".pdf",
                  required: true,
                  onChange: handlePdfChange
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-10", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Portada del libro" }),
              /* @__PURE__ */ jsx(
                ImageToBase64,
                {
                  onBase64Generated: handleBase64Generated,
                  stripPrefix: true
                }
              ),
              bookCoverBase64 && /* @__PURE__ */ jsx("div", { className: "mt-4 max-w-lg mx-auto", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: bookCoverBase64.startsWith("data:") ? bookCoverBase64 : `data:image/jpeg;base64,${bookCoverBase64}`,
                  alt: "Portada",
                  className: "rounded-3xl border"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "hidden",
                  name: "portada",
                  value: bookCoverBase64 || ""
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end mt-8 gap-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-[#002847] text-white px-6 py-2 rounded",
                disabled: isSubmitting,
                children: isSubmitting ? "Guardando..." : "Guardar"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/panel",
                className: "bg-gray-200 text-gray-800 px-6 py-2 rounded text-center",
                children: "Cancelar"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: AgregarLibro
}, Symbol.toStringTag, { value: "Module" }));
function loader$6() {
  return getAllAudiolibros();
}
const pagina_Audiolibros = () => {
  const data = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("main", { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full h-64 md:h-80 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#002847]/90 to-[#002847]/80 mix-blend-multiply" }),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          alt: "Biblioteca de libros",
          className: "w-full h-full object-cover"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-white p-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-4xl font-bold tracking-tight mb-2", children: "Audiolibros y videolibros" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl max-w-2xl text-center text-white/80", children: "Descubre historias narradas por las mejores voces y disfruta en cualquier momento." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center text-gray-600 hover:text-[#fa4616]",
          children: [
            /* @__PURE__ */ jsx(Home, { className: "h-4 w-4 mr-1" }),
            /* @__PURE__ */ jsx("span", { children: "Inicio" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/audiolibros",
          className: "text-gray-600 hover:text-[#fa4616]",
          children: "Audiolibros"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto mb-4 mt-6", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm", children: [
      "Mostrando ",
      data.responseElements.length,
      " resultados"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-6xl mx-auto mt-8 mb-16", children: data.responseElements.map((item) => /* @__PURE__ */ jsx(
      CardAudiolibro,
      {
        id: item.id,
        titulo: item.titulo,
        autor: item.autor,
        genero: item.genero,
        portada: `http://localhost:5046/portadasAudio/${item.portada}`
      },
      item.id
    )) })
  ] }) });
};
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pagina_Audiolibros,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const Card = ({ id, portada, titulo, autor, genero }) => {
  const location = useLocation();
  location.pathname;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-around rounded-lg w-64 border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b-2", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: portada,
        alt: `Portada de ${titulo}`,
        className: " w-64 h-80 transition-transform duration-500 group-hover:scale-105"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-md text-gray-900 line-clamp-2", children: titulo }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: autor })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm", children: genero }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 pb-5 ", children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/libros/${id}`,
        className: "flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#fa4616] rounded-md hover:bg-[#fa5316] transition-colors",
        children: [
          /* @__PURE__ */ jsx("span", { children: "Ver detalles" }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ]
      }
    ) })
  ] });
};
async function loader$5({ params }) {
  const { Id } = params;
  if (!Id) {
    throw new Response("ID de libro no proporcionado", { status: 400 });
  }
  const response = await getAutorById(Id);
  if (!response) {
    throw new Response("Libro no encontrado", { status: 404 });
  }
  return json({ response });
}
const AutorDetalle = () => {
  const { response } = useLoaderData();
  if (!response.responseElements || response.responseElements.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-10", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center", children: "No se encontró información del autor" }) });
  }
  const autor = response.responseElements[0];
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center text-gray-600 hover:text-[#fa4616]",
          children: [
            /* @__PURE__ */ jsx(Home, { className: "h-4 w-4 mr-1" }),
            /* @__PURE__ */ jsx("span", { children: "Inicio" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx(Link, { to: "/autores", className: "text-gray-600 hover:text-[#fa4616]", children: "Autores" }),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: autor.nombre })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-6 md:px-12 py-6 flex-grow", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 ", children: [
        /* @__PURE__ */ jsx("div", { className: "md:col-span-1 mx-auto", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: `http://localhost:5046/autores/${autor.foto}`,
            alt: "Portada del libro",
            width: 400,
            height: 650,
            className: "bg-[#fa4616] shadow-lg"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: autor.generos && autor.generos.split(",").map((genero, index) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm",
              children: genero.trim()
            },
            index
          )) }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl mb-2 font-bold text-[#fa4616]", children: `${autor.nombre} ${autor.apellidos}` }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Nacionalidad:" }),
            /* @__PURE__ */ jsx("p", { className: "mb-2", children: autor.nacionalidad })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-700 mb-6", children: [
            " ",
            "Biografía:",
            /* @__PURE__ */ jsx("p", { children: autor.biografia || "No hay biografía disponible" })
          ] })
        ] })
      ] }),
      autor.librosRelacionados && autor.librosRelacionados.length > 0 ? /* @__PURE__ */ jsxs("section", { className: "mt-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-8 text-[#002847]", children: "Otros libros del autor" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10", children: autor.librosRelacionados.map(
          (libroRelacionado) => /* @__PURE__ */ jsx(
            Card,
            {
              id: libroRelacionado.id,
              titulo: libroRelacionado.titulo,
              autor: libroRelacionado.autor,
              portada: `http://localhost:5046/portadas/${libroRelacionado.portada}`,
              genero: libroRelacionado.genero
            },
            libroRelacionado.id
          )
        ) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-10", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center", children: "No hay Libros relacionados" }) })
    ] })
  ] }) });
};
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AutorDetalle,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const DonacionesPage = () => {
  const [montoSeleccionado, setMontoSeleccionado] = useState("20");
  const [otroMonto, setOtroMonto] = useState("");
  const [mostrarOtroMonto, setMostrarOtroMonto] = useState(false);
  const [metodoPago, setMetodoPago] = useState("visa");
  const [guardarSeleccion, setGuardarSeleccion] = useState(false);
  const [moneda, setMoneda] = useState("USD");
  const [frecuencia, setFrecuencia] = useState("mensual");
  const handleMontoClick = (monto) => {
    if (monto === "otro") {
      setMostrarOtroMonto(true);
      setMontoSeleccionado("otro");
    } else {
      setMostrarOtroMonto(false);
      setMontoSeleccionado(monto);
    }
  };
  return /* @__PURE__ */ jsxs("main", { className: "w-full max-w-7xl mx-auto px-4 py-8 bg-white mt-11 mb-11", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/inicio",
        className: "inline-flex items-center text-[#002847] hover:text-[#fa4616] transition-colors",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
          /* @__PURE__ */ jsx("span", { children: "Regresar" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-[#002847] mb-8", children: "Dona ahora!" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-end mb-6", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: moneda,
              onChange: (e) => setMoneda(e.target.value),
              className: "border border-gray-300 rounded-md px-3 py-2 bg-white select-custom",
              children: [
                /* @__PURE__ */ jsx("option", { value: "USD", children: "USD$" }),
                /* @__PURE__ */ jsx("option", { value: "COP", children: "COP$" }),
                /* @__PURE__ */ jsx("option", { value: "EUR", children: "EUR€" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: frecuencia,
              onChange: (e) => setFrecuencia(e.target.value),
              className: "border border-gray-300 rounded-md px-3 py-2 bg-white select-custom",
              children: [
                /* @__PURE__ */ jsx("option", { value: "unica", children: "Donación Única" }),
                /* @__PURE__ */ jsx("option", { value: "mensual", children: "Donación Mensual" }),
                /* @__PURE__ */ jsx("option", { value: "anual", children: "Donación Anual" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: ["10", "20", "30"].map((monto) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleMontoClick(monto),
            className: `py-3 px-4 rounded-md text-lg font-medium transition-colors ${montoSeleccionado === monto ? "bg-[#fa4616] text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`,
            children: [
              "$",
              monto
            ]
          },
          monto
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleMontoClick("60"),
              className: `py-3 px-4 rounded-md text-lg font-medium transition-colors ${montoSeleccionado === "60" ? "bg-[#fa4616] text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`,
              children: "$60"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleMontoClick("otro"),
              className: `py-3 px-4 rounded-md text-lg font-medium transition-colors ${montoSeleccionado === "otro" ? "bg-[#fa4616] text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`,
              children: "$ Otro Monto"
            }
          )
        ] }),
        mostrarOtroMonto && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "otroMonto",
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Ingrese el monto deseado:"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              id: "otroMonto",
              value: otroMonto,
              onChange: (e) => setOtroMonto(e.target.value),
              className: "w-full border border-gray-300 rounded-md px-3 py-2",
              placeholder: "Ingrese monto"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-4", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: "guardarSeleccion",
              checked: guardarSeleccion,
              onChange: () => setGuardarSeleccion(!guardarSeleccion),
              className: "h-4 w-4 text-[#fa4616] rounded border-gray-300 focus:ring-[#fa4616] checkbox-custom"
            }
          ),
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "guardarSeleccion",
              className: "ml-2 block text-sm text-gray-700",
              children: "Guardar Selección"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-[#002847] mb-4", children: "Escoja método de pago" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setMetodoPago("visa"),
                className: `px-6 py-3 rounded-md border transition-colors ${metodoPago === "visa" ? "border-[#fa4616] bg-white text-[#002847]" : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                children: "VISA"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setMetodoPago("paypal"),
                className: `px-6 py-3 rounded-md border transition-colors ${metodoPago === "paypal" ? "border-[#fa4616] bg-white text-[#002847]" : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                children: "PayPal"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-6 rounded-lg", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#002847] mb-4", children: "Resumen de donación" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Monto:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              moneda === "USD" ? "$" : moneda === "EUR" ? "€" : "COP$",
              montoSeleccionado === "otro" ? otroMonto || "0" : montoSeleccionado
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Frecuencia:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: frecuencia === "unica" ? "Única" : frecuencia === "mensual" ? "Mensual" : "Anual" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Método de pago:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium capitalize", children: metodoPago })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "w-full bg-[#fa4616] hover:bg-[#f94517] text-white font-bold py-3 px-4 rounded-md transition-colors uppercase", children: "¡Donar!" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 text-xs text-gray-500 text-center", children: "Tu donación ayuda a llevar educación y lectura a las zonas rurales de Colombia." })
      ] }) })
    ] })
  ] });
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DonacionesPage
}, Symbol.toStringTag, { value: "Module" }));
async function loader$4({ params }) {
  const { Id } = params;
  if (!Id) {
    throw new Response("ID de libro no proporcionado", { status: 400 });
  }
  const response = await getLibroById(Id);
  if (!response) {
    throw new Response("Libro no encontrado", { status: 404 });
  }
  return json({ response });
}
const LibroDetalle = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const { response } = useLoaderData();
  if (!response.responseElements || response.responseElements.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-10", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center", children: "No se encontró información del libro" }) });
  }
  const libro = response.responseElements[0];
  const descargarArchivo = async (idLibro) => {
    try {
      const blob = await descargarLibro(idLibro);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${libro.titulo}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };
  const verPdf = async (idLibro) => {
    try {
      const blob = await descargarLibro(idLibro);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPdf(true);
    } catch (error) {
      console.error(error);
    }
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center text-gray-600 hover:text-[#fa4616]",
          children: [
            /* @__PURE__ */ jsx(Home, { className: "h-4 w-4 mr-1" }),
            /* @__PURE__ */ jsx("span", { children: "Inicio" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx(Link, { to: "/libros", className: "text-gray-600 hover:text-[#fa4616]", children: "Libros" }),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: libro.titulo })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-6xl mx-auto px-6 md:px-12 py-6 flex-grow", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsx("div", { className: "md:col-span-1 mx-auto shadow-xl", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: `http://localhost:5046/portadas/${libro.portada}`,
            alt: `Portada de ${libro.titulo}`,
            className: "bg-[#fa4616] w-96 object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: libro.genero && libro.genero.split(",").map((genero, index) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm",
              children: genero.trim()
            },
            index
          )) }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-[#fa4616] mb-2", children: libro.titulo }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl mb-4", children: libro.autor }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Editorial:" }),
            /* @__PURE__ */ jsx("p", { children: libro.editorial || "No disponible" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-6", children: libro.contraPortada || "No hay descripción disponible" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 mb-8", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "bg-[#fa4616] text-white px-6 py-3 rounded-md flex items-center hover:bg-[#f94517] transition-colors",
                onClick: () => descargarArchivo(libro.id),
                children: [
                  "Descargar ",
                  /* @__PURE__ */ jsx(Download, { className: "ml-2 h-5 w-5" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => verPdf(libro.id),
                className: "bg-[#fa4616] text-white px-6 py-3 rounded-md flex items-center hover:bg-[#f94517] transition-colors",
                children: [
                  "Ver PDF ",
                  /* @__PURE__ */ jsx(FileText, { className: "ml-2 h-5 w-5" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 text-center", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: libro.totalDescargas }),
              /* @__PURE__ */ jsx(Download, { className: "h-5 w-5 text-gray-500" })
            ] }),
            libro.totalDescargas == 1 ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "Vez descargado" }) : /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "Veces descargado" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: showPdf && /* @__PURE__ */ jsx(
        "iframe",
        {
          src: pdfUrl,
          width: "100%",
          height: "600",
          frameBorder: "0",
          scrolling: "no"
        }
      ) }),
      libro.librosRelacionados && libro.librosRelacionados.length > 0 ? /* @__PURE__ */ jsxs("section", { className: "mt-16 max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-8 text-[#002847]", children: "Libros relacionados" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10", children: libro.librosRelacionados.map(
          (libroRelacionado) => /* @__PURE__ */ jsx(
            Card,
            {
              id: libroRelacionado.id,
              titulo: libroRelacionado.titulo,
              portada: `http://localhost:5046/portadas/${libroRelacionado.portada}`,
              autor: libroRelacionado.autor,
              genero: libroRelacionado.genero
            },
            libroRelacionado.id
          )
        ) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-10", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center", children: "No hay libros relacionados" }) })
    ] })
  ] }) });
};
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LibroDetalle,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
async function Login(email, password) {
  try {
    const response = await fetch(
      "http://localhost:5046/api/authenticate/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }
    );
    if (!response.ok) {
      throw new Error("Error en login");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function Register(formData) {
  try {
    const response = await fetch(
      "http://localhost:5046/api/authenticate/register/admin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }
    );
    if (!response.ok) {
      throw new Error("Error en el registro");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
const Registro = () => {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    userName: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    userName: "",
    email: "",
    password: ""
  });
  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      name: "",
      lastName: "",
      userName: "",
      email: "",
      password: ""
    };
    if (!form.name) {
      newErrors.name = "El nombre es obligatorio.";
      isValid = false;
    }
    if (!form.lastName) {
      newErrors.lastName = "El apellido es obligatorio.";
      isValid = false;
    }
    if (!form.userName) {
      newErrors.userName = "El username es obligatorio.";
      isValid = false;
    }
    if (!form.email) {
      newErrors.email = "El email es obligatorio.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "El email no es válido.";
      isValid = false;
    }
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria.";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = await Register(form);
    if (data) {
      Swal.fire("Usuario registrado con éxito");
      setForm({
        name: "",
        lastName: "",
        userName: "",
        email: "",
        password: ""
      });
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "flex items-center justify-center h-screen bg-cover bg-center",
      style: { backgroundImage: "url('/img/image-login.jpg')" },
      children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-white-800 dark:border-gray-700", children: /* @__PURE__ */ jsxs("form", { className: "space-y-6", action: "#", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs(
          "h5",
          {
            className: "text-xl font-medium text-center font-semibold",
            style: { color: "#002847" },
            children: [
              " ",
              "Registrarse",
              " "
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: "nombre",
                className: "block text-sm mb-2 font-medium font-semibold",
                children: [
                  " ",
                  "Nombre",
                  " "
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                id: "nombre",
                className: "rounded-md bg-white border border-gray-300 \r\n                text-black focus:ring-black focus:border-black block flex-1 min-w-0 w-full text-sm p-2.5 \r\n                dark:bg-white dark:border-gray-600 dark:text-black dark:focus:ring-black dark:focus:border-gray-200",
                placeholder: "Nombres",
                value: form.name,
                onChange: (e) => setForm({ ...form, name: e.target.value })
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: "apellido",
                className: "block text-sm mb-2 font-medium font-semibold",
                children: [
                  " ",
                  "Apellido",
                  " "
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                id: "apellido",
                className: "rounded-md bg-white border border-gray-300 \r\n                text-black focus:ring-black focus:border-black block flex-1 min-w-0 w-full text-sm p-2.5 \r\n                dark:bg-white dark:border-gray-600 dark:text-black dark:focus:ring-black dark:focus:border-gray-200",
                placeholder: "Apellidos",
                value: form.lastName,
                onChange: (e) => setForm({ ...form, lastName: e.target.value })
              }
            ),
            errors.lastName && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.lastName })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-0", children: [
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: "username",
                className: "block mb-2 text-sm font-medium font-semibold",
                style: { color: "#002847" },
                children: [
                  " ",
                  "Username",
                  " "
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "correo",
                  className: "bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg \r\n                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-withe-700 dark:border-gray-600 \r\n                dark:placeholder-black-400 dark:text-black dark:focus:ring-gray-400 dark:focus:border-gray-500",
                  placeholder: "username",
                  value: form.userName,
                  onChange: (e) => setForm({ ...form, userName: e.target.value })
                }
              ),
              errors.userName && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.userName })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-0", children: [
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: "correo",
                className: "block mb-2 text-sm font-medium font-semibold",
                children: [
                  " ",
                  "Email",
                  " "
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "correo",
                  className: "bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg \r\n                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-withe-700 dark:border-gray-600 \r\n                dark:placeholder-black-400 dark:text-black dark:focus:ring-gray-400 dark:focus:border-gray-500",
                  placeholder: "example@example.com",
                  value: form.email,
                  onChange: (e) => setForm({ ...form, email: e.target.value })
                }
              ),
              errors.email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: "contraseña",
              className: "block text-sm font-medium font-semibold",
              style: { color: "#002847" },
              children: [
                " ",
                "Contraseña",
                " "
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              name: "contraseña",
              id: "contraseña",
              placeholder: "**********",
              onChange: (e) => setForm({ ...form, password: e.target.value }),
              value: form.password,
              className: "bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-400 block w-full p-2.5 dark:bg-white-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
            }
          ),
          errors.password && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.password })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-start", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-1", children: [
          /* @__PURE__ */ jsx("input", { id: "aceptar", type: "checkbox" }),
          /* @__PURE__ */ jsx("label", { htmlFor: "aceptar", className: "ms-1 text-sm", children: "Aceptar términos y condiciones" })
        ] }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "w-full text-white bg-[#002847] hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900",
            children: "Registrarse"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Ya tienes una cuenta?" }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/login",
              className: "text-[#002847] hover:underline font-semibold text-sm",
              children: "Iniciar sesión"
            }
          )
        ] })
      ] }) })
    }
  );
};
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Registro
}, Symbol.toStringTag, { value: "Module" }));
const CardAutor = ({
  id,
  nombre,
  apellidos,
  generos,
  foto
}) => {
  const location = useLocation();
  location.pathname;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-around  rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl group", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b-2", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: foto,
        alt: `Portada de ${nombre}`,
        className: "w-64 h-64 transition-transform duration-500 group-hover:scale-105"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-md text-gray-900 line-clamp-2", children: `${nombre} ${apellidos}` }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm", children: generos }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-5 pb-5", children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/autores/${id.toString()}`,
        className: "flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#fa4616] rounded-md hover:bg-[#fa5316] transition-colors",
        children: [
          /* @__PURE__ */ jsx("span", { children: "Ver detalles" }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ]
      }
    ) })
  ] });
};
function loader$3() {
  return getAllAutores();
}
const paginaAutores = () => {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full h-64 md:h-80 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#002847]/90 to-[#002847]/80 mix-blend-multiply" }),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          alt: "Biblioteca de libros",
          className: "w-full h-full object-cover"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-white p-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-4xl font-bold tracking-tight mb-2", children: "Autores" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl max-w-2xl text-center text-white/80", children: "Conoce a los escritores detrás de tus obras favoritas y explora su bibliografía" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center text-gray-600 hover:text-[#fa4616]",
          children: [
            /* @__PURE__ */ jsx(Home, { className: "h-4 w-4 mr-1" }),
            /* @__PURE__ */ jsx("span", { children: "Inicio" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx(Link, { to: "/autores", className: "text-gray-600 hover:text-[#fa4616]", children: "Autores" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto mb-4", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm", children: [
        "Mostrando ",
        data.length,
        " resultados"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-6xl mx-auto mt-8 mb-16", children: data.map((item) => /* @__PURE__ */ jsx(
        CardAutor,
        {
          id: item.id,
          nombre: item.nombre,
          apellidos: item.apellidos,
          foto: `http://localhost:5046/autores/${item.foto}`,
          generos: item.generos,
          nacionalidad: ""
        },
        item.id
      )) })
    ] })
  ] });
};
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: paginaAutores,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2() {
  return getAllLibros();
}
const Libros = () => {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full h-64 md:h-80 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#002847]/90 to-[#002847]/80 mix-blend-multiply" }),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          alt: "Biblioteca de libros",
          className: "w-full h-full object-cover"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-white p-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-4xl font-bold tracking-tight mb-2", children: "Libros" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl max-w-2xl text-center text-white/80", children: "Explora nuestra colección de libros y encuentra tu próxima lectura favorita" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 md:px-12 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center text-gray-600 hover:text-[#fa4616]",
          children: [
            /* @__PURE__ */ jsx(Home, { className: "h-4 w-4 mr-1" }),
            /* @__PURE__ */ jsx("span", { children: "Inicio" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-gray-400", children: ">" }),
      /* @__PURE__ */ jsx(Link, { to: "/libros", className: "text-gray-600 hover:text-[#fa4616]", children: "Libros" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto mb-4", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm", children: [
        "Mostrando ",
        data.totalElements,
        " resultados"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-6xl mx-auto mt-8 mb-16", children: data.responseElements.map((item) => /* @__PURE__ */ jsx(
        Card,
        {
          id: item.id,
          titulo: item.titulo,
          portada: `http://localhost:5046/portadas/${item.portada}`,
          autor: item.autor,
          genero: item.genero
        },
        item.id ? item.id.toString() : Math.random().toString()
      )) })
    ] })
  ] });
};
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Libros,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "Biblioteca Secretos para contar" },
    { name: "description", content: "Secretos para contar" }
  ];
};
function loader$1() {
  return getAllLibros();
}
function Index() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("main", { className: "w-full overflow-hidden", children: [
    /* @__PURE__ */ jsx("section", { className: "relative w-full", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[550px] md:h-[600px]", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/55 to-black/65 z-10" }),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/public/img/paisaje.png?height=651&width=1440&&top=121px&text=paisaje",
          alt: "Paisaje rural",
          className: "absolute inset-0 w-full h-full object-cover"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex flex-col items-start justify-center z-20 container mx-auto px-6 md:px-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight", children: [
          "Lectura y educación para el",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[#fa4616]", children: "campo" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg mb-8 text-white/90 leading-relaxed max-w-2xl", children: "Llegamos hasta los pliegues más apartados de las montañas y los recodos escondidos de los ríos, para compartir sonrisas, alegrías y nuevas experiencias con las familias del campo." }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/libros",
            className: "bg-[#fa4616] hover:bg-[#e03a0e] text-white font-medium py-3 px-8 rounded-md inline-flex items-center transition-colors",
            children: [
              /* @__PURE__ */ jsx("span", { children: "Biblioteca de libros" }),
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
            ]
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-12", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-[#002847] mb-4" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-center text-[#002847]", children: "Novedades" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-3 text-center max-w-2xl", children: "Descubre nuestras últimas publicaciones y mantente al día con nuestra biblioteca" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl gap-8 md:gap-10 m-auto", children: data.responseElements.slice(0, 4).map((item) => /* @__PURE__ */ jsx(
        Card,
        {
          id: item.id,
          titulo: item.titulo,
          portada: `http://localhost:5046/portadas/${item.portada}`,
          autor: item.autor,
          genero: item.genero
        },
        item.id
      )) })
    ] }) })
  ] });
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const InicioSesion = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };
    if (!form.email) {
      newErrors.email = "El email es obligatorio.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "El email no es válido.";
      isValid = false;
    }
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria.";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = await Login(form.email, form.password);
    if (data) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      navigate("/");
    }
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative flex items-center justify-center h-screen bg-cover bg-center",
      style: { backgroundImage: "url('/img/image-login.jpg')" },
      children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-white-800 dark:border-gray-700", children: [
        " ",
        /* @__PURE__ */ jsxs("form", { className: "space-y-6", action: "#", onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsx("h5", { className: "text-xl text-center font-medium text-gray-900 dark:text-white", children: "Iniciar sesión" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-0", children: [
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: "correo",
                className: "block mb-2 text-sm font-semibold",
                children: [
                  " ",
                  "Email",
                  " "
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "correo",
                  className: "bg-white-50 border border-gray-300 text-black-900 text-sm rounded-lg \r\n                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-withe-700 dark:border-gray-600 \r\n                dark:placeholder-black-400 dark:text-black dark:focus:ring-gray-400 dark:focus:border-gray-500",
                  placeholder: "example@example.com",
                  onChange: (e) => setForm({ ...form, email: e.target.value })
                }
              )
            ] }),
            errors.email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "password",
                className: "block mb-2 text-sm font-medium text-[#002847] dark:text-white",
                children: "Contraseña"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                name: "password",
                id: "password",
                placeholder: "••••••••",
                onChange: (e) => setForm({ ...form, password: e.target.value }),
                className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              }
            ),
            errors.password && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.password })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center h-5", children: /* @__PURE__ */ jsx(
                "input",
                {
                  id: "remember",
                  type: "checkbox",
                  value: "",
                  className: "w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "remember",
                  className: "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300",
                  children: "Recuérdame"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#",
                className: "ms-auto text-sm text-[#002847] hover:underline dark:text-blue-500",
                children: "Olvidaste la contraseña?"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "w-full text-white bg-[#002847] hover:bg-[#002847] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
              children: "Ingresar"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-500 dark:text-gray-300", children: [
            "No estás registrado?",
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/registro",
                className: "text-[#002847] hover:underline dark:text-blue-500",
                children: "Crear cuenta"
              }
            )
          ] })
        ] })
      ] })
    }
  ) });
};
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: InicioSesion
}, Symbol.toStringTag, { value: "Module" }));
async function loader() {
  const response = await getAllLibros();
  const libros = response.responseElements;
  const autoresResponse = await getAllAutores();
  const audiolibrosResponse = await getAllAudiolibros();
  const audiolibros = audiolibrosResponse.responseElements;
  return {
    libros,
    // usuariosResponse,
    autoresResponse,
    audiolibros
  };
}
function AdminPanel() {
  const { libros, audiolibros, autoresResponse } = useLoaderData();
  const [activeTab, setActiveTab] = useState("libros");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 mt-8", children: [
    /* @__PURE__ */ jsx("header", { className: "bg-white shadow", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Panel de administración" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ jsxs("nav", { className: "-mb-px flex space-x-8", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("libros"),
          className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "libros" ? "border-[#002847] text-[#002847]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,
          children: "Libros"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("audiolibros"),
          className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "audiolibros" ? "border-[#002847] text-[#002847]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,
          children: "Audiolibros"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("autores"),
          className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "autores" ? "border-[#002847] text-[#002847]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,
          children: "Autores"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [
      activeTab === "libros" && /* @__PURE__ */ jsx(LibrosPanel, { libros }),
      activeTab === "audiolibros" && /* @__PURE__ */ jsx(AudiolibrosPanel, { audiolibros }),
      activeTab === "autores" && /* @__PURE__ */ jsx(AutoresPanel, { autores: autoresResponse })
    ] })
  ] });
}
function LibrosPanel({ libros }) {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Libros" }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          className: "bg-[#002847] text-white px-4 py-2 rounded flex items-center",
          to: "/agregarlibro",
          children: [
            " ",
            "Agregar libro"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: libros.map((data) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-white overflow-hidden shadow rounded-lg",
        children: /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: data.titulo }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: data.autor })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("p", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800", children: data.genero }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/editarLibro/${data.id}`,
                className: "text-[#002847] hover:text-blue-900 text-sm font-medium mr-4",
                children: "Editar"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/eliminarLibro/${data.id}`,
                className: "text-red-600 hover:text-red-900 text-sm font-medium",
                children: "Eliminar"
              }
            )
          ] })
        ] })
      },
      data.id
    )) })
  ] });
}
function AudiolibrosPanel({ audiolibros }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Audiolibros" }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          className: "bg-[#002847] text-white px-4 py-2 rounded flex items-center",
          to: "/agregaraudiolibro",
          children: [
            " ",
            "Agregar audiolibro"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-200", children: audiolibros.map((audiobook) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-[#002847] truncate", children: audiobook.titulo }),
        /* @__PURE__ */ jsx("div", { className: "ml-2 flex-shrink-0 flex", children: /* @__PURE__ */ jsx("p", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800", children: audiobook.genero }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 sm:flex sm:justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "sm:flex", children: /* @__PURE__ */ jsx("p", { className: "flex items-center text-sm text-gray-500", children: audiobook.autor }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: /* @__PURE__ */ jsxs("p", { children: [
          "Duración: ",
          audiobook.duracion
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex justify-end", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: `/editaraudioLibro/${audiobook.id}`,
            className: "text-[#002847] hover:text-blue-900 text-sm font-medium mr-4",
            children: "Editar"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: `/eliminaraudioLibro/${audiobook.id}`,
            className: "text-red-600 hover:text-red-900 text-sm font-medium",
            children: "Eliminar"
          }
        )
      ] })
    ] }) }, audiobook.id)) }) })
  ] });
}
function AutoresPanel({ autores }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Autores" }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          className: "bg-[#002847] text-white px-4 py-2 rounded flex items-center",
          to: "/agregarautor",
          children: [
            " ",
            "Agregar autor"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: autores.map((autor) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-white overflow-hidden shadow rounded-lg",
        children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs("div", { className: "", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: `${autor.nombre} ${autor.apellidos}` }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Nacionalidad:" }),
              " ",
              autor.nacionalidad
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 flex mt-2", children: /* @__PURE__ */ jsx("p", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800", children: autor.generos }) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/editarAutor/${autor.id}`,
                className: "text-[#002847] hover:text-blue-900 text-sm font-medium mr-4",
                children: "Editar"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/eliminarAutor/${autor.id}`,
                className: "text-red-600 hover:text-red-900 text-sm font-medium",
                children: "Eliminar"
              }
            )
          ] })
        ] })
      },
      autor.id
    )) })
  ] });
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminPanel,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BZzUt6Di.js", "imports": ["/assets/components-BNpk1LYi.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-jdtx0Sle.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": ["/assets/root-Chl3TsnG.css"] }, "routes/eliminaraudiolibro.$id": { "id": "routes/eliminaraudiolibro.$id", "parentId": "root", "path": "eliminaraudiolibro/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/eliminaraudiolibro._id-CtachIQb.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/x-DcI9HtMk.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/editaraudiolibro.$id": { "id": "routes/editaraudiolibro.$id", "parentId": "root", "path": "editaraudiolibro/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/editaraudiolibro._id-BD8Vqi1n.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/generoservice-C3ydkEny.js", "/assets/autorservice-DjIETraV.js"], "css": [] }, "routes/agregaraudiolibro": { "id": "routes/agregaraudiolibro", "parentId": "root", "path": "agregaraudiolibro", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/agregaraudiolibro-BL0DxzVt.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/generoservice-C3ydkEny.js", "/assets/autorservice-DjIETraV.js"], "css": [] }, "routes/eliminarautor.$id": { "id": "routes/eliminarautor.$id", "parentId": "root", "path": "eliminarautor/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/eliminarautor._id-qU3RC7_W.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/x-DcI9HtMk.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/eliminarlibro.$id": { "id": "routes/eliminarlibro.$id", "parentId": "root", "path": "eliminarlibro/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/eliminarlibro._id-DeMw1F8o.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/x-DcI9HtMk.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/audiolibros.$Id": { "id": "routes/audiolibros.$Id", "parentId": "root", "path": "audiolibros/:Id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/audiolibros._Id-F_LfS9_D.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/CardAudiolibro-CCafGUog.js", "/assets/download-C1YQC0jc.js", "/assets/arrow-right-BCCq8hix.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/editarautor.$id": { "id": "routes/editarautor.$id", "parentId": "root", "path": "editarautor/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/editarautor._id-1tDLbfo_.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/generoservice-C3ydkEny.js"], "css": [] }, "routes/editarlibro.$id": { "id": "routes/editarlibro.$id", "parentId": "root", "path": "editarlibro/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/editarlibro._id-BDJ18PXg.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/generoservice-C3ydkEny.js", "/assets/autorservice-DjIETraV.js"], "css": [] }, "routes/agregarautor": { "id": "routes/agregarautor", "parentId": "root", "path": "agregarautor", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/agregarautor-Di8RjAJA.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/generoservice-C3ydkEny.js"], "css": [] }, "routes/agregarlibro": { "id": "routes/agregarlibro", "parentId": "root", "path": "agregarlibro", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/agregarlibro-bAbxA75u.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/generoservice-C3ydkEny.js", "/assets/autorservice-DjIETraV.js"], "css": [] }, "routes/Audiolibros": { "id": "routes/Audiolibros", "parentId": "root", "path": "Audiolibros", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/Audiolibros-DojFo6ES.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/CardAudiolibro-CCafGUog.js", "/assets/house-FzFZX-LR.js", "/assets/arrow-right-BCCq8hix.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/autores.$Id": { "id": "routes/autores.$Id", "parentId": "root", "path": "autores/:Id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/autores._Id-D-nwGWGR.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/Card-Oo4ln1z0.js", "/assets/house-FzFZX-LR.js", "/assets/arrow-right-BCCq8hix.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/donaciones": { "id": "routes/donaciones", "parentId": "root", "path": "donaciones", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/donaciones-BrlsioWA.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/libros.$Id": { "id": "routes/libros.$Id", "parentId": "root", "path": "libros/:Id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/libros._Id-hYQMMgCC.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/Card-Oo4ln1z0.js", "/assets/house-FzFZX-LR.js", "/assets/download-C1YQC0jc.js", "/assets/createLucideIcon-B5GsODQJ.js", "/assets/arrow-right-BCCq8hix.js"], "css": [] }, "routes/registro": { "id": "routes/registro", "parentId": "root", "path": "registro", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/registro-C0WFviBE.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/auth-BuuCxDfM.js"], "css": [] }, "routes/Autores": { "id": "routes/Autores", "parentId": "root", "path": "Autores", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/Autores-Bh9JloSI.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/arrow-right-BCCq8hix.js", "/assets/house-FzFZX-LR.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/Libros": { "id": "routes/Libros", "parentId": "root", "path": "Libros", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/Libros-DFD_YfvL.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/Card-Oo4ln1z0.js", "/assets/house-FzFZX-LR.js", "/assets/arrow-right-BCCq8hix.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BmYlAzQi.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/Card-Oo4ln1z0.js", "/assets/arrow-right-BCCq8hix.js", "/assets/createLucideIcon-B5GsODQJ.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-CZRqCBth.js", "imports": ["/assets/components-BNpk1LYi.js", "/assets/auth-BuuCxDfM.js"], "css": [] }, "routes/panel": { "id": "routes/panel", "parentId": "root", "path": "panel", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/panel-BJMWjrkv.js", "imports": ["/assets/components-BNpk1LYi.js"], "css": [] } }, "url": "/assets/manifest-e98b3769.js", "version": "e98b3769" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/eliminaraudiolibro.$id": {
    id: "routes/eliminaraudiolibro.$id",
    parentId: "root",
    path: "eliminaraudiolibro/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/editaraudiolibro.$id": {
    id: "routes/editaraudiolibro.$id",
    parentId: "root",
    path: "editaraudiolibro/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/agregaraudiolibro": {
    id: "routes/agregaraudiolibro",
    parentId: "root",
    path: "agregaraudiolibro",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/eliminarautor.$id": {
    id: "routes/eliminarautor.$id",
    parentId: "root",
    path: "eliminarautor/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/eliminarlibro.$id": {
    id: "routes/eliminarlibro.$id",
    parentId: "root",
    path: "eliminarlibro/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/audiolibros.$Id": {
    id: "routes/audiolibros.$Id",
    parentId: "root",
    path: "audiolibros/:Id",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/editarautor.$id": {
    id: "routes/editarautor.$id",
    parentId: "root",
    path: "editarautor/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/editarlibro.$id": {
    id: "routes/editarlibro.$id",
    parentId: "root",
    path: "editarlibro/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/agregarautor": {
    id: "routes/agregarautor",
    parentId: "root",
    path: "agregarautor",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/agregarlibro": {
    id: "routes/agregarlibro",
    parentId: "root",
    path: "agregarlibro",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/Audiolibros": {
    id: "routes/Audiolibros",
    parentId: "root",
    path: "Audiolibros",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/autores.$Id": {
    id: "routes/autores.$Id",
    parentId: "root",
    path: "autores/:Id",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/donaciones": {
    id: "routes/donaciones",
    parentId: "root",
    path: "donaciones",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/libros.$Id": {
    id: "routes/libros.$Id",
    parentId: "root",
    path: "libros/:Id",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/registro": {
    id: "routes/registro",
    parentId: "root",
    path: "registro",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/Autores": {
    id: "routes/Autores",
    parentId: "root",
    path: "Autores",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/Libros": {
    id: "routes/Libros",
    parentId: "root",
    path: "Libros",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route18
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/panel": {
    id: "routes/panel",
    parentId: "root",
    path: "panel",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
