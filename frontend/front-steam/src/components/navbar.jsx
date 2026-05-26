"use client";

import React from 'react';
import {
    Gamepad,
    Heart,
    ShoppingCart,
    User,
    LogIn
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar({
                                   cartCount = 0,
                                   wishlistCount = 0,
                                   onCartClick,
                                   onToast
                               }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    const handleToast = (message) => {
        if (onToast) {
            onToast(message);
        } else {
            console.log("Toast simulado:", message);
        }
    };

    if (loading) return <>Cargando...</>;

    return (
        <header className="sticky top-0 z-40 bg-[#171a21] border-b border-sky-950/40 shadow-xl backdrop-blur-md w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                <div className="flex items-center space-x-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
                        <div className="bg-[#2a475e] p-2 rounded-lg group-hover:bg-[#66c0f4] transition-colors duration-300">
                            <Gamepad className="w-6 h-6 text-cyan-400 group-hover:text-slate-900 transition-colors duration-300" />
                        </div>
                        <div>
                            <span className="font-extrabold tracking-wider text-xl text-white uppercase group-hover:text-cyan-400 transition-colors">STEAM</span>
                            <span className="text-xs block text-[#66c0f4] -mt-1 font-semibold tracking-widest">FACULTAD</span>
                        </div>
                    </Link>

                    {/* Enlaces de navegación tipo Steam */}
                    <nav className="hidden lg:flex space-x-6 text-sm font-semibold tracking-wide text-[#b8b6b4]">
                        <Link href="/tienda" className="text-white border-b-2 border-[#66c0f4] pb-1">TIENDA</Link>
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
                        {user?.role === 'ROLE_DEVELOPER' && (
                            <Link href="/publish" className="hover:text-white transition-colors">
                                PUBLICAR
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Lista de deseos */}
                    <div
                        onClick={() => handleToast(`Lista de deseos: ${wishlistCount} artículos`)}
                        className="relative group hidden sm:flex items-center text-sm space-x-1 hover:text-white cursor-pointer select-none"
                    >
                        <Heart className={`w-5 h-5 transition-colors duration-200 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-500'}`} />
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 group-hover:bg-[#2a475e] transition-colors">
                            {wishlistCount}
                        </span>
                    </div>

                    {/* Botón del Carrito */}

                    <Link
                        href="/shopping"
                        className="relative p-2 rounded-lg bg-[#2a475e]/80 hover:bg-[#2a475e] text-white flex items-center space-x-2 group border border-transparent hover:border-cyan-500/30 transition-all shadow-md active:scale-95 cursor-pointer"
                        aria-label="Ver mi carrito de compras"
                    >
                        <ShoppingCart className="w-5 h-5 text-cyan-400 group-hover:animate-bounce" />
                        <span className="font-bold text-xs bg-cyan-500 text-[#171a21] px-1.5 py-0.5 rounded-full">
                            {cartCount}
                        </span>
                    </Link>

                    <div className="h-6 w-[1px] bg-slate-700/60 hidden sm:block"></div>

                    {/* 👈 Sección Dinámica del Perfil Modificada */}
                    {user ? (
                        <Link
                            href="/user/profile"
                            className="flex items-center space-x-2 group cursor-pointer select-none"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-[2px] group-hover:shadow-cyan-500/30 group-hover:shadow-lg transition-all">
                                <div className="w-full h-full rounded-full bg-[#171a21] flex items-center justify-center">
                                    <User className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <span className="hidden md:inline text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                {user.username}
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <div className="w-9 h-9 rounded-full bg-slate-800 p-[2px]">
                                <div className="w-full h-full rounded-full bg-[#171a21] flex items-center justify-center">
                                    <User className="w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                            <Link href="/login" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                                <LogIn className="w-3 h-3" /> Iniciar Sesión
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}