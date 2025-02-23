import React, { useState } from "react";

interface QuickMenuProps {
    options: string[];
    onSelect: (option: string) => void;
    position: { x: number; y: number };
    selectedOption: string | null; // Track the currently selected (hovered) option
}

const QuickMenu: React.FC<QuickMenuProps> = ({ options, onSelect, position, selectedOption }) => {
    const radius = 100; // Distance from center to options
    const [hoveredOption, setHoveredOption] = useState<string | null>(null); // Track hovered option

    const handleMouseEnter = (option: string) => {
        setHoveredOption(option); // Set hovered option
        onSelect(option); // Highlight the option
    };

    const handleMouseLeave = () => {
        setHoveredOption(null); // Reset hovered option when mouse leaves
        onSelect(""); // Unhighlight the option
    };

    return (
        <div
            style={{
                position: "absolute",
                top: `${position.y}px`,
                left: `${position.x}px`,
                width: "200px",
                height: "200px",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            {options.map((option, index) => {
                const angle = (index / options.length) * 2 * Math.PI - Math.PI / 2;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                // Determine if the option is hovered or selected
                const isSelected = selectedOption === option;
                const isHovered = hoveredOption === option;

                return (
                    <div
                        key={index}
                        onMouseLeave={handleMouseLeave} // Reset selection when the mouse leaves the menu
                        onMouseEnter={() => handleMouseEnter(option)} // Set hovered option
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%)",
                            padding: "10px",
                            backgroundColor: isHovered || isSelected ? "#888" : "#555", // Highlight if hovered or selected
                            borderRadius: "5px",
                            cursor: "pointer",
                            color: "#fff",
                            textAlign: "center",
                            transition: "background 0.3s",
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
