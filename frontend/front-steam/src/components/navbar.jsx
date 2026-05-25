"use client";

import React from 'react';
import {
    Gamepad,
    Heart,
    ShoppingCart,
    User
} from 'lucide-react';

/**
 * Componente Navbar reutilizable con estética de Steam (Vapor).
 * 
 * @param {number} cartCount - Cantidad de artículos en el carrito de compras.
 * @param {number} wishlistCount - Cantidad de artículos en la lista de deseos.
 * @param {function} onCartClick - Función para abrir el drawer/modal del carrito.
 * @param {function} onToast - Función para disparar avisos flotantes de información.
 */
export default function Navbar({
    cartCount = 0,
    wishlistCount = 0,
    onCartClick,
    onToast
}) {

    // Manejador por defecto si no se pasa la función por props
    const handleToast = (message) => {
        if (onToast) {
            onToast(message);
        } else {
            console.log("Toast simulado:", message);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-[#171a21] border-b border-sky-950/40 shadow-xl backdrop-blur-md w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                { }
                <div className="flex items-center space-x-8">
                    {/* Logo con efecto hover */}
                    <div className="flex items-center space-x-2 cursor-pointer group">
                        <div className="bg-[#2a475e] p-2 rounded-lg group-hover:bg-[#66c0f4] transition-colors duration-300">
                            <Gamepad className="w-6 h-6 text-cyan-400 group-hover:text-slate-900 transition-colors duration-300" />
                        </div>
                        <div>
                            <span className="font-extrabold tracking-wider text-xl text-white uppercase group-hover:text-cyan-400 transition-colors">STEAM</span>
                            <span className="text-xs block text-[#66c0f4] -mt-1 font-semibold tracking-widest">FACULTAD</span>
                        </div>
                    </div>

                    {/* Enlaces de navegación tipo Steam */}
                    <nav className="hidden lg:flex space-x-6 text-sm font-semibold tracking-wide text-[#b8b6b4]">
                        <a href="#store" className="text-white border-b-2 border-[#66c0f4] pb-1">TIENDA</a>
                        <a
                            href="#comunidad"
                            className="hover:text-white transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToast("Módulo de comunidad: disponible en el sprint 2");
                            }}
                        >
                            COMUNIDAD
                        </a>
                        <a
                            href="#soporte"
                            className="hover:text-white transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToast("Módulo de soporte: disponible en el sprint 3");
                            }}
                        >
                            SOPORTE
                        </a>
                        <div className="flex items-center space-x-1 text-cyan-400 animate-pulse text-xs bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-800">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span>Demo Activa</span>
                        </div>
                    </nav>
                </div>

                { }
                <div className="flex items-center space-x-4">

                    {/* Lista de deseos quick info */}
                    <div
                        onClick={() => handleToast(`Lista de deseos: ${wishlistCount} artículos`)}
                        className="relative group hidden sm:flex items-center text-sm space-x-1 hover:text-white cursor-pointer select-none"
                    >
                        <Heart className={`w-5 h-5 transition-colors duration-200 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-500'}`} />
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 group-hover:bg-[#2a475e] transition-colors">
                            {wishlistCount}
                        </span>
                    </div>

                    {/* Botón del Carrito con animaciones */}
                    <button
                        onClick={onCartClick}
                        className="relative p-2 rounded-lg bg-[#2a475e]/80 hover:bg-[#2a475e] text-white flex items-center space-x-2 group border border-transparent hover:border-cyan-500/30 transition-all shadow-md active:scale-95"
                        aria-label="Carrito de compras"
                    >
                        <ShoppingCart className="w-5 h-5 text-cyan-400 group-hover:animate-bounce" />
                        <span className="font-bold text-xs bg-cyan-500 text-[#171a21] px-1.5 py-0.5 rounded-full">
                            {cartCount}
                        </span>
                    </button>

                    {/* Divisor vertical */}
                    <div className="h-6 w-[1px] bg-slate-700/60 hidden sm:block"></div>

                    {/* Perfil del Usuario Académico */}
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-[2px] cursor-pointer hover:shadow-cyan-500/30 hover:shadow-lg transition-all">
                            <div className="w-full h-full rounded-full bg-[#171a21] flex items-center justify-center">
                                <User className="w-4 h-4 text-cyan-400" />
                            </div>
                        </div>
                        <span className="hidden md:inline text-xs font-bold text-slate-300">Estudiante_Pro</span>
                    </div>

                </div>
            </div>
        </header>
    );
}