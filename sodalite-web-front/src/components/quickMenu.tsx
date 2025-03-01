import React, { useState } from "react";

interface QuickMenuProps {
    options: string[];
    onSelect: (option: string) => void;
    position: { x: number; y: number };
    selectedOption: string | null;
}

const QuickMenu: React.FC<QuickMenuProps> = ({ options, onSelect, position, selectedOption }) => {
    const radius = 100; // Distance from center to options
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const handleMouseEnter = (option: string) => {
        setHoveredOption(option);
        onSelect(option);
    };

    const handleMouseLeave = () => {
        setHoveredOption(null);
        onSelect("");
    };

    return (
        <div
            style={{
                position: "absolute",
                top: `${position.y}px`,
                left: `${position.x}px`,
                width: "220px",
                height: "220px",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                // backgroundColor: "rgba(0, 0, 0, 1)", // Dark transparent background
                backgroundColor: "transparent", // Dark transparent background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", // Light shadow for emphasis
            }}
        >
            {options.map((option, index) => {
                const angle = (index / options.length) * 2 * Math.PI - Math.PI / 2;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                const isSelected = selectedOption === option;
                const isHovered = hoveredOption === option;

                return (
                    <div
                        key={index}
                        onMouseEnter={() => handleMouseEnter(option)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: `translate(-50%, -50%) scale(${isHovered || isSelected ? 1.1 : 1})`, // Combine transforms
                            padding: "12px 20px",
                            backgroundColor: isHovered || isSelected ? "#444" : "#333", // Highlight on hover or selection
                            borderRadius: "8px",
                            cursor: "pointer",
                            color: "#fff",
                            textAlign: "center",
                            fontSize: "16px",
                            transition: "background 0.3s ease-in-out, transform 0.2s ease-in-out",
                            boxShadow: isHovered || isSelected ? "0px 4px 12px rgba(0, 0, 0, 0.6)" : "none",
                        }}
                    >
                        {option}
                    </div>
                );
            })}
        </div>
    );
};

export default QuickMenu;
