import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reviews'; // Ajustá el puerto si usás otro

export const reviewService = {
    /**
     * Envía una nueva reseña a la API de Spring Boot
     * @param {number} userId - ID del usuario que logueado
     * @param {object} reviewData - Objeto con gameId, score y comment
     */
    createReview: async (userId, reviewData) => {
        try {
            // Mandamos el idUser por la URL y el DTO en el body
            const response = await axios.post(`${API_BASE_URL}/user/${userId}`, reviewData);
            return response.data; // Retorna el string "¡Review publicada con éxito!"
        } catch (error) {
            // Capturamos el mensaje de error exacto que envía Spring (las validaciones de negocio)
            const errorMessage = error.response?.data || 'Error interno al publicar la reseña';
            throw new Error(errorMessage);
        }
    }
};