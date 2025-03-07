import React, { useEffect } from 'react';
import { useTheme, useStreak } from '../stores/hooks';

const styles = {
    container: (theme: string) => ({
        textAlign: 'center' as const,
        padding: '20px',
        backgroundColor: theme === 'light' ? '#f4f7f6' : '#2c3e50',
        borderRadius: '8px',
        boxShadow: theme === 'light' ? '0 4px 10px rgba(0, 0, 0, 0.1)' : '0 4px 10px rgba(255, 255, 255, 0.1)',
        width: 'fit-content',
        margin: 'auto',
    }),
    streakTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
    },
    streakSubtitle: {
        fontSize: '16px',
        fontWeight: '400',
        color: '#555',
        marginBottom: '20px',
    },
    heatmapContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 20px)',
        gridGap: '5px',
        justifyContent: 'center',
        marginTop: '30px',
    },
    gridCell: {
        width: '20px',
        height: '20px',
        borderRadius: '4px',
    },
};

const getHeatmapColor = (streak: number) => {
    if (streak >= 10) return '#d32f2f';
    if (streak >= 7) return '#f57c00';
    if (streak >= 4) return '#fbc02d';
    if (streak >= 1) return '#388e3c';
    return '#e0e0e0';
};

const Streak: React.FC = () => {
    const { theme } = useTheme();
    const { streak, heatmap, activityDates, setActivityDates } = useStreak();

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        if (!activityDates.includes(today)) {
            setActivityDates([...activityDates, today]);
        }
    }, [activityDates, setActivityDates]);

    return (
        <div style={styles.container(theme)}>
            <h2 style={styles.streakTitle}>Current Streak</h2>
            <p style={styles.streakSubtitle}>
                You have been active for {streak} day{streak !== 1 ? 's' : ''}
            </p>
            <div style={styles.heatmapContainer}>
                {[...Array(42)].map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - index);
                    const dateString = date.toISOString().split('T')[0];
                    return (
                        <div
                            key={index}
                            style={{
                                ...styles.gridCell,
                                backgroundColor: getHeatmapColor(heatmap[dateString] || 0),
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Streak;
