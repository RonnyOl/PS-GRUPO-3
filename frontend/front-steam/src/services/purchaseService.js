import axios from "axios";

/**
 * Registra una nueva compra de videojuegos en la plataforma Vapor.
 * * @param {{
 * userName: string,
 * gamesIds: Array<number>,
 * paymentMethod: string,
 * totalPrice: number
 * }} purchasePayload - Payload de la compra conteniendo el nombre, IDs, método y total.
 * @returns {Promise<any>} Respuesta del servidor (ResponseBuyDTO).
 */
export async function purchaseGames(purchasePayload) {
  try {
    console.log(purchasePayload);
    const response = await axios.post("http://localhost:8080/v1/purchases", purchasePayload, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error en purchaseGames Service:", error);
    // Re-arrojamos el error completo para que el bloque catch del hook usePurchase
    // pueda leer correctamente 'error.response.data.message' enviado por Spring.
    throw error;
  }
}