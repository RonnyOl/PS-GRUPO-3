"use client";

import { useState } from "react";
import { getUserInformation } from "@/services/userService";
import { purchaseGames } from "@/services/purchaseService";

/**
 * Hook de React para ejecutar la validación y compra de juegos de forma segura.
 *
 * Realiza las siguientes validaciones en el cliente antes de disparar la compra:
 * 1. El precio total de la compra debe ser menor o igual al saldo en cuenta (amountBalance).
 * 2. Ninguno de los juegos a comprar debe haber sido comprado previamente por el usuario.
 *
 * @returns {{
 *   loading: boolean,
 *   error: string | null,
 *   success: boolean,
 *   executePurchase: (email: string, cartItems: Array<any>, cartTotal: number) => Promise<boolean>
 * }} Estado del proceso de compra y función ejecutora.
 */
export function usePurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const executePurchase = async (email, cartItems, cartTotal) => {
    if (!email) {
      setError("Se requiere iniciar sesión para completar la compra.");
      return false;
    }

    if (!cartItems || cartItems.length === 0) {
      setError("El carrito de compras está vacío.");
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Obtener la información actual del usuario en la base de datos
      const userInfo = await getUserInformation(email);
      console.log("Estructura real de userInfo de la API:", userInfo);
      if (!userInfo) {
        throw new Error("No se pudo recuperar la información de la cuenta.");
      }

      // 🔍 CAPTURA DEFENSIVA: Evaluamos variantes de nombres comunes entre Front y Back
      const userName = userInfo.userName || userInfo.username || userInfo.name;
      const amountBalance = userInfo.amountBalance || userInfo.balance || userInfo.amount_balance || 0;
      const ownedGames = userInfo.games || userInfo.ownedGames || userInfo.owned_games || [];

      // Control de seguridad por si el nombre sigue vacío
      if (!userName) {
        throw new Error("El perfil de usuario no contiene un nombre de usuario válido.");
      }

      // 2. Validación 1: Precio total inferior o igual al saldo en cuenta
      const balance = parseFloat(amountBalance);
      if (cartTotal > balance) {
        throw new Error(
            `Saldo insuficiente. El total de tu compra es u$s ${cartTotal.toFixed(
                2
            )}, pero tu saldo actual es u$s ${balance.toFixed(2)}.`
        );
      }

      // 3. Validación 2: Que no incluya ningún juego previamente comprado
      const ownedIds = ownedGames.map((game) =>
          (game.id || game.id_game || game.game_id || "").toString()
      );

      const alreadyOwnedItems = cartItems.filter((item) => {
        const cartGameId = (item.id_game || item.game_id || "").toString();
        return ownedIds.includes(cartGameId);
      });

      if (alreadyOwnedItems.length > 0) {
        const gameNames = alreadyOwnedItems.map((item) => item.name).join(", ");
        throw new Error(
            `Ya has comprado previamente los siguientes títulos de tu carrito: ${gameNames}. Por favor remóvelos para poder continuar.`
        );
      }

      // 4. Construcción del Payload para la petición POST
      const gamesIds = cartItems.map((item) =>
          parseInt(item.id_game || item.game_id)
      );

      const purchasePayload = {
        userName: userName, // 👈 Ahora viaja seguro el valor correcto
        gamesIds: gamesIds,
        paymentMethod: "Saldo en cuenta",
        totalPrice: cartTotal,
      };

      // 5. Ejecutar la compra en el servidor
      const responseData = await purchaseGames(purchasePayload);

      setSuccess(true);
      return responseData;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Ocurrió un error inesperado al procesar la compra.";
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    executePurchase,
  };
}
