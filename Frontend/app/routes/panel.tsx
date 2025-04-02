"use client";

import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Button from "~/components/Button";
import { AudioLibro } from "~/models/AudioLibro";
import { Autor } from "~/models/Autor";
import { Libro } from "~/models/Libro";
import { Usuario } from "~/models/Usuario";
import { getAllAudiolibros } from "~/services/audiolibroservice";
import { getAllAutores } from "~/services/autorservice";
import { getAllLibros } from "~/services/libroservice";
import { getAllUsuarios } from "~/services/userService";
import AgregarLibro from "./agregarlibro";
import EditarLibro from "./editarlibro.$id";
import EliminarLibro from "./eliminarlibro.$id";

export async function loader() {
  const response = await getAllLibros();
  const libros = response.responseElements;

  //   const usuariosResponse = await getAllUsuarios();
  //   const usuarios = usuariosResponse.responseElements;

  const autoresResponse = await getAllAutores();

  const audiolibrosResponse = await getAllAudiolibros();
  const audiolibros = audiolibrosResponse.responseElements;

  return {
    libros,
    // usuarios,
    autoresResponse,
    audiolibros,
  };
}

export default function AdminPanel() {
  const { libros, audiolibros, autoresResponse } =
    useLoaderData<typeof loader>();

  const [activeTab, setActiveTab] = useState("libros");

  return (
    <div className="min-h-screen bg-gray-50 mt-8">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Panel de administración
          </h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {/* <button
              onClick={() => setActiveTab("usuarios")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "usuarios"
                  ? "border-[#002847] text-[#002847]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Usuarios
            </button> */}
            <button
              onClick={() => setActiveTab("libros")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "libros"
                  ? "border-[#002847] text-[#002847]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Libros
            </button>
            <button
              onClick={() => setActiveTab("audiolibros")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "audiolibros"
                  ? "border-[#002847] text-[#002847]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Audiolibros
            </button>
            <button
              onClick={() => setActiveTab("autores")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "autores"
                  ? "border-[#002847] text-[#002847]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Autores
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* {activeTab === "users" && <UsersPanel usuarios={usuarios} />} */}
        {activeTab === "libros" && <LibrosPanel libros={libros} />}
        {activeTab === "audiolibros" && (
          <AudiolibrosPanel audiolibros={audiolibros} />
        )}
        {activeTab === "autores" && <AutoresPanel autores={autoresResponse} />}
      </main>
    </div>
  );
}

function UsuariosPanel({ usuarios }: { usuarios: Usuario[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Usuarios</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
          Añadir Usuario
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Editar
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LibrosPanel({ libros }: { libros: Libro[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Libros</h2>
        <Link
          className="bg-[#002847] text-white px-4 py-2 rounded flex items-center"
          to="/agregarlibro"
        >
          {" "}
          Agregar libro
        </Link>
        {/* <Button onClick={() => setIsOpen(true)} text={"Agregar libro"} />
        {isOpen && <AgregarLibro />} */}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {libros.map((data) => (
          <div
            key={data.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex flex-col">
                <h3 className="text-lg font-medium text-gray-900">
                  {data.titulo}
                </h3>
                <p className="text-sm text-gray-500">{data.autor}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Año: {data.anioPublicacion}
                </p>
                <p className="text-sm text-gray-500">Género: {data.genero}</p>
              </div>
              <div className="mt-5 flex justify-end">
                <Link
                  to={`/editarLibro/${data.id}`}
                  className="text-[#002847] hover:text-blue-900 text-sm font-medium mr-4"
                >
                  Editar
                </Link>
                <Link
                  to={`/eliminarLibro/${data.id}`}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Eliminar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AudiolibrosPanel({ audiolibros }: { audiolibros: AudioLibro[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Audiolibros</h2>
        <button className="bg-[#002847] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#001247]">
          Añadir Audiolibro
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {audiolibros.map((audiobook) => (
            <li key={audiobook.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-[#002847] truncate">
                    {audiobook.titulo}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {audiobook.genero}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {audiobook.autor}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Duración: {audiobook.duracion}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="text-[#002847] hover:text-blue-900 text-sm font-medium mr-4">
                    Editar
                  </button>
                  <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AutoresPanel({ autores }: { autores: Autor[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Autores</h2>
        <Link
          className="bg-[#002847] text-white px-4 py-2 rounded flex items-center"
          to="/agregarautor"
        >
          {" "}
          Agregar autor
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {autores.map((autor) => (
          <div
            key={autor.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="">
                  <h3 className="text-lg font-medium text-gray-900">
                    {`${autor.nombre} ${autor.apellidos}`}
                  </h3>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Nacionalidad:</span>{" "}
                    {autor.nacionalidad}
                  </p>
                  <div className="flex-shrink-0 flex mt-2">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {autor.generos}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Link
                  to={`/editarAutor/${autor.id}`}
                  className="text-[#002847] hover:text-blue-900 text-sm font-medium mr-4"
                >
                  Editar
                </Link>
                <Link
                  to={`/eliminarAutor/${autor.id}`}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Eliminar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
