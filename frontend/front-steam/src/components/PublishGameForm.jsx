"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Gamepad,
    DollarSign,
    ImageIcon,
    Calendar,
    Tag,
    UploadCloud,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Info
} from "lucide-react";

/**
 * Componente PublishGameForm Premium
 * Formulario para creadores o desarrolladores que deseen publicar un videojuego en la plataforma.
 * Diseñado con estética de cristal esmerilado de alta fidelidad.
 */
export default function PublishGameForm() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        releaseDate: "",
        categoryIds: []
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsFetchingCategories(true);
                // Realizamos la petición GET con Axios habilitando CORS Credentials
                const response = await axios.get(
                    "http://localhost:8080/v1/categories/all",
                    {
                        withCredentials: true
                    }
                );

                // Axios parsea automáticamente a JSON y lo expone en la propiedad 'data'
                setCategories(response.data);
                console.log("Respuesta del servidor (Axios):", response.data);
            } catch (error) {
                console.error("Error al obtener categorías con Axios:", error);
                setFeedback({
                    type: "error",
                    message: "No se pudo conectar con el servidor para obtener las categorías."
                });
            } finally {
                setIsFetchingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (category) => {
        // Detecta automáticamente id_category, id_genre o id según la respuesta de tu backend
        const categoryId = category.id_category || category.id || category.id_genre || category.idCategory;

        if (categoryId === undefined) {
            console.warn("Advertencia: No se encontró una propiedad de ID válida en el objeto de categoría:", category);
            return;
        }

        const exists = formData.categoryIds.includes(categoryId);

        if (exists) {
            setFormData(prev => ({
                ...prev,
                categoryIds: prev.categoryIds.filter((id) => id !== categoryId)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                categoryIds: [...prev.categoryIds, categoryId]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.price || !formData.releaseDate) {
            setFeedback({
                type: "error",
                message: "Por favor, completa los campos obligatorios."
            });
            return;
        }

        setIsLoading(true);
        setFeedback({ type: "", message: "" });

        try {
            // Realizamos la petición POST con Axios adjuntando el payload y las cookies de sesión
            const response = await axios.post(
                "http://localhost:8080/v1/games/publish",
                {
                    ...formData,
                    price: Number(formData.price)
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            console.log("Respuesta del servidor (Axios):", response.data);

            setFeedback({
                type: "success",
                message: "¡Excelente! El videojuego se ha publicado exitosamente en Vapor."
            });

            // Limpieza de formulario tras inserción exitosa
            setFormData({
                name: "",
                description: "",
                price: "",
                imageUrl: "",
                releaseDate: "",
                categoryIds: []
            });

        } catch (error) {
            console.error("Error al publicar con Axios:", error);
            setFeedback({
                type: "error",
                message: "No se pudo conectar con el servidor local. Verifica que http://localhost:8080 esté encendido."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0e14] text-[#c7d5e0] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Luces decorativas de fondo */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#66c0f4]/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4facfe]/10 rounded-full blur-[130px] pointer-events-none" />

            {/* Tarjeta de cristal esmerilado */}
            <div className="w-full max-w-4xl bg-[#121824]/60 border border-white/[0.07] backdrop-blur-2xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-6 md:p-10 z-10 transition-all duration-300 hover:border-white/[0.12]">

                {/* Cabecera de la sección */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/[0.06] gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-[#1c2435]/80 p-3 rounded-xl border border-white/[0.05] shadow-inner">
                            <UploadCloud className="w-8 h-8 text-[#66c0f4]" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">Publicar un Videojuego</h2>
                            <p className="text-xs text-slate-400">Portal del Desarrollador (Developer Console)</p>
                        </div>
                    </div>
                    <span className="text-[10px] bg-slate-800 border border-slate-700/60 text-cyan-400 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider h-fit flex items-center gap-1.5 self-start md:self-center">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        Vapor Dev Center
                    </span>
                </div>

                {/* Notificaciones integradas (Sustituto de alert) */}
                {feedback.message && (
                    <div className={`p-4 rounded-xl mb-6 text-xs md:text-sm flex items-start space-x-3 backdrop-blur-md animate-fade-in ${feedback.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                        }`}>
                        {feedback.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                        )}
                        <div className="flex-1">
                            <span className="font-bold">{feedback.type === 'success' ? 'Éxito: ' : 'Atención: '}</span>
                            <span>{feedback.message}</span>
                        </div>
                    </div>
                )}

                {/* Formulario principal */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Campos de texto principales */}
                        <div className="lg:col-span-7 space-y-5">

                            {/* Campo: Nombre */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                                    Nombre del Videojuego <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ej. Cyberpunk Odyssey 2088"
                                        className="w-full bg-[#0a0d14]/70 border border-white/[0.08] hover:border-slate-500/50 focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-600 outline-none transition-all"
                                    />
                                    <Gamepad className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                </div>
                            </div>

                            {/* Campo: Descripción */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                                    Descripción / Sinopsis
                                </label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Escribe un resumen atractivo sobre la jugabilidad, mecánicas y trama para convencer a los jugadores de Vapor..."
                                    className="w-full bg-[#0a0d14]/70 border border-white/[0.08] hover:border-slate-500/50 focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Precio y Fecha */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Campo: Precio */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                                        Precio (USD) <span className="text-rose-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="price"
                                            min="0"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="0.00 (Escribe 0 si es Gratis)"
                                            className="w-full bg-[#0a0d14]/70 border border-white/[0.08] hover:border-slate-500/50 focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-600 outline-none transition-all"
                                        />
                                        <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                    </div>
                                </div>

                                {/* Campo: Fecha */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                                        Fecha de lanzamiento <span className="text-rose-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="releaseDate"
                                            required
                                            value={formData.releaseDate}
                                            onChange={handleChange}
                                            className="w-full bg-[#0a0d14]/70 border border-white/[0.08] hover:border-slate-500/50 focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-600 outline-none transition-all"
                                        />
                                        <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* URL de Imagen y previsualización */}
                        <div className="lg:col-span-5 space-y-5">

                            {/* Campo: URL */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                                    URL de Imagen de Portada
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/portada.jpg"
                                        className="w-full bg-[#0a0d14]/70 border border-white/[0.08] hover:border-slate-500/50 focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-600 outline-none transition-all"
                                    />
                                    <ImageIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                </div>
                            </div>

                            {/* Previsualización en tiempo real */}
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Previsualización de Tienda</span>
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0a0d14]/60 border border-white/[0.05] flex items-center justify-center group shadow-inner">
                                    {formData.imageUrl ? (
                                        <img
                                            src={formData.imageUrl}
                                            alt="Previsualización"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImageIcon className="w-10 h-10 text-slate-700 mx-auto mb-2 animate-pulse" />
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">No se ha cargado una imagen válida</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Sección de Categorías con Tags */}
                    <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                        <div className="flex items-center space-x-2 text-slate-400">
                            <Tag size={14} className="text-[#66c0f4]" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Asignar Categorías</h3>
                        </div>

                        {isFetchingCategories ? (
                            <div className="flex items-center space-x-2 py-4">
                                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                <span className="text-xs text-slate-500">Conectando con http://localhost:8080...</span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => {
                                    // Mapea el ID correcto para evitar que se pisen en undefined
                                    const categoryId = category.id_category || category.id || category.id_genre || category.idCategory;
                                    const isSelected = formData.categoryIds.includes(categoryId);

                                    return (
                                        <button
                                            key={categoryId || category.name}
                                            type="button"
                                            onClick={() => handleCategoryChange(category)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 border cursor-pointer select-none ${isSelected
                                                ? "bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-[#66c0f4] border-cyan-400/40 shadow-[0_0_15px_rgba(102,192,244,0.15)]"
                                                : "bg-[#0a0d14]/40 text-slate-400 border-white/[0.06] hover:bg-[#121824] hover:text-white hover:border-slate-600"
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Información del Backend */}
                    <div className="bg-[#1b2838]/30 p-4 rounded-xl border border-sky-950/20 text-xs text-slate-400 flex items-start space-x-3">
                        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-semibold text-slate-300">Conexión con Base de Datos:</p>
                            <p>Este formulario mantendrá una comunicación directa con tu backend. Al enviar, registrará el videojuego insertando los IDs de categorías correspondientes en las tablas relacionadas.</p>
                        </div>
                    </div>

                    {/* Botón de Enviar */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-4 bg-gradient-to-r from-[#66c0f4] to-[#417a9b] disabled:from-slate-800 disabled:to-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(102,192,244,0.15)] hover:shadow-[0_0_30px_rgba(102,192,244,0.35)] active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    <span>Publicando título...</span>
                                </>
                            ) : (
                                <span>Publicar Videojuego</span>
                            )}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}