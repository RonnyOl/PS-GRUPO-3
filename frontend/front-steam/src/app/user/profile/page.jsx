"use client";

import React, { useState, Suspense } from "react"; // 👈 1. Importamos Suspense
import { useAuth } from "../../../context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Search, Eye } from "lucide-react";
import UserProfile from "../../../components/UserProfile";

// 👈 2. Renombramos tu componente principal a "ProfileContent"
function ProfileContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams(); // El hook conflictivo ahora corre seguro dentro de Suspense
    const router = useRouter();

    const searchedUser = searchParams.get("search");
    const [searchInputValue, setSearchInputValue] = useState("");
    const targetEmail = searchedUser || user?.email || "";

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchInputValue.trim()) return;
        router.push(`/profile?search=${encodeURIComponent(searchInputValue.trim())}`);
        setSearchInputValue("");
    };

    return (
        <main className="min-h-screen bg-[#1b2838] py-8 md:py-12 select-none">
            <div className="max-w-5xl mx-auto px-4 space-y-6">

                {/* BARRA SUPERIOR: Buscador de perfiles */}
                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#171a21]/60 border border-white/[0.04] p-4 rounded-xl backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <User className="w-4 h-4 text-cyan-400" />
                        <span>¿Buscas a un amigo de la facultad?</span>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full sm:max-w-xs">
                        <input
                            type="email"
                            placeholder="Buscar por correo electrónico..."
                            value={searchInputValue}
                            onChange={(e) => setSearchInputValue(e.target.value)}
                            className="w-full bg-[#0b0e14] border border-white/[0.08] focus:border-cyan-500 rounded-lg px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                        <button
                            type="submit"
                            className="absolute right-1 top-1 px-2 py-1 bg-[#2a475e] hover:bg-[#345975] text-white text-[10px] font-bold rounded uppercase transition-colors"
                        >
                            Buscar
                        </button>
                    </form>
                </div>

                {/* CABECERA DINÁMICA */}
                <div className="mb-6 transition-all duration-300">
                    {searchedUser ? (
                        <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 flex items-center space-x-3 text-cyan-400 animate-fade-in">
                            <Eye className="w-5 h-5 shrink-0 animate-pulse" />
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Modo de Inspección</h2>
                                <p className="text-base font-black text-white">
                                    Estás viendo la biblioteca de: <span className="text-cyan-400 font-mono">{searchedUser}</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                                Perfil de Usuario
                            </h1>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">
                                Gestiona tus credenciales, revisa tu saldo en cuenta e inspecciona tu catálogo personal de Vapor.
                            </p>
                        </div>
                    )}
                </div>

                <UserProfile initialEmail={targetEmail} />

            </div>
        </main>
    );
}

// 👈 3. Exportamos por defecto una función envuelta en un Suspense Boundary
export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#1b2838] flex items-center justify-center text-white text-xs tracking-widest uppercase">
                Cargando interfaz de usuario...
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}