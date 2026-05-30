"use client";

import React, { useState } from "react";
import Link from "next/link"; // 👈 Importamos Link para la redirección
import {
  Search,
  User,
  Gamepad2,
  Calendar,
  Building2,
  Tag,
  AlertCircle,
  Loader2,
  RefreshCw,
  Library,
  X,
  FileText,
  Info,
  MessageSquarePlus // 👈 Icono nuevo para la reseña
} from "lucide-react";
import axios from "axios";
import { Heart, Trash2 } from "lucide-react";
import { useUserInformation } from "@/hooks/useUserInformation";
import { useEffect } from 'react';

export default function UserProfile({ initialEmail = "" }) {
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [searchEmail, setSearchEmail] = useState(initialEmail);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const { data, loading, error, refetch } = useUserInformation(searchEmail);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSearchEmail(emailInput.trim());
    }
  };
  const fetchWishlist = async () => {
    try {

      setWishlistLoading(true);

      const response = await axios.get(
        "http://localhost:8080/v1/games/wishlist",
        {
          withCredentials: true
        }
      );

      setWishlist(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setWishlistLoading(false);

    }
  };

  const removeFromWishlist = async (gameId) => {
    try {

      await axios.delete(
        `http://localhost:8080/v1/games/wishlist/remove/${gameId}`,
        {

          withCredentials: true
        }
      );

      setWishlist(prev =>
        prev.filter(game => game.id !== gameId)
      );

    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Error al eliminar");

    }
  };
  useEffect(() => {
    fetchWishlist();
  }, []);
  // Formateador de fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("es-ES", options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-[#c7d5e0]">
      {/* Buscador de Cuentas */}
      <div className="bg-[#171a21] p-4 rounded-xl border border-white/5 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Buscar por correo electrónico (ej. usuario@ejemplo.com)..."
              className="w-full bg-[#1b2838] border border-[#2a475e] focus:border-[#66c0f4] focus:ring-1 focus:ring-[#66c0f4] rounded-lg px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all"
              required
            />
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#66c0f4] to-[#417a9b] hover:from-cyan-400 hover:to-cyan-500 text-white font-bold text-sm uppercase rounded-lg transition-all shadow-[0_0_15px_rgba(102,192,244,0.15)] hover:shadow-[0_0_20px_rgba(102,192,244,0.3)] active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Buscar Perfil</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Estado: Cargando */}
      {loading && (
        <div className="bg-[#171a21] rounded-xl border border-white/5 p-12 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <Loader2 className="w-12 h-12 text-[#66c0f4] animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse text-sm">Consultando base de datos de Vapor...</p>
        </div>
      )}

      {/* Estado: Error */}
      {error && !loading && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <AlertCircle className="w-8 h-8 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-white font-bold text-base">Error al cargar la información</h4>
              <p className="text-rose-300 text-xs mt-0.5">
                No pudimos establecer conexión o el usuario ingresado no existe en nuestro registro.
              </p>
            </div>
          </div>
          <button
            onClick={refetch}
            className="flex items-center space-x-1.5 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs uppercase rounded border border-rose-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* Estado: Sin búsqueda inicial */}
      {!searchEmail && !loading && !error && (
        <div className="bg-[#171a21]/50 border border-white/5 rounded-xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-[#1b2838] rounded-full flex items-center justify-center text-slate-500 shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-white font-bold text-base">Visor de Cuentas de Vapor</h4>
            <p className="text-slate-400 text-xs mt-1">
              Introduzca un correo electrónico en la barra superior para inspeccionar las credenciales del perfil y los títulos comprados en la biblioteca.
            </p>
          </div>
        </div>
      )}

      {/* Estado: Datos Exitosos */}
      {data && !loading && !error && (
        <div className="space-y-6 animate-fade-in">
          {/* Tarjeta de Perfil */}
          <div className="relative overflow-hidden bg-[#171a21] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#66c0f4]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#66c0f4] to-[#417a9b] p-[2px] shadow-lg shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#1b2838] flex items-center justify-center">
                  <User className="w-10 h-10 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">{data.userName}</h3>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">
                    Activo
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">{searchEmail}</p>
                <div className="flex items-center justify-center md:justify-start space-x-1.5 text-xs text-[#66c0f4]">
                  <Library className="w-3.5 h-3.5" />
                  <span>{data.games ? data.games.length : 0} juegos en biblioteca</span>
                </div>
              </div>
            </div>
          </div>

          {/* Listado de Biblioteca de Juegos */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
              <Gamepad2 className="w-5 h-5 text-[#66c0f4]" />
              <h4 className="font-bold text-sm uppercase tracking-widest text-white">Biblioteca del Usuario</h4>
            </div>

            {!data.games || data.games.length === 0 ? (
              <div className="bg-[#171a21]/30 border border-white/5 rounded-xl p-12 text-center space-y-2">
                <p className="text-slate-400 text-sm font-medium">Esta biblioteca está vacía.</p>
                <p className="text-slate-500 text-xs">El usuario todavía no ha adquirido ningún videojuego en la tienda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.games.map((game) => {
                  const isFree = parseFloat(game.price || 0) === 0;

                  return (
                    <div
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="bg-[#171a21] border border-white/5 hover:border-[#66c0f4]/40 hover:bg-[#1b2838]/80 transition-all duration-300 rounded-xl p-4 flex gap-4 items-stretch group cursor-pointer hover:shadow-[0_0_20px_rgba(102,192,244,0.05)]"
                    >
                      {/* Portada del Juego */}
                      <div className="w-28 shrink-0 rounded-lg overflow-hidden bg-slate-900 relative h-20 md:h-auto min-h-[80px]">
                        {game.imageUrl ? (
                          <img
                            src={game.imageUrl}
                            alt={game.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#2a475e]/20">
                            <Gamepad2 className="w-8 h-8 text-slate-600" />
                          </div>
                        )}
                      </div>

                      {/* Detalles del Juego */}
                      <div className="flex-grow flex flex-col justify-between min-w-0">
                        <div className="space-y-1">
                          <h5 className="text-white font-bold text-base truncate group-hover:text-[#66c0f4] transition-colors" title={game.name}>
                            {game.name}
                          </h5>

                          {game.company && (
                            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                              <Building2 className="w-3.5 h-3.5 text-slate-500" />
                              <span className="truncate">{game.company}</span>
                            </div>
                          )}

                          {game.categories && game.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {game.categories.map((category, index) => (
                                <span
                                  key={index}
                                  className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#1b2838] border border-[#2a475e]/50 text-cyan-400 uppercase tracking-wide"
                                >
                                  <Tag className="w-2 h-2" />
                                  {category}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2 mt-2">
                          <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>Lanzamiento: {formatDate(game.releaseDate)}</span>
                          </div>
                          <span className={`text-xs font-black uppercase tracking-wide px-2 py-0.5 rounded-sm ${isFree ? 'bg-emerald-950/80 border border-emerald-900 text-emerald-400' : 'bg-blue-950/80 border border-blue-900 text-cyan-400'}`}>
                            {isFree ? "Gratis" : `u$s ${parseFloat(game.price).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="space-y-4 mt-8">

        <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
          <Heart className="w-5 h-5 text-rose-400" />
          <h4 className="font-bold text-sm uppercase tracking-widest text-white">
            Wishlist
          </h4>
        </div>

        {wishlistLoading ? (

          <div className="text-center text-slate-400 py-8">
            Cargando wishlist...
          </div>

        ) : wishlist.length === 0 ? (

          <div className="bg-[#171a21]/30 border border-white/5 rounded-xl p-8 text-center">
            <p className="text-slate-400">
              No tienes juegos en la wishlist.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {wishlist.map((game) => (

              <div
                key={game.id}
                className="bg-[#171a21] border border-white/5 rounded-xl p-4 flex justify-between items-center"
              >

                <div className="flex items-center gap-3">

                  {game.imageUrl && (
                    <img
                      src={game.imageUrl}
                      alt={game.name}
                      className="w-20 h-12 object-cover rounded"
                    />
                  )}

                  <div>

                    <h5 className="font-bold text-white">
                      {game.name}
                    </h5>

                    <p className="text-xs text-slate-400">
                      u$s {parseFloat(game.price || 0).toFixed(2)}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => removeFromWishlist(game.id)}
                  className="flex items-center gap-1 px-3 py-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Quitar
                </button>

              </div>

            ))}

          </div>

        )}

      </div>
      {/* MODAL FLOTANTE DE DETALLE DE VIDEOJUEGO */}
      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={() => setSelectedGame(null)} />

          <div className="relative w-full max-w-2xl bg-[#171a21] border border-[#2a475e]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#c7d5e0] animate-slide-up max-h-[90vh]">

            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Cerrar detalles"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-48 md:h-64 bg-slate-900 relative shrink-0">
              {selectedGame.imageUrl ? (
                <img
                  src={selectedGame.imageUrl}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1b2838]">
                  <Gamepad2 className="w-16 h-16 text-[#2a475e]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171a21] via-[#171a21]/40 to-transparent" />

              <div className="absolute bottom-4 left-6 right-12">
                <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-wider drop-shadow-md truncate">
                  {selectedGame.name}
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 bg-[#1b2838]/60 p-3 rounded-xl border border-white/5">
                {selectedGame.company && (
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-[#66c0f4]" />
                    <span>Desarrollador: <strong className="text-white font-medium">{selectedGame.company}</strong></span>
                  </div>
                )}
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#66c0f4]" />
                  <span>Lanzamiento: <strong className="text-white font-medium">{formatDate(selectedGame.releaseDate)}</strong></span>
                </div>
                <div className="ml-auto">
                  <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-sm ${parseFloat(selectedGame.price || 0) === 0 ? 'bg-emerald-950 border border-emerald-800 text-emerald-400' : 'bg-blue-950 border border-blue-900 text-cyan-400'}`}>
                    {parseFloat(selectedGame.price || 0) === 0 ? "Gratis" : `u$s ${parseFloat(selectedGame.price).toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#66c0f4]" /> Descripción del Producto
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed bg-[#1b2838]/20 p-4 rounded-xl border border-white/[0.02]">
                  {selectedGame.description || "Este título corporativo no cuenta con una sinopsis o descripción detallada provista por el desarrollador."}
                </p>
              </div>

              {selectedGame.categories && selectedGame.categories.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#66c0f4]" /> Etiquetas Populares
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGame.categories.map((category, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#1b2838] border border-[#2a475e]/60 text-cyan-400 uppercase tracking-wide"
                      >
                        <Tag className="w-3 h-3" />
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 italic">
              </div>
            </div>

            {/* 👇 MODIFICADO: Footer con botón de Reseña y botón de Cierre */}
            <div className="p-4 bg-[#1b2838]/40 border-t border-white/5 flex items-center justify-between gap-3">

              {/* Botón dinámico para ir a reseñar */}
              <Link
                href={`/games/${selectedGame.id_game || selectedGame.game_id || selectedGame.id}`}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-2 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Escribir Reseña</span>
              </Link>

              <button
                onClick={() => setSelectedGame(null)}
                className="px-5 py-2.5 bg-[#2a475e] hover:bg-[#345975] text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}