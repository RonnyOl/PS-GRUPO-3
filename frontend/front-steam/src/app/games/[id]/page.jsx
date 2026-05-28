"use client";

import React, { useEffect, useState, use } from "react";
import axios from "axios";
import {
    Flame, Loader2, AlertCircle, Calendar, Tag, User, Star,
    DownloadCloud, Heart, MessageSquare, ArrowLeft, ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {useAuth} from "@/context/AuthContext";

export default function GameDetailPage({ params }) {
    // Desempaquetamos el ID dinámico de la URL usando use() de Next.js
    const { id: gameId } = use(params);
    const { addToCart, cart, setIsOpen } = useCart();
    const { user } = useAuth();

    // Estados de la API
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados del formulario de reviews
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewMessage, setReviewMessage] = useState({ text: "", type: "" });

    // Petición de datos del juego
    const fetchGameDetail = () => {
        axios
            .get(`http://localhost:8080/v1/games/${gameId}`, { withCredentials: true })
            .then((response) => {
                setGame(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err.message);
                setError("No se pudo cargar el detalle del videojuego.");
                setLoading(false);
            });
    };

    useEffect(() => {
        if (gameId) fetchGameDetail();
    }, [gameId]);

    // Handler para enviar la Review
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewMessage({ text: "", type: "" });

        const reviewData = {
            gameId: parseInt(gameId),
            score: parseInt(score),
            comment: comment
        };

        try {
            const response = await axios.post(
                `http://localhost:8080/api/reviews/user/${user.email}`,
                reviewData,
                { withCredentials: true }
            );
            setReviewMessage({ text: response.data || "¡Review publicada!", type: "success" });
            setComment("");
            fetchGameDetail(); // 🔄 Recargamos el detalle para ver la nueva review en tiempo real
        } catch (err) {
            const backendError = err.response?.data || "Error al publicar la reseña.";
            setReviewMessage({ text: backendError, type: "error" });
        } finally {
            setReviewLoading(false);
        }
    };

    const handleAddAndOpen = () => {
        if (!game) return;
        const cartItem = {
            id_game: game.idGame || game.id,
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

    // Verificamos si ya está en el carrito
    const isInCart = game && cart.some(item => (item.id_game === (game.idGame || game.id)));

    // ==========================================
    // RENDERIZADO DE ESTADOS DE CONTROL
    // ==========================================
    if (loading) {
        return (
            <div className="min-h-screen bg-[#1b2838] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#66c0f4] animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse text-sm">Cargando componentes del juego...</p>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen bg-[#1b2838] flex items-center justify-center p-4">
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex items-center space-x-4 max-w-lg shadow-lg">
                    <AlertCircle className="w-8 h-8 text-rose-400 shrink-0" />
                    <div>
                        <h4 className="text-white font-bold text-sm">Error de Carga</h4>
                        <p className="text-rose-300 text-xs mt-0.5">{error || "No se encontró el juego."}</p>
                        <Link href="/" className="inline-block mt-3 text-xs font-bold text-cyan-400 uppercase tracking-wider hover:underline">
                            ← Volver a la Tienda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // VISTA PRINCIPAL (DETALLE COMPLETO)
    // ==========================================
    return (
        <main className="min-h-screen bg-[#1b2838] text-[#c7d5e0] py-8 md:py-12">
            <div className="max-w-4xl mx-auto px-4 space-y-8">

                {/* Botón de navegación atrás */}
                <Link href="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider group transition-colors">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Volver al catálogo</span>
                </Link>

                {/* Cabecera / Ficha Técnica Principal */}
                <div className="bg-[#171a21] rounded-2xl border border-white/5 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-3">

                    {/* Portada en el Detalle */}
                    <div className="md:col-span-1 bg-slate-900 aspect-video md:aspect-auto relative min-h-[200px]">
                        {game.imageUrl || game.image_url ? (
                            <img
                                src={game.imageUrl || game.image_url}
                                alt={game.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                                <Flame className="w-12 h-12 opacity-10 mb-2" />
                                <span className="text-[10px] tracking-widest font-mono">NO ARTWORK</span>
                            </div>
                        )}
                    </div>

                    {/* Información y Compra */}
                    <div className="p-6 md:col-span-2 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center space-x-2 text-cyan-400">
                                <Tag className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">{game.genre || "Videojuego"}</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mt-1">
                                {game.name}
                            </h1>
                            <p className="text-xs text-slate-400 mt-2">
                                Desarrollado por: <span className="text-cyan-400 font-semibold">{game.developerName || "Indie Studio"}</span>
                            </p>
                        </div>

                        {/* Caja Comercial Interna */}
                        <div className="bg-[#1b2838]/70 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Precio Final</span>
                                <span className={`text-xl font-black ${parseFloat(game.price || 0) === 0 ? 'text-emerald-400' : 'text-white'}`}>
                                    {formatPrice(game.price)}
                                </span>
                            </div>
                            <button
                                onClick={handleAddAndOpen}
                                disabled={isInCart}
                                className={`flex items-center space-x-2 px-5 py-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                                    isInCart
                                        ? 'bg-emerald-950/40 text-emerald-500 border border-emerald-900/40 cursor-not-allowed'
                                        : 'bg-[#66c0f4] hover:bg-cyan-400 text-[#171a21] shadow-lg shadow-cyan-500/10'
                                }`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>{isInCart ? "En el Carrito" : "Comprar Ahora"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid de Contenido Base vs Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Descripción General */}
                    <div className="md:col-span-2 bg-[#171a21] border border-white/5 p-6 rounded-xl space-y-3">
                        <h3 className="text-white font-black text-xs uppercase tracking-wider text-slate-400">Acerca de este juego</h3>
                        <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
                            {game.description || "No se proporcionó una descripción para este título."}
                        </p>
                    </div>

                    {/* Contadores Comunitarios */}
                    <div className="space-y-4">
                        {/* Card Instalados */}
                        <div className="bg-[#171a21] border border-white/5 p-4 rounded-xl flex items-center space-x-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/10">
                                <DownloadCloud className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-black text-white">{game.installedCount || 0}</div>
                                <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Jugadores lo instalaron</div>
                            </div>
                        </div>

                        {/* Card Favoritos */}
                        <div className="bg-[#171a21] border border-white/5 p-4 rounded-xl flex items-center space-x-4">
                            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/10">
                                <Heart className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-black text-white">{game.favoriteCount || 0}</div>
                                <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">En favoritos de usuarios</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==========================================
                    SECCIÓN: FORMULARIO DE REVIEWS (ReviewForm)
                   ========================================== */}
                <div className="bg-[#171a21] border border-white/5 rounded-xl p-6 space-y-4">
                    <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-white font-black text-sm uppercase tracking-wider">Dejar una Reseña Pública</h3>
                    </div>

                    {/* Alertas de Feedback de la Review */}
                    {reviewMessage.text && (
                        <div className={`p-4 rounded-lg text-xs font-bold border ${
                            reviewMessage.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        }`}>
                            {reviewMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                            <label className="text-xs font-bold uppercase text-slate-400">Puntuación del Juego:</label>
                            <div className="sm:col-span-2">
                                <select
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    className="bg-[#1b2838] border border-white/5 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-cyan-500/50 w-full cursor-pointer"
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                                    <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
                                    <option value="3">⭐⭐⭐ Regular</option>
                                    <option value="2">⭐⭐ Malo</option>
                                    <option value="1">⭐ Injugable</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 block">Tu Análisis Crítico:</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Escribí qué te pareció el juego, jugabilidad, gráficos..."
                                rows="4"
                                required
                                className="w-full bg-[#1b2838] border border-white/5 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none leading-relaxed"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={reviewLoading}
                                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase rounded-lg tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {reviewLoading ? "Publicando en Vapor..." : "Enviar Reseña"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ==========================================
                    SECCIÓN: LISTADO DE REVIEWS
                   ========================================== */}
                <div className="space-y-4">
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">
                        Reseñas de la Comunidad ({game.reviews?.length || 0})
                    </h3>

                    {game.reviews && game.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {game.reviews.map((review, idx) => (
                                <div key={idx} className="bg-[#171a21] border border-white/5 rounded-xl p-5 space-y-3 shadow-lg border-l-2 border-l-cyan-500/40">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-[#2a475e] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                                {review.userName?.charAt(0) || "U"}
                                            </div>
                                            <span className="text-xs font-bold text-white">{review.userName}</span>
                                        </div>
                                        <div className="flex space-x-0.5 text-amber-400 text-xs">
                                            {"★".repeat(review.score)}{"☆".repeat(5 - review.score)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed font-light italic">
                                        "{review.comment}"
                                    </p>
                                    <div className="text-[10px] text-slate-500">
                                        Publicado el {new Date(review.reviewDate).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#171a21]/50 border border-white/5 rounded-xl p-8 text-center text-slate-400 text-xs">
                            No hay análisis disponibles para este juego todavía.
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}