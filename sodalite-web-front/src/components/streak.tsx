import React, { useState, useEffect } from 'react';

// Styles for the component
const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '20px',
    backgroundColor: '#f4f7f6',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: 'fit-content',
    margin: 'auto',
  },
  streakContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    gap: '10px', // Adds space between the day blocks
    marginTop: '20px',
  },
  streakDay: {
    width: '35px',
    height: '35px',
    color: 'white',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: '50%', // Makes the day blocks circular
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Smooth transition for hover effect
  },
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
  githubHeatmapContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 20px)', // 7 columns for days of the week (Sunday to Saturday)
    gridGap: '5px',
    justifyContent: 'center',
    marginTop: '30px',
  },
  gridCell: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

// Color scale for the heatmap (from low to high intensity)
const heatmapColorScale = [
  '#f3f4f6', // Very old days (faded)
  '#f0e68c', // Light yellow
  '#ffcc00', // Yellow
  '#ff8000', // Orange
  '#ff0000', // Red (most recent)
];

interface StreakProps {
  activityDates: string[];
}

const Streak: React.FC<StreakProps> = ({ activityDates }) => {
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    calculateStreak();
  }, [activityDates]);

  const calculateStreak = () => {
    let currentStreak = 0;
    let today = new Date().setHours(0, 0, 0, 0);

    for (let i = activityDates.length - 1; i >= 0; i--) {
      const activityDate = new Date(activityDates[i]).setHours(0, 0, 0, 0);
      if (activityDate === today || activityDate === today - currentStreak * 86400000) {
        currentStreak++;
        today -= 86400000; // Move to the previous day
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const getHeatmapColor = (date: string) => {
    const activityDate = new Date(date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    const dayDifference = Math.floor((today - activityDate) / 86400000); // Calculate the difference in days

    // Map day difference to heatmap color scale (ensure the index doesn't exceed the array length)
    const colorIndex = Math.min(dayDifference, heatmapColorScale.length - 1);
    return heatmapColorScale[colorIndex];
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.streakTitle}>Current Streak</h2>
      <p style={styles.streakSubtitle}>
        You have been active for {streak} day{streak > 1 ? 's' : ''}
      </p>
      <div style={styles.streakContainer}>
        {activityDates.map((date, index) => {
          const heatmapColor = getHeatmapColor(date);

          return (
            <div
              key={index}
              style={{
                ...styles.streakDay,
                backgroundColor: heatmapColor, // Apply heatmap color
              }}
            >
              {new Date(date).getDate()}
            </div>
          );
        })}
      </div>

      {/* GitHub-like heatmap grid */}
      <div style={styles.githubHeatmapContainer}>
        {activityDates.map((date, index) => {
          const heatmapColor = getHeatmapColor(date);

          return (
            <div
              key={index}
              style={{
                ...styles.gridCell,
                backgroundColor: heatmapColor, // Apply heatmap color
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Streak;
