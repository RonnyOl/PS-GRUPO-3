"use client";

import React, { useState } from 'react';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    CheckCircle,
    ArrowRight,
    ShieldAlert,
    Gamepad
} from 'lucide-react';
import axios from 'axios';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!isLogin && !formData.name.trim()) {
            tempErrors.name = "El nombre de usuario es requerido.";
        }

        if (!formData.email) {
            tempErrors.email = "El correo electrónico es requerido.";
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "El formato de correo no es válido.";
        }

        if (!formData.password) {
            tempErrors.password = "La contraseña es requerida.";
        } else if (formData.password.length < 6) {
            tempErrors.password = "Debe tener al menos 6 caracteres.";
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = "Las contraseñas no coinciden.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ type: '', message: '' });

        if (!validateForm()) return;

        setIsLoading(true);

        try {

            const endpoint = isLogin ? 'http://localhost:8080/v1/auth/login' : 'http://localhost:8080/v1/auth/register';

            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };

            const response = await axios.post(endpoint, payload, { withCredentials: true });

            const data = response.data;
            setIsLoading(false);

            if (response.status === 200) {
                if (isLogin) {
                    setFeedback({ type: 'success', message: '¡Sesión iniciada! Redirigiendo...' });
                    setTimeout(() => {
                        window.location.replace("/");
                    }, 1800);
                } else {
                    setFeedback({ type: 'success', message: '¡Usuario registrado! Redirigiendo al login...' });
                    setTimeout(() => {
                        setIsLogin(true);
                        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                        setFeedback({ type: '', message: '' });
                    }, 1800);
                }
            } else {
                setFeedback({ type: 'error', message: data.message || 'Ocurrió un error en el servidorphite.' });
            }
        } catch (err) {
            setIsLoading(false);
            setFeedback({ type: 'error', message: `Ocurrió un error: ${err.response.data.message}` });
            console.error(err);
        }

    };

    return (
        <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 md:p-8 relative overflow-hidden select-none">

            {/* Orbes traslúcidos decorativos en el fondo para profundidad visual */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#66c0f4]/10 rounded-full blur-[130px] animate-pulse" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#4facfe]/10 rounded-full blur-[150px]" />
            <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-purple-600/[0.04] rounded-full blur-[100px]" />

            {/* Tarjeta de Login Principal con Glassmorphism */}
            <div className="w-full max-w-md bg-[#121824]/60 border border-white/[0.07] backdrop-blur-2xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-8 md:p-10 z-10 transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_25px_60px_-15px_rgba(102,192,244,0.05)]">

                {/* Logo / Header de Marca */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[#1c2435]/80 p-3 rounded-2xl border border-white/[0.05] shadow-inner mb-3">
                        <Gamepad className="w-8 h-8 text-[#66c0f4]" />
                    </div>
                    <span className="font-black tracking-[0.25em] text-2xl text-white uppercase block">VAPOR</span>
                    <span className="text-[10px] block text-[#66c0f4] font-bold tracking-widest uppercase mt-0.5">Tienda Digital</span>
                </div>

                {/* Mensaje Informativo Flotante o Alerta de Éxito/Error */}
                {feedback.message ? (
                    <div className={`p-4 rounded-xl mb-6 text-xs flex items-start space-x-3 backdrop-blur-md animate-fade-in ${feedback.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                        }`}>
                        {feedback.type === 'success' ? (
                            <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                        ) : (
                            <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                        )}
                        <span>{feedback.message}</span>
                    </div>
                ) : null}

                {/* Formulario HTML */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* CAMPO: name (Solo se muestra en Registro) */}
                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Nombre de usuario</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej. PlayerOne"
                                    className={`w-full bg-[#0a0d14]/70 border ${errors.name ? 'border-rose-500/50' : 'border-white/[0.08] hover:border-slate-500/50'} focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-600 outline-none transition-all`}
                                />
                                <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                            </div>
                            {errors.name && <span className="text-[10px] text-rose-400 block pl-1">{errors.name}</span>}
                        </div>
                    )}

                    {/* CAMPO: email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Correo electrónico</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                className={`w-full bg-[#0a0d14]/70 border ${errors.email ? 'border-rose-500/50' : 'border-white/[0.08] hover:border-slate-500/50'} focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-600 outline-none transition-all`}
                            />
                            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        </div>
                        {errors.email && <span className="text-[10px] text-rose-400 block pl-1">{errors.email}</span>}
                    </div>

                    {/* CAMPO: password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full bg-[#0a0d14]/70 border ${errors.password ? 'border-rose-500/50' : 'border-white/[0.08] hover:border-slate-500/50'} focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-600 outline-none transition-all`}
                            />
                            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <span className="text-[10px] text-rose-400 block pl-1">{errors.password}</span>}
                    </div>

                    {/* CAMPO: confirmPassword (Solo se muestra en Registro) */}
                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Confirmar Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-[#0a0d14]/70 border ${errors.confirmPassword ? 'border-rose-500/50' : 'border-white/[0.08] hover:border-slate-500/50'} focus:border-[#66c0f4] focus:ring-4 focus:ring-[#66c0f4]/15 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-600 outline-none transition-all`}
                                />
                                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                            </div>
                            {errors.confirmPassword && <span className="text-[10px] text-rose-400 block pl-1">{errors.confirmPassword}</span>}
                        </div>
                    )}

                    {/* Botón de Enviar con Hover Glow */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#66c0f4] to-[#417a9b] disabled:from-slate-800 disabled:to-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(102,192,244,0.15)] hover:shadow-[0_0_30px_rgba(102,192,244,0.35)] active:scale-[0.98] flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Sección inferior de Switch entre Login/Registro */}
                <div className="pt-6 border-t border-white/[0.05] mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">
                        {isLogin ? "¿Eres nuevo por aquí?" : "¿Ya eres miembro?"}
                    </span>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setFeedback({ type: '', message: '' });
                            setErrors({});
                        }}
                        className="text-[#66c0f4] hover:text-[#88d5ff] font-extrabold uppercase tracking-widest transition-colors"
                    >
                        {isLogin ? "Registrarse" : "Inicia Sesión"}
                    </button>
                </div>

            </div>
        </div>
    );
}