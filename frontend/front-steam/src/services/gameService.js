import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/games'; // Ajustá la ruta según tu Controller

export const gameService = {
    /**
     * Obtiene el detalle completo de un juego por su ID (incluye desarrollador, stats y reviews)
     * @param {number} gameId
     */
    getGameDetail: async (gameId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${gameId}`);
            return response.data; // Retorna el DTO con toda la estructura combinada
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al cargar el detalle del juego';
            throw new Error(errorMessage);
        }
    }
};