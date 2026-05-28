"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageSquare, Star, ArrowLeft, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { reviewService } from "@/services/reviewService";
import { useAuth } from "@/context/AuthContext"; // 👈 1. Importamos tu hook de autenticación

export default function NewReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 🔐 2. Consumimos el estado global de autenticación que vos creaste
    const { user, loading: authLoading } = useAuth();

    const gameId = searchParams.get("gameId");
    const gameName = searchParams.get("name") || "el videojuego seleccionado";

    // Estados del Formulario y UI
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ message: "", type: null });

    // 🛡️ 3. Guarda acá: Si el contexto está validando la sesión, mostramos un spinner de bloqueo
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#1b2838] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#66c0f4] animate-spin" />
                <p className="text-slate-400 font-medium text-sm">Verificando credenciales en Vapor...</p>
            </div>
        );
    }

    // 🛡️ 4. Control de Seguridad: Si terminó de cargar pero 'user' es null, lo pateamos al login
    if (!user) {
        return (
            <div className="min-h-screen bg-[#1b2838] flex items-center justify-center p-4">
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex flex-col items-center space-y-4 max-w-sm shadow-lg text-center">
                    <AlertTriangle className="w-10 h-10 text-rose-400" />
                    <div>
                        <h4 className="text-white font-bold text-sm">Acceso Denegado</h4>
                        <p className="text-rose-300 text-xs mt-1">Necesitás iniciar sesión en Vapor para poder dejar una reseña.</p>
                    </div>
                    <Link href="/login" className="px-4 py-2 bg-[#66c0f4] hover:bg-cyan-400 text-[#171a21] text-xs font-bold uppercase rounded-lg w-full transition-colors">
                        Ir al Login
                    </Link>
                </div>
            </div>
        );
    }

    // 🔑 5. Extraemos el ID real del usuario (revisá si tu backend lo devuelve como id, idUser, o id_user)
    const currentUserId = user.id || user.idUser || user.id_user;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gameId) {
            setStatus({ message: "Falta el identificador del videojuego destino.", type: "error" });
            return;
        }

        setIsSubmitting(true);
        setStatus({ message: "", type: null });

        const payload = {
            gameId: parseInt(gameId, 10),
            score: parseInt(score, 10),
            comment: comment.trim()
        };

        try {
            const serverResponse = await reviewService.createReview(currentUserId, payload);
            setStatus({ message: serverResponse, type: "success" });
            setComment("");

            setTimeout(() => {
                router.push(`/games/${gameId}`);
            }, 2500);

        } catch (error) {
            setStatus({ message: error.message, type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#1b2838] text-[#c7d5e0] flex items-center justify-center py-12 px-4">
            {/* ... Todo tu formulario Tailwind se mantiene exactamente igual ... */}
            <div className="max-w-xl w-full space-y-6 bg-[#171a21] border border-white/5 p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center space-x-2.5">
                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                        <div>
                            <h1 className="text-lg font-black text-white uppercase tracking-tight">Redactar Reseña</h1>
                            <p className="text-xs text-slate-400 mt-0.5">Analizando como: <span className="text-emerald-400 font-semibold">{user.name || user.username}</span></p>
                        </div>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* ... campos de score y textarea ... */}
                    <div className="space-y-2">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Escribí tu reseña acá..."
                            rows="6"
                            className="w-full bg-[#1b2838] border border-white/5 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none"
                            required
                        />
                    </div>
                    <div className="pt-2 flex items-center justify-end space-x-3">
                        <button
                            type="submit"
                            disabled={isSubmitting || comment.length < 10}
                            className="px-6 py-2.5 bg-[#66c0f4] hover:bg-cyan-400 text-[#171a21] text-xs font-black uppercase rounded-lg tracking-wider"
                        >
                            <span>{isSubmitting ? "Impactando Back..." : "Publicar Análisis"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}