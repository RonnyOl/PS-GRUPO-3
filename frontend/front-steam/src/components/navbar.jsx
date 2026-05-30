/* eslint-disable @next/next/no-html-link-for-pages */
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
    onToast
}) {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    // No renderizar en pantallas de autenticación
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    const handleToast = (message) => {
        if (onToast) {
            onToast(message);
        } else {
            console.log("Notificación:", message);
        }
    };

    if (loading) return null;

    return (
        <header className="sticky top-0 z-50 bg-[#171a21]/95 backdrop-blur-md border-b border-sky-500/10 shadow-2xl w-full transition-all">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                {/* SECCIÓN IZQUIERDA: LOGO Y NAVEGACIÓN */}
                <div className="flex items-center space-x-10">
                    {/* Logo Oficial STEAM */}
                    <Link href="/" className="flex items-center space-x-3 cursor-pointer group select-none">
                        <div className="bg-[#2a475e]/40 p-2 rounded-xl group-hover:bg-[#66c0f4] transition-all duration-300 border border-white/5 group-hover:border-transparent shadow-inner">
                            <Gamepad className="w-6 h-6 text-cyan-400 group-hover:text-[#171a21] transition-colors duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black tracking-widest text-2xl text-white uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text">
                                <a href="/">STEAM</a>
                            </span>
                        </div>
                    </Link>

                    {/* Enlaces de Navegación del Ecosistema */}
                    <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold tracking-widest text-[#b8b6b4]">
                        <Link
                            href="/shopping"
                            className={`transition-colors uppercase pb-1 border-b-2 ${pathname === '/tienda' || pathname === '/'
                                ? 'text-white border-cyan-400'
                                : 'border-transparent hover:text-white hover:border-slate-500'
                                }`}
                        >
                            TIENDA
                        </Link>

                        <Link
                            href={user ? '/user/profile' : '/login'}
                            className={`transition-colors uppercase pb-1 border-b-2 ${pathname === '/user/profile'
                                ? 'text-white border-cyan-400'
                                : 'border-transparent hover:text-white hover:border-slate-500'
                                }`}
                        >
                            Libreria
                        </Link>



                        {user?.role === 'ROLE_DEVELOPER' && (
                            <Link
                                href="/publish"
                                className={`transition-colors uppercase pb-1 border-b-2 ${pathname === '/publish'
                                    ? 'text-white border-cyan-400'
                                    : 'border-transparent hover:text-white hover:border-slate-500'
                                    }`}
                            >
                                PUBLICAR
                            </Link>
                        )}
                    </nav>
                </div>

                {/* SECCIÓN DERECHA: ACCIONES / PERFIL */}
                <div className="flex items-center space-x-4">

                    <div className="h-5 w-[1px] bg-slate-800 hidden sm:block"></div>

                    {/* Autenticación / Perfil Dinámico */}
                    {user ? (
                        <Link
                            href="/user/profile"
                            className="flex items-center space-x-2.5 group cursor-pointer select-none bg-slate-800/20 hover:bg-slate-800/50 pl-2 pr-3 py-1 rounded-xl border border-white/5 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-[1.5px] group-hover:shadow-cyan-500/20 group-hover:shadow-lg transition-all">
                                <div className="w-full h-full rounded-full bg-[#171a21] flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <span className="hidden md:inline text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                {user.username}
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/login"
                                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/5 hover:bg-cyan-500/10 px-3 py-2 rounded-xl border border-cyan-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Iniciar Sesión</span>
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}