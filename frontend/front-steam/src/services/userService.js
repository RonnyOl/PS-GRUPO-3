import axios from "axios";

/**
 * Obtiene la información detallada de un usuario a partir de su correo electrónico.
 * 
 * Endpoint: GET http://localhost:8080/v1/users/information
 * Query Parameter: email (String)
 * 
 * @param {string} email - Correo electrónico del usuario.
 * @returns {Promise<{
 *   userName: string,
 *   amountBalance: number,
 *   games: Array<{
 *     id: string,
 *     name: string,
 *     description: string,
 *     price: number,
 *     company: string,
 *     imageUrl: string,
 *     categories: Array<string>,
 *     releaseDate: string
 *   }>
 * }>} Retorna la información del usuario y su listado de juegos.
 */
export async function getUserInformation(email) {
  if (!email) {
    throw new Error("El email es un parámetro requerido.");
  }

  try {
    const response = await axios.get("http://localhost:8080/v1/users/information", {
      params: { email },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    throw error;
  }
}
