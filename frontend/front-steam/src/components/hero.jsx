"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, Info, Calendar, Tag } from 'lucide-react';

/**
 * Componente Hero: Carrusel de juegos basado estrictamente en el esquema SQL proporcionado.
 * Atributos utilizados: id_game, name, description, genre, price, image_url, release_date.
 * 
 * @param {Array} games - Lista de objetos provenientes de la tabla 'game'.
 */
export default function Hero({ games = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const handleNext = () => {
        setCurrentIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
    };
    // Cambio automático de slide cada 5 segundos, pausado si el usuario tiene el mouse encima
    useEffect(() => {
        if (games.length === 0 || isHovering) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, games.length, isHovering]);



    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
    };

    // Estado de carga/vacío
    if (!games || games.length === 0) {
        return (
            <div className="w-full h-[480px] bg-[#171a21] rounded-xl flex flex-col items-center justify-center border border-slate-800 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#66c0f4]"></div>
                <p className="text-slate-500 font-medium tracking-wide">Sincronizando con la base de datos de Vapor...</p>
            </div>
        );
    }

    const currentGame = games[currentIndex];

    // Formateador de fecha (release_date)
    const formatDate = (dateString) => {
        if (!dateString) return "Próximamente";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <section
            className="relative group w-full h-[500px] bg-[#171a21] overflow-hidden rounded-xl shadow-2xl border border-white/5"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Efecto de fondo dinámico con desenfoque basado en la imagen del juego actual */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl transition-all duration-1000 ease-in-out scale-110"
                style={{ backgroundImage: `url(${currentGame.imageUrl})` }}
            />

            <div className="relative h-full flex flex-col md:flex-row z-10">

                {/* ÁREA VISUAL: image_url */}
                <div className="relative w-full md:w-2/3 h-1/2 md:h-full overflow-hidden group/image">
                    {currentGame.imageUrl ? (
                        <img
                            src={currentGame.imageUrl}
                            alt={currentGame.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2a475e] to-[#171a21] flex items-center justify-center">
                            <Gamepad2 className="w-24 h-24 text-slate-700" />
                        </div>
                    )}

                    {/* Degradado para integración visual */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#171a21]/80 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171a21] via-transparent to-transparent md:hidden" />
                </div>

                {/* ÁREA DE INFORMACIÓN: Atributos SQL */}
                <div className="w-full md:w-1/3 p-8 flex flex-col justify-between bg-[#171a21]/95 backdrop-blur-md border-l border-white/5">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-[#66c0f4]">
                                <Tag size={14} className="fill-current" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                                    {currentGame.genre || "General"}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                                {currentGame.name}
                            </h2>
                        </div>

                        <p className="text-slate-400 text-sm line-clamp-5 leading-relaxed font-light italic">
                            &quot;{currentGame.description || "Explora este increíble título en nuestra plataforma. Detalles próximamente."}&quot;
                        </p>

                        <div className="flex items-center space-x-3 text-slate-500 text-xs font-medium">
                            <Calendar size={14} />
                            <span>Lanzamiento: {formatDate(currentGame.release_date)}</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Precio Actual</span>
                            <span className="text-3xl font-black text-white">
                                {parseFloat(currentGame.price) === 0 ? (
                                    <span className="text-emerald-400 uppercase">Gratis</span>
                                ) : (
                                    `$${parseFloat(currentGame.price).toFixed(2)}`
                                )}
                            </span>
                        </div>

                        <button className="group/btn relative px-8 py-4 bg-gradient-to-r from-[#66c0f4] to-[#417a9b] text-white font-bold rounded-sm overflow-hidden transition-all shadow-[0_0_20px_rgba(102,192,244,0.2)] hover:shadow-[0_0_25px_rgba(102,192,244,0.4)] active:scale-95">
                            <span className="relative z-10 flex items-center space-x-2">
                                <Info size={18} />
                                <span>VER FICHA</span>
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* NAVEGACIÓN: Flechas laterales */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-[#66c0f4] text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-30 border border-white/10"
                aria-label="Anterior"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-[#66c0f4] text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-30 border border-white/10"
                aria-label="Siguiente"
            >
                <ChevronRight size={24} />
            </button>

            {/* INDICADORES: Paginación visual */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
                {games.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === idx
                            ? 'w-10 bg-[#66c0f4] shadow-[0_0_10px_rgba(102,192,244,0.8)]'
                            : 'w-2 bg-slate-600 hover:bg-slate-400'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}