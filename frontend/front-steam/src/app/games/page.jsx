"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Search from '@/components/search';
import { Gamepad, ShoppingCart, Loader2 } from 'lucide-react';

export default function Page() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:8080/v1/games/all", { withCredentials: true })
            .then((response) => {
                console.log("Juegos recibidos:", response.data);
                setGames(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al pedir catálogo:", error.message);
                setError("No se pudo cargar el catálogo de Vapor. Inténtalo más tarde.");
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen bg-[#1b2838] py-8 md:py-12 select-none">
            <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">

                {/* Título de la Sección */}
                <div className="flex items-center space-x-3 border-b border-[#2a475e]/30 pb-4">
                    <div className="bg-[#2a475e] p-2 rounded-lg">
                        <Gamepad className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                            Tienda de Videojuegos
                        </h1>
                        <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                            Explorá los títulos disponibles en la facultad y añadilos a tu biblioteca.
                        </p>
                    </div>
                </div>

                {/* Buscador y Filtros */}
                <Search games={games} />

                {/* CONTROL DE ESTADOS (Carga, Error y Catálogo Vacío) */}
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <span className="text-xs uppercase tracking-widest font-bold">Sincronizando con base de datos...</span>
                    </div>
                ) : error ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-4 text-center text-xs font-semibold">
                        {error}
                    </div>
                ) : games.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                        No hay videojuegos publicados en este momento.
                    </div>
                ) : (
                    /* GRILLA DE JUEGOS */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                        {games.map((game) => {
                            // Mapeamos de forma defensiva los nombres de las propiedades de tu base de datos
                            const id = game.id_game || game.game_id || game.id;
                            const price = parseFloat(game.price || 0);

                            return (
                                <div
                                    key={id}
                                    className="bg-[#171a21]/60 border border-white/[0.04] hover:border-cyan-500/30 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Contenedor de Imagen / Thumbnail */}
                                    <div className="w-full h-40 bg-slate-900 relative overflow-hidden shrink-0">
                                        {game.image_url || game.imageUrl ? (
                                            <img
                                                src={game.image_url || game.imageUrl}
                                                alt={game.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#1b2838]">
                                                <span className="text-[10px] text-[#2a475e] font-black uppercase tracking-wider">Sin Portada</span>
                                            </div>
                                        )}
                                        {/* Badge del género si existiera */}
                                        {game.genre && (
                                            <span className="absolute left-3 top-3 bg-[#171a21]/80 backdrop-blur-md text-[#66c0f4] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                {game.genre}
                                            </span>
                                        )}
                                    </div>

                                    {/* Cuerpo con Información */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-white font-bold text-sm tracking-wide line-clamp-2" title={game.name}>
                                                {game.name}
                                            </h3>
                                            <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                                                {game.description || "Sin descripción disponible para este título en el servidor."}
                                            </p>
                                        </div>

                                        {/* Footer de la tarjeta: Precio y Botón de compra */}
                                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Precio</span>
                                                <span className="text-white font-black text-sm font-mono">
                                                    {price === 0 ? "Gratis" : `u$s ${price.toFixed(2)}`}
                                                </span>
                                            </div>

                                            <button
                                                className="p-2 bg-[#2a475e] hover:bg-cyan-500 text-cyan-400 hover:text-[#171a21] rounded-lg shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                                                title="Añadir al carrito"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                <span className="sr-only sm:not-sr-only text-[10px]">Añadir</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}