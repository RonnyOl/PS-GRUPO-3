"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingCart, ShoppingBag, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/hooks/usePurchase";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    setIsOpen,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    isMounted,
  } = useCart();

  const { user } = useAuth();

  // 1. Traemos las propiedades del hook original
  const { loading: purchaseLoading, error: purchaseError, executePurchase } = usePurchase();

  // 2. Creamos el estado local para manejar la visibilidad del error de forma reactiva
  const [localError, setLocalError] = useState(null);
  const [testEmail, setTestEmail] = useState("");
  const [receipt, setReceipt] = useState(null);

  // 3. EFECTO A: Sincroniza el error del hook hacia nuestro estado local cuando ocurre un fallo
  useEffect(() => {
    if (purchaseError) {
      setLocalError(purchaseError);
    }
  }, [purchaseError]);

  // 4. EFECTO B: Limpia el cartel de error inmediatamente si el usuario altera el carrito (borra o cambia cantidades)
  useEffect(() => {
    setLocalError(null);
  }, [cart]);

  const handleCheckout = async () => {
    const email = user?.email || testEmail;
    if (!email) {
      alert("Por favor, iniciá sesión o ingresá tu correo electrónico para comprar.");
      return;
    }

    // Al reintentar, limpiamos el error previo por las dudas
    setLocalError(null);

    const purchaseResult = await executePurchase(email, cart, cartTotal);
    if (purchaseResult) {
      setReceipt(purchaseResult);
    }
  };

  const handleCloseReceipt = () => {
    clearCart();
    setReceipt(null);
    setIsOpen(false);
  };

  const drawerRef = useRef(null);

  // Manejo de la tecla Esc para cerrar
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        if (receipt) {
          handleCloseReceipt();
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen, receipt]);

  // Manejo de foco cuando se abre el drawer
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (receipt) {
      handleCloseReceipt();
    } else {
      setIsOpen(false);
    }
  };

  if (!isMounted) return null;

  return (
      <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${
              isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
      >
        {/* Backdrop */}
        <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleBackdropClick}
        />

        {/* Panel del Drawer */}
        <div
            ref={drawerRef}
            className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#171a21] border-l border-[#2a475e]/40 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* INTERFAZ 1: VAPOR DIGITAL RECEIPT (Si la compra fue exitosa) */}
          {receipt ? (
              <div className="h-full flex flex-col justify-between bg-[#141921]">
                <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute right-4 top-4 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm animate-pulse">
                    CONFIRMADO
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-300 shrink-0" />
                    <div>
                      <h3 className="font-black text-xl uppercase tracking-wider text-emerald-50">
                        Vapor Receipt
                      </h3>
                      <p className="text-[10px] text-emerald-200/80 font-mono mt-0.5 select-all">
                        ID: {receipt.idCompra}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-sm text-slate-300">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Fecha de Emisión</span>
                    <span className="font-medium text-white text-xs">
                  {receipt.buyDate ? new Date(receipt.buyDate).toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short"
                  }) : new Date().toLocaleString("es-AR")}
                </span>
                  </div>

                  <div className="space-y-3">
                <span className="text-slate-400 text-xs uppercase tracking-wider font-bold block mb-1">
                  Artículos Adquiridos
                </span>
                    <div className="bg-[#1b2838]/60 border border-white/5 rounded-lg p-3 divide-y divide-white/5">
                      {receipt.games?.map((gameName, index) => (
                          <div key={index} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2">
                            <span className="text-cyan-400 font-mono text-xs mt-0.5">»</span>
                            <p className="text-white font-medium text-xs leading-relaxed">{gameName}</p>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#1b2838]/30 border border-[#2a475e]/20 rounded-lg p-4 space-y-2.5 font-mono">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>MÉTODO DE PAGO:</span>
                      <span className="text-slate-300">Saldo de Cuenta Vapor</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>TOTAL DEBITADO:</span>
                      <span className="text-white font-bold">u$s {parseFloat(receipt.price || 0).toFixed(2)}</span>
                    </div>
                    <div className="h-[1px] bg-white/5 my-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400 font-bold">SALDO RESTANTE:</span>
                      <span className="text-emerald-400 font-black">
                    u$s {parseFloat(receipt.remainingBalance || 0).toFixed(2)}
                  </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center italic leading-normal px-4">
                    Los títulos han sido añadidos permanentemente a tu biblioteca de Vapor. ¡Que disfrutes tus juegos!
                  </p>
                </div>

                <div className="p-6 border-t border-white/5 bg-[#1b2838]/40">
                  <button
                      onClick={handleCloseReceipt}
                      className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-widest rounded shadow-md transition-all active:scale-[0.98] cursor-pointer text-center block"
                  >
                    Entendido / Aceptar
                  </button>
                </div>
              </div>
          ) : (

              /* INTERFAZ 2: CARRITO TRADICIONAL */
              <>
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#1b2838]">
                  <div className="flex items-center space-x-2.5">
                    <ShoppingCart className="w-5 h-5 text-cyan-400" />
                    <h3 id="cart-drawer-title" className="font-bold text-lg text-white uppercase tracking-wider">
                      Tu Carrito
                    </h3>
                    <span className="text-xs bg-[#2a475e] text-cyan-400 px-2 py-0.5 rounded-full font-bold">
                  {cartCount} {cartCount === 1 ? "ítem" : "ítems"}
                </span>
                  </div>
                  <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      aria-label="Cerrar carrito"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                  {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                        <div className="p-4 bg-[#1b2838] rounded-full text-slate-500">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                        <div>
                          <p className="text-white font-bold">Tu carrito está vacío</p>
                          <p className="text-slate-400 text-xs mt-1">¡Explorá la tienda y agregá tus juegos favoritos!</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-5 py-2 bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] text-white font-bold text-xs rounded transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                        >
                          Volver a la tienda
                        </button>
                      </div>
                  ) : (
                      cart.map((item) => {
                        const gameId = item.id_game || item.game_id;
                        const isFree = parseFloat(item.price || 0) === 0;

                        return (
                            <div
                                key={gameId}
                                className="bg-[#1b2838]/60 border border-white/5 rounded-lg p-3 flex gap-3 items-center group hover:border-[#2a475e]/60 transition-all duration-200"
                            >
                              <div className="w-20 h-12 shrink-0 rounded overflow-hidden bg-slate-900 relative">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                      <span className="text-[10px] text-slate-500 font-bold uppercase">GAME</span>
                                    </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm truncate" title={item.name}>
                                  {item.name}
                                </h4>
                                <p className="text-cyan-400 text-xs font-semibold mt-0.5">
                                  {isFree ? "Gratis" : `u$s ${parseFloat(item.price).toFixed(2)}`}
                                </p>
                              </div>

                              <div className="flex flex-col items-end justify-between self-stretch gap-1.5">
                                <button
                                    onClick={() => removeFromCart(gameId)}
                                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors"
                                    title="Eliminar del carrito"
                                    aria-label={`Eliminar ${item.name} del carrito`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="flex items-center bg-[#171a21] border border-[#2a475e]/40 rounded overflow-hidden">
                                  <button
                                      onClick={() => decrementQuantity(gameId)}
                                      className="p-1 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                      aria-label="Restar uno"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-bold text-white min-w-6 text-center select-none">
                            {item.quantity}
                          </span>
                                  <button
                                      onClick={() => incrementQuantity(gameId)}
                                      className="p-1 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                      aria-label="Sumar uno"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                        );
                      })
                  )}
                </div>

                {/* Resumen del Carrito y Acciones */}
                {cart.length > 0 && (
                    <div className="p-5 border-t border-white/5 bg-[#1b2838]/80 space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span>Subtotal</span>
                          <span>u$s {cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span>Impuestos / Tasas de Vapor</span>
                          <span className="text-emerald-400 uppercase font-semibold text-[10px]">Sin Cargo</span>
                        </div>
                        <div className="h-[1px] bg-white/5 my-2" />
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-sm uppercase tracking-wider">Total Estimado</span>
                          <span className="text-xl font-black text-white tracking-wide">
                      u$s {cartTotal.toFixed(2)}
                    </span>
                        </div>
                      </div>

                      {!user && (
                          <div className="space-y-1 bg-[#171a21]/50 border border-white/5 rounded-lg p-2.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block pl-0.5">
                              Correo Electrónico (Para Compra sin Sesión)
                            </label>
                            <input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="w-full bg-[#1b2838] border border-[#2a475e] text-xs text-white placeholder-slate-600 rounded px-2.5 py-1.5 outline-none focus:border-[#66c0f4] transition-all"
                            />
                          </div>
                      )}

                      {/* 👇 MODIFICADO: Ahora mapea el localError dinámico en lugar de purchaseError */}
                      {localError && (
                          <div className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-center font-semibold leading-relaxed">
                            {localError}
                          </div>
                      )}

                      <div className="flex gap-2.5 pt-2">
                        <button
                            onClick={clearCart}
                            disabled={purchaseLoading}
                            className="flex-1 px-4 py-3 border border-red-500/20 hover:border-red-500/50 text-red-400 hover:bg-red-500/5 font-semibold text-xs rounded transition-all active:scale-95 disabled:opacity-50 cursor-pointer uppercase tracking-wider"
                        >
                          Vaciar Carrito
                        </button>
                        <button
                            onClick={handleCheckout}
                            disabled={purchaseLoading}
                            className="flex-2 px-6 py-3 bg-gradient-to-r from-[#66c0f4] to-[#417a9b] hover:from-cyan-400 hover:to-cyan-500 text-white font-bold text-xs uppercase rounded transition-all shadow-[0_0_15px_rgba(102,192,244,0.2)] hover:shadow-[0_0_20px_rgba(102,192,244,0.4)] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 tracking-wider"
                        >
                          {purchaseLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                          ) : (
                              <span>Finalizar Compra</span>
                          )}
                        </button>
                      </div>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
}