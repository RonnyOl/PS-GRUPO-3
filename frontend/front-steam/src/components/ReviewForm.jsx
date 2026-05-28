import React, { useState } from 'react';
import { reviewService } from '@/services/reviewService';

export const ReviewForm = ({ gameId, userId }) => {
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // Para éxito o error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        // Estructuramos el objeto exactamente como lo espera el RequestReviewDto de Java
        const reviewData = {
            gameId: parseInt(gameId),
            score: parseInt(score),
            comment: comment
        };

        try {
            const successMessage = await reviewService.createReview(userId, reviewData);
            setMessage({ text: successMessage, type: 'success' });
            setComment(''); // Limpiamos el comentario si salió todo bien
        } catch (error) {
            // error.message contiene el texto de la excepción de Spring (ej: "No podés dejar una reseña...")
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h3>Dejar una Reseña</h3>

            {message.text && (
                <div style={{ ...styles.alert, ...styles[message.type] }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.group}>
                    <label>Puntuación (1 al 5):</label>
                    <select value={score} onChange={(e) => setScore(e.target.value)} style={styles.select}>
                        <option value="5">⭐⭐⭐⭐⭐ (Excelente)</option>
                        <option value="4">⭐⭐⭐⭐ (Muy Bueno)</option>
                        <option value="3">⭐⭐⭐ (Regular)</option>
                        <option value="2">⭐⭐ (Malo)</option>
                        <option value="1">⭐ (Horrible)</option>
                    </select>
                </div>

                <div style={styles.group}>
                    <label>Tu Opinión:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Escribí qué te pareció el juego..."
                        rows="4"
                        required
                        style={styles.textarea}
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Publicando...' : 'Publicar Reseña'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    group: { display: 'flex', flexDirection: 'column', gap: '5px' },
    select: { padding: '8px', borderRadius: '4px', border: '1px solid #aaa' },
    textarea: { padding: '8px', borderRadius: '4px', border: '1px solid #aaa', resize: 'vertical' },
    button: { padding: '10px', backgroundColor: '#107c10', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    alert: { padding: '10px', borderRadius: '4px', fontWeight: 'bold', marginBottom: '10px' },
    success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    error: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }
};