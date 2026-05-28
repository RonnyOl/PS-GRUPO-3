"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, Flame, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link"; // 👈 1. Importamos el componente nativo de enrutamiento

export default function ShoppingPage() {
    const { addToCart, cart, setIsOpen } = useCart();

    // Estados para la API
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Petición al backend
    useEffect(() => {
        axios
            .get("http://localhost:8080/v1/games/all", { withCredentials: true })
            .then((response) => {
                setGames(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err.message);
                setError("No se pudo conectar con el servidor de Vapor. Asegurate de que el backend esté corriendo.");
                setLoading(false);
            });
    }, []);

    const handleAddAndOpen = (game) => {
        const cartItem = {
            id_game: game.id || game.id_game,
            name: game.name,
            price: game.price,
            image_url: game.imageUrl || game.image_url,
            quantity: 1
        };

        addToCart(cartItem);
        setIsOpen(true);
    };

    const formatPrice = (price) => {
        const parsedPrice = parseFloat(price || 0);
        return parsedPrice === 0 ? "Gratis" : `u$s ${parsedPrice.toFixed(2)}`;
    };

    return (
        <main className="min-h-screen bg-[#1b2838] text-[#c7d5e0] py-8 md:py-12">
            <div className="max-w-5xl mx-auto px-4 space-y-8">

                {/* Cabecera de la Tienda */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#171a21] p-6 rounded-2xl border border-white/5 shadow-2xl">
                    <div>
                        <div className="flex items-center space-x-2 text-cyan-400">
                            <Flame className="w-5 h-5" />
                            <span className="text-xs uppercase font-bold tracking-widest">Tienda Vapor</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mt-1">
                            Explorar Videojuegos
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#2a475e] hover:bg-[#203647] text-white text-xs font-bold uppercase rounded-lg border border-[#3b5c77]/50 transition-all cursor-pointer"
                    >
                        <ShoppingBag className="w-4 h-4 text-cyan-400" />
                        <span>Ver mi Carrito ({cart.length})</span>
                    </button>
                </div>

                {/* ESTADO: Cargando Productos */}
                {loading && (
                    <div className="bg-[#171a21] rounded-xl border border-white/5 p-12 flex flex-col items-center justify-center space-y-4 shadow-xl">
                        <Loader2 className="w-12 h-12 text-[#66c0f4] animate-spin" />
                        <p className="text-slate-400 font-medium animate-pulse text-sm">Sincronizando catálogo de juegos...</p>
                    </div>
                )}

                {/* ESTADO: Error en la Petición */}
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex items-center space-x-3.5 shadow-lg max-w-2xl mx-auto">
                        <AlertCircle className="w-8 h-8 text-rose-400 shrink-0" />
                        <div>
                            <h4 className="text-white font-bold text-sm">Error de Red</h4>
                            <p className="text-rose-300 text-xs mt-0.5">{error}</p>
                        </div>
                    </div>
                )}

                {/* VISTA PRINCIPAL: Grilla de productos en venta */}
                {!loading && !error && (
                    games.length === 0 ? (
                        <div className="bg-[#171a21]/50 border border-white/5 rounded-xl p-12 text-center text-slate-400 text-sm">
                            No hay videojuegos disponibles en la tienda actualmente.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {games.map((game) => {
                                const gameId = game.id || game.id_game;
                                const isFree = parseFloat(game.price || 0) === 0;
                                const isInCart = cart.some(item => (item.id_game === gameId || item.game_id === gameId));
                                const gameImage = game.imageUrl || game.image_url;

                                return (
                                    <div
                                        key={gameId}
                                        className="bg-[#171a21] border border-white/5 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#2a475e]/70 transition-all shadow-lg"
                                    >
                                        {/* 👈 2. Envolvemos la parte interactiva superior de la card con el Link dinámico */}
                                        <Link href={`/games/${gameId}`} className="block flex-grow flex flex-col cursor-pointer">

                                            {/* Portada del Juego */}
                                            <div className="bg-slate-900 aspect-video relative flex items-center justify-center overflow-hidden">
                                                {gameImage ? (
                                                    <img
                                                        src={gameImage}
                                                        alt={game.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-8 h-8 opacity-20 absolute text-slate-500" />
                                                        <span className="text-xs font-mono tracking-widest text-slate-600 uppercase">VAPOR ART</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Info interna */}
                                            <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                                                <div>
                                                    {game.company && (
                                                        <span className="text-[10px] text-slate-500 font-semibold block uppercase truncate">
                                                            {game.company}
                                                        </span>
                                                    )}
                                                    {/* El título cambia a color cyan cuando el usuario pasa el mouse por la card */}
                                                    <h3 className="text-white font-bold text-base mt-0.5 truncate group-hover:text-cyan-400 transition-colors" title={game.name}>
                                                        {game.name}
                                                    </h3>

                                                    {/* Categorías Dinámicas */}
                                                    {game.categories && game.categories.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                            {game.categories.map((cat, idx) => (
                                                                <span key={idx} className="px-1.5 py-0.5 bg-[#1b2838] text-cyan-400 text-[8px] font-bold uppercase tracking-wider rounded border border-[#2a475e]/30">
                                                                    {cat}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Precio y Acción (Mantenido fuera del Link para evitar eventos de click anidados molestos) */}
                                        <div className="p-4 pt-0">
                                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                <span className={`text-sm font-black ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                                                    {formatPrice(game.price)}
                                                </span>

                                                <button
                                                    onClick={() => handleAddAndOpen(game)}
                                                    disabled={isInCart}
                                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded tracking-wider transition-all cursor-pointer ${
                                                        isInCart
                                                            ? 'bg-emerald-950/40 text-emerald-500 border border-emerald-900/40 cursor-not-allowed'
                                                            : 'bg-[#66c0f4] hover:bg-cyan-400 text-[#171a21]'
                                                    }`}
                                                >
                                                    {isInCart ? "En Carrito" : "Añadir"}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>
        </main>
    );
}