import React from "react";

// Define the type for the props
interface HomeProps {
    title?: string;  // Optional prop
    description?: string;  // Optional prop
    count?: number;  // Optional prop
    onClick?: () => void;  // Optional prop
}


const Home: React.FC<HomeProps> = ({ title,  }) => {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>{title || "Home"}</h1>

        </div>
    );
};

// Set default props if not provided

export default Home;
