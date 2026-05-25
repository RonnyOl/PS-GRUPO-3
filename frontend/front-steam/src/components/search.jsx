"use client";

import React, { useState, useMemo } from 'react';
import { Search, Tag, Calendar, ShoppingCart, Gamepad2, SlidersHorizontal, Eye, X } from 'lucide-react';

/**
 * Componente GameSearchList: Buscador y listado vertical de juegos.
 * Basado estrictamente en el esquema SQL (id_game, name, description, genre, price, image_url, release_date).
 * 
 * @param {Array} games - Lista de juegos provenientes de la base de datos.
 * @param {Function} onGameClick - Callback para ver la ficha del juego.
 * @param {Function} onAddToCart - Callback para añadir al carrito.
 */
export default function GameSearchList({ games = [], onGameClick, onAddToCart }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Todos");
    const [maxPrice, setMaxPrice] = useState(100); // Rango de precio simulado hasta $100
    const [sortBy, setSortBy] = useState("default"); // default, price_asc, price_desc, name_asc

    // Obtener géneros únicos de la lista de juegos para llenar el filtro dinámicamente
    const genres = useMemo(() => {
        const list = games.map(g => g.genre).filter(Boolean);
        return ["Todos", ...new Set(list)];
    }, [games]);

    const filteredAndSortedGames = useMemo(() => {
        let result = [...games];

        // 1. Filtrado por texto (nombre o descripción)
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            result = result.filter(game =>
                game.name.toLowerCase().includes(term) ||
                (game.description && game.description.toLowerCase().includes(term))
            );
        }

        // 2. Filtrado por género
        if (selectedGenre !== "Todos") {
            result = result.filter(game => game.genre === selectedGenre);
        }

        // 3. Filtrado por precio máximo
        result = result.filter(game => parseFloat(game.price) <= maxPrice);

        // 4. Ordenamiento
        if (sortBy === "price_asc") {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === "price_desc") {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortBy === "name_asc") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [games, searchTerm, selectedGenre, maxPrice, sortBy]);

    // Formateador de fecha compatible con el atributo 'release_date' de tu SQL
    const formatDate = (dateString) => {
        if (!dateString) return "Sin fecha";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <section className="w-full text-[#c7d5e0]">
            {/* Barra de Búsqueda Principal estilo Steam */}
            <div className="bg-[#171a21]/80 p-4 rounded-t-lg border-x border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1b2838] border border-[#2a475e] focus:border-[#66c0f4] rounded px-4 py-2 pl-10 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Ordenamiento de la lista */}
                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                    <span className="text-xs text-slate-400 whitespace-nowrap">Ordenar por:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-[#1b2838] border border-[#2a475e] text-xs text-white rounded px-3 py-2 outline-none focus:border-[#66c0f4] cursor-pointer"
                    >
                        <option value="default">Relevancia</option>
                        <option value="name_asc">Nombre (A-Z)</option>
                        <option value="price_asc">Precio: de menor a mayor</option>
                        <option value="price_desc">Precio: de mayor a menor</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-[1px]">
                {/* PANEL LATERAL DE FILTROS */}
                <aside className="w-full lg:w-1/4 bg-[#171a21] p-5 rounded-b-lg lg:rounded-bl-lg lg:rounded-br-none border-x border-b border-white/5 space-y-6 h-fit">
                    <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
                        <SlidersHorizontal size={16} className="text-[#66c0f4]" />
                        <span className="font-bold text-sm tracking-wider uppercase text-white">Filtrar por</span>
                    </div>

                    {/* Filtro de Género (Basado en el campo SQL 'genre') */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Género</label>
                        <div className="flex flex-wrap lg:flex-col gap-1.5">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-3 py-1.5 rounded text-xs text-left transition-all ${selectedGenre === genre
                                        ? 'bg-[#66c0f4] text-[#171a21] font-bold'
                                        : 'bg-[#1b2838] text-slate-300 hover:bg-[#2a475e] hover:text-white'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtro de Precio Máximo (Basado en el campo SQL 'price') */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-400 uppercase tracking-wider">Precio máximo</span>
                            <span className="text-[#66c0f4] font-bold">
                                {maxPrice === 100 ? "Cualquier precio" : `u$s ${maxPrice}`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-[#1b2838] rounded-lg appearance-none cursor-pointer accent-[#66c0f4]"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500">
                            <span>u$s 0 (Gratis)</span>
                            <span>u$s 100+</span>
                        </div>
                    </div>
                </aside>

                {/* LISTADO VERTICAL DE JUEGOS */}
                <div className="w-full lg:w-3/4 space-y-2">
                    {filteredAndSortedGames.length === 0 ? (
                        <div className="bg-[#171a21] rounded-lg p-12 text-center border border-white/5 space-y-4">
                            <p className="text-slate-400 text-base">No hay juegos que coincidan con tu búsqueda.</p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedGenre("Todos"); setMaxPrice(100); }}
                                className="px-4 py-2 bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] text-white font-bold text-xs rounded transition-all"
                            >
                                Restablecer Filtros
                            </button>
                        </div>
                    ) : (
                        filteredAndSortedGames.map((game) => {
                            const isFree = parseFloat(game.price) === 0;

                            return (
                                <div
                                    key={game.game_id}
                                    className="bg-[#1b2838]/40 hover:bg-[#1b2838] border border-white/5 hover:border-[#2a475e] transition-all duration-200 rounded flex flex-col md:flex-row items-stretch p-2 md:p-3 gap-4 group"
                                >
                                    {/* Imagen del Juego o Placeholder */}
                                    <div className="w-full md:w-44 h-24 shrink-0 rounded overflow-hidden bg-slate-900 relative">
                                        {game.image_url ? (
                                            <img
                                                src={game.image_url}
                                                alt={game.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#2a475e]/20">
                                                <Gamepad2 className="w-10 h-10 text-slate-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Información Principal */}
                                    <div className="flex-grow flex flex-col justify-between min-w-0 py-1">
                                        <div className="space-y-1">
                                            <h4
                                                onClick={() => onGameClick && onGameClick(game)}
                                                className="text-white font-bold text-base md:text-lg hover:text-[#66c0f4] transition-colors cursor-pointer truncate"
                                            >
                                                {game.name}
                                            </h4>

                                            {/* Género y Fecha */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                                {game.genre && (
                                                    <span className="flex items-center gap-1">
                                                        <Tag size={12} className="text-[#66c0f4]" />
                                                        {game.genre}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    Lanzamiento: {formatDate(game.release_date)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Descripción truncada */}
                                        <p className="text-slate-400 text-xs line-clamp-1 italic font-light mt-1 md:mt-0">
                                            {game.description || "Sin descripción disponible para este videojuego."}
                                        </p>
                                    </div>

                                    {/* Precio y Botones de Acción */}
                                    <div className="flex md:flex-col justify-between md:justify-center items-center md:items-end gap-3 shrink-0 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 pl-1">
                                        {/* Precio */}
                                        <div className="text-right">
                                            <span className={`text-lg font-black tracking-wide ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                                                {isFree ? "Gratis" : `u$s ${parseFloat(game.price).toFixed(2)}`}
                                            </span>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onGameClick && onGameClick(game)}
                                                className="p-2 bg-[#2a475e]/50 hover:bg-[#2a475e] text-slate-300 hover:text-white rounded transition-colors"
                                                title="Ver detalles"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onAddToCart && onAddToCart(game)}
                                                className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-[#66c0f4] to-[#417a9b] text-white font-bold text-xs uppercase rounded transition-all shadow hover:shadow-[0_0_15px_rgba(102,192,244,0.3)] active:scale-95"
                                            >
                                                <ShoppingCart size={14} />
                                                <span className="hidden sm:inline">Comprar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}