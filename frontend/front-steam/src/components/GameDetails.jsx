import React, { useEffect, useState } from 'react';
import { gameService } from '@/services/gameService'; // Ajustá la ruta

export const GameDetail = ({ gameId }) => {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                setLoading(true);
                const data = await gameService.getGameDetail(gameId);
                setGame(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (gameId) {
            fetchGameData();
        }
    }, [gameId]);

    if (loading) return <div style={styles.centered}>Cargando los componentes del juego...</div>;
    if (error) return <div style={{ ...styles.centered, color: 'red' }}>Error: {error}</div>;
    if (!game) return <div style={styles.centered}>No se encontró información del juego.</div>;

    return (
        <div style={styles.container}>
            {/* Ficha Técnica Principal */}
            <div style={styles.header}>
                <h1 style={styles.title}>{game.name}</h1>
                <p style={styles.developer}>Desarrollado por: <strong>{game.developerName}</strong></p>
                <p style={styles.price}>Precio: <span>${game.price}</span></p>
            </div>

            <div style={styles.descriptionSection}>
                <h3>Descripción</h3>
                <p style={styles.description}>{game.description}</p>
            </div>

            {/* 📊 Estadísticas Comunitarias (Traídas desde Library con tu query agregada) */}
            <div style={styles.statsContainer}>
                <div style={styles.statBox}>
                    <span style={styles.statIcon}>💾</span>
                    <div>
                        <div style={styles.statNumber}>{game.installedCount || 0}</div>
                        <div style={styles.statLabel}>Jugadores lo tienen instalado</div>
                    </div>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statIcon}>⭐</span>
                    <div>
                        <div style={styles.statNumber}>{game.favoriteCount || 0}</div>
                        <div style={styles.statLabel}>Usuarios lo tienen en favoritos</div>
                    </div>
                </div>
            </div>

            {/* 💬 Sección de Reseñas (Traídas secuencialmente desde tu ReviewRepository) */}
            <div style={styles.reviewsSection}>
                <h3>Reseñas de la Comunidad ({game.reviews?.length || 0})</h3>
                {game.reviews && game.reviews.length > 0 ? (
                    <div style={styles.reviewsList}>
                        {game.reviews.map((review, index) => (
                            <div key={index} style={styles.reviewCard}>
                                <div style={styles.reviewHeader}>
                                    <span style={styles.reviewerName}>{review.userName}</span>
                                    <span style={styles.reviewStars}>{'⭐'.repeat(review.score)}</span>
                                </div>
                                <p style={styles.reviewComment}>"{review.comment}"</p>
                                <small style={styles.reviewDate}>
                                    {new Date(review.reviewDate).toLocaleDateString()}
                                </small>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={styles.noReviews}>Nadie dejó una reseña todavía. ¡Sé el primero!</p>
                )}
            </div>
        </div>
    );
};

// Estilos oscuros inspirados en la interfaz de Steam
const styles = {
    container: { maxWidth: '800px', margin: '30px auto', padding: '25px', backgroundColor: '#1b2838', color: '#c7d5e0', borderRadius: '8px', fontFamily: '"Motiva Sans", Arial, sans-serif' },
    centered: { textAlign: 'center', padding: '50px', fontSize: '18px', fontWeight: 'bold' },
    header: { borderBottom: '2px solid #2a475e', paddingBottom: '15px', marginBottom: '20px' },
    title: { margin: '0 0 10px 0', color: '#ffffff', fontSize: '32px' },
    developer: { margin: '0', color: '#66c0f4' },
    price: { fontSize: '20px', margin: '10px 0 0 0', color: '#a3cf06' },
    descriptionSection: { marginBottom: '25px' },
    description: { lineHeight: '1.6', color: '#acb2b8' },

    // Estilos de los contadores comunitarios
    statsContainer: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statBox: { flex: 1, display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#16202d', borderRadius: '6px', border: '1px solid #2a475e' },
    statIcon: { fontSize: '28px' },
    statNumber: { fontSize: '22px', fontWeight: 'bold', color: '#ffffff' },
    statLabel: { fontSize: '12px', color: '#8f98a0' },

    // Estilos de las reseñas
    reviewsSection: { borderTop: '2px solid #2a475e', paddingTop: '20px' },
    reviewsList: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
    reviewCard: { padding: '15px', backgroundColor: '#121a24', borderRadius: '6px', borderLeft: '4px solid #66c0f4' },
    reviewHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    reviewerName: { fontWeight: 'bold', color: '#ffffff' },
    reviewStars: { color: '#ffcc00' },
    reviewComment: { margin: '0 0 8px 0', fontStyle: 'italic', color: '#d6d7d8' },
    reviewDate: { color: '#626366', fontSize: '11px' },
    noReviews: { color: '#8f98a0', fontStyle: 'italic' }
};