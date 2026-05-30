"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Search from "@/components/search";
import { Gamepad, ShoppingCart, Loader2 } from "lucide-react";

export default function Page() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FILTROS
    const [categoryId, setCategoryId] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        fetchGames();
    }, [categoryId, minPrice, maxPrice]);

    const fetchGames = async () => {
        try {
            setLoading(true);

            const params = {};

            // Solo agrega filtros si existen
            if (categoryId) params.categoryId = categoryId;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;

            const response = await axios.get(
                "http://localhost:8080/v1/games/all",
                {
                    params,
                    withCredentials: true,
                }
            );

            console.log("Juegos:", response.data);

            setGames(response.data);
            setError(null);
        } catch (err) {
            console.error(err);

            setError(
                "No se pudo cargar el catálogo de Vapor. Inténtalo más tarde."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#1b2838] py-8 md:py-12 select-none">
            <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">

                {/* HEADER */}
                <div className="flex items-center space-x-3 border-b border-[#2a475e]/30 pb-4">
                    <div className="bg-[#2a475e] p-2 rounded-lg">
                        <Gamepad className="w-6 h-6 text-cyan-400" />
                    </div>

                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                            Tienda de Videojuegos
                        </h1>

                        <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                            Explorá los títulos disponibles.
                        </p>
                    </div>
                </div>

                {/* SEARCH */}
                <Search games={games} />

                {/* FILTROS */}
                <div className="bg-[#171a21] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4">

                    {/* CATEGORY */}
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="bg-[#1b2838] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                    >
                        <option value="">Todas las categorías</option>
                        <option value="1">Action</option>
                        <option value="2">RPG</option>
                        <option value="3">Adventure</option>
                    </select>

                    {/* MIN PRICE */}
                    <input
                        type="number"
                        placeholder="Precio mínimo"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="bg-[#1b2838] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                    />

                    {/* MAX PRICE */}
                    <input
                        type="number"
                        placeholder="Precio máximo"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="bg-[#1b2838] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                    />

                    {/* RESET */}
                    <button
                        onClick={() => {
                            setCategoryId("");
                            setMinPrice("");
                            setMaxPrice("");
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition"
                    >
                        Limpiar filtros
                    </button>
                </div>

                {/* STATES */}
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />

                        <span className="text-xs uppercase tracking-widest font-bold">
                            Sincronizando...
                        </span>
                    </div>
                ) : error ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-4 text-center text-xs font-semibold">
                        {error}
                    </div>
                ) : games.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                        No hay videojuegos disponibles.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">

                        {games.map((game) => {
                            const id = game.id || game.id_game;
                            const price = parseFloat(game.price || 0);

                            return (
                                <div
                                    key={id}
                                    className="bg-[#171a21]/60 border border-white/[0.04] hover:border-cyan-500/30 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
                                >

                                    {/* IMAGE */}
                                    <div className="w-full h-40 bg-slate-900 relative overflow-hidden">

                                        {game.imageUrl ? (
                                            <img
                                                src={game.imageUrl}
                                                alt={game.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-white text-xs">
                                                    Sin portada
                                                </span>
                                            </div>
                                        )}

                                    </div>

                                    {/* BODY */}
                                    <div className="p-4 flex flex-col justify-between flex-1">

                                        <div>
                                            <h3 className="text-white font-bold text-sm line-clamp-2">
                                                {game.name}
                                            </h3>

                                            <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                                                {game.description}
                                            </p>
                                        </div>

                                        {/* CATEGORIES */}
                                        <div className="flex flex-wrap gap-2 mt-3">

                                            {game.categories?.map((category, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider"
                                                >
                                                    {category}
                                                </span>
                                            ))}

                                        </div>

                                        {/* FOOTER */}
                                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">

                                            <div>
                                                <span className="text-white font-black text-sm">
                                                    {price === 0
                                                        ? "Gratis"
                                                        : `u$s ${price.toFixed(2)}`}
                                                </span>
                                            </div>

                                            <button
                                                className="p-2 bg-[#2a475e] hover:bg-cyan-500 text-cyan-400 hover:text-[#171a21] rounded-lg transition-all"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
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