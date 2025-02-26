import React, { useState, useEffect } from 'react';
import { Container } from './container';

function Weather() {
    const [weatherData, setWeatherData] = useState([]);
    const [location, setLocation] = useState('Montreal');
    const [newLocation, setNewLocation] = useState('');
    const [numDays, setNumDays] = useState(3);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Fetch weather data from wttr.in API (adjusted URL)
                const response = await fetch(`https://wttr.in/${location}?format=j1&num_of_days=7`);
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
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h2>Weather Information for {location}</h2>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter location"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginRight: '10px'
                    }}
                />
                <button
                    onClick={handleConfirm}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                    Confirm
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="numDays">Number of days to predict: {numDays}</label>
                <input
                    type="range"
                    id="numDays"
                    min="1"
                    max="3"
                    value={numDays}
                    onChange={e => setNumDays(Number(e.target.value))}
                    style={{ marginLeft: '10px' }}
                />
            </div>

            {/* Displaying weather data */}
            {weatherData.length > 0 && (
                <div>
                    <h3>Weather Forecast</h3>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {weatherData.map((day, index) => (
                            <Container key={index} style={{
                                backgroundColor: '#f0f0f0',
                                padding: '10px',
                                borderRadius: '5px',
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                width: '200px'
                            }}>
                                <div>
                                    <h4 style={{ margin: '0 0 10px 0' }}>Day {index + 1}</h4>
                                    <p>Date: {day.date}</p>
                                    <p>Max Temp: {day.maxtempC}°C</p>
                                    <p>Min Temp: {day.mintempC}°C</p>
                                    <p>Weather: {day.hourly && day.hourly[0].weatherDesc[0].value}</p>
                                </div>
                            </Container>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading state or error handling */}
            {weatherData.length === 0 && <p>Loading weather data...</p>}
        </div>
    );
}

export default Weather;
