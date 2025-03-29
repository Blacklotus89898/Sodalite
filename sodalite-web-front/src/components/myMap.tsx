import { useState } from "react";

const MyMap: React.FC = () => {
    const [latitude, setLatitude] = useState(37.7749); // Default latitude (San Francisco)
    const [longitude, setLongitude] = useState(-122.4194); // Default longitude (San Francisco)

    const googleMapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

    // Function to fetch current location
    const fetchCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude);
                    setLongitude(longitude);
                },
                (error) => {
                    console.error("Error fetching location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div>
            <h1>MyMap Component</h1>
            {/* Latitude and Longitude Inputs */}
            <div>
                <label>
                    Latitude:
                    <input
                        type="number"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                        placeholder="Latitude"
                    />
                </label>
                <label>
                    Longitude:
                    <input
                        type="number"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
                        placeholder="Longitude"
                    />
                </label>
            </div>

            {/* Button to Fetch Current Location */}
            <button onClick={fetchCurrentLocation}>
                Use Current Location
            </button>

            {/* Google Maps iframe */}
            <iframe
                title="Google Map"
                src={googleMapUrl}
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
            ></iframe>
        </div>
    );
};

export default MyMap;