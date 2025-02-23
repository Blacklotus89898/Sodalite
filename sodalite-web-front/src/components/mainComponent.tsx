import React, { useState, useEffect } from "react";
import QuickMenu from "./quickMenu"; // Ensure correct import path

const MainComponent: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Store selected option

  const options = ["Option 1", "Option 2", "Option 3"];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "z" && !showMenu) {
        // Adjust position by the current scroll offset to ensure the menu is in the right place
        setMenuPosition({
          x: cursorPosition.x + window.scrollX,
          y: cursorPosition.y + window.scrollY,
        });
        setShowMenu(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "z") {
        // Select the option when Z is released
        if (selectedOption) {
          alert(`Selected: ${selectedOption}`);
        }
        setShowMenu(false);
        setSelectedOption(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [showMenu, cursorPosition, selectedOption]); // Ensure updates when cursor moves or option is selected

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#222" }}>
      {showMenu && menuPosition && (
        <QuickMenu
          options={options}
          onSelect={(option) => setSelectedOption(option)}
          position={menuPosition}
          selectedOption={selectedOption}
        />
      )}
    </div>
  );
};

export default MainComponent;
