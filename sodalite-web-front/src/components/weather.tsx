import React, { useState, useEffect } from 'react';
import { Container } from './container';

interface WeatherData {
    date: string;
    maxtempC: string;
    mintempC: string;
    hourly: {
        weatherDesc: {
            value: string;
        }[];
    }[];
}

function Weather() {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [location, setLocation] = useState('Montreal');
    const [newLocation, setNewLocation] = useState('');
    const [numDays, setNumDays] = useState(3);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Fetch weather data from wttr.in API (adjusted URL)
                const response = await fetch(`https://wttr.in/${location}?format=j1&num_of_days=${numDays}`);
                const data = await response.json();
                console.log(data);

                // Check if weather data is available and slice it based on numDays
                if (data && data.weather) {
                    setWeatherData(data.weather.slice(0, numDays));
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeather();
    }, [location, numDays]);

    const handleConfirm = () => {
        if (newLocation.trim()) {
            setLocation(newLocation);
        } else {
            console.warn('Please enter a valid location');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Weather Information for {location}</h2>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Enter location"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                    style={styles.input}
                />
                <button
                    onClick={handleConfirm}
                    style={styles.button}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                >
                    Confirm
                </button>
            </div>

            <div style={styles.sliderContainer}>
                <label htmlFor="numDays">Number of days to predict: {numDays}</label>
                <input
                    type="range"
                    id="numDays"
                    min="1"
                    max="7"
                    value={numDays}
                    onChange={e => setNumDays(Number(e.target.value))}
                    style={styles.slider}
                />
            </div>

            {/* Displaying weather data */}
            {weatherData.length > 0 ? (
                <div>
                    <h3>Weather Forecast</h3>
                    <div style={styles.forecastContainer}>
                        {weatherData.map((day, index) => (
                            <div key={index} style={styles.forecastCard}>
                                <Container maxHeight={200}>
                                    <div>
                                        <h4 style={styles.dayTitle}>Day {index + 1}</h4>
                                        <p>Date: {day.date}</p>
                                        <p>Max Temp: {day.maxtempC}°C</p>
                                        <p>Min Temp: {day.mintempC}°C</p>
                                        <p>Weather: {day.hourly && day.hourly[0].weatherDesc[0].value}</p>
                                    </div>
                                </Container>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
}

// Define the styles
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginRight: '10px',
        width: 'calc(100% - 140px)',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    sliderContainer: {
        marginBottom: '20px',
    },
    slider: {
        marginLeft: '10px',
    },
    forecastContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '20px',
    },
    forecastCard: {
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: 'calc(33.333% - 20px)',
        boxSizing: 'border-box' as const,
    },
    dayTitle: {
        margin: '0 0 10px 0',
    },
};

export default Weather;
