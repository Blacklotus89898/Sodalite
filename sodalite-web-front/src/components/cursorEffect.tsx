import { useState, useEffect } from "react";

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  interface Trail {
    id: string;
    x: number;
    y: number;
    size: number;
    opacity: number;
    color: string;
  }

  const [trail, setTrail] = useState<Trail[]>([]);

  // Update position on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
      setIsMoving(true);

      const newTrail: Trail = {
        id: `${Date.now()}-${Math.random()}`, // Unique ID
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
        size: 10,
        opacity: 1,
        color: "red", // Start with red color for the trail
      };

      setTrail((prev) => [...prev, newTrail]);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Hide cursor after 200ms of inactivity
    const hideCursor = setTimeout(() => {
      setIsMoving(false);
    }, 200);

    return () => {
      clearTimeout(hideCursor);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Update trail size, opacity, and color to create fading, shrinking, and gradient color effect (hot to cold)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) =>
        prev
          .map((t) => {
            const easedOpacity = 1 - Math.pow(1 - t.opacity, 2); // Squared easing for quicker color change
            const hue = Math.max(0, 240 * easedOpacity); // Color transition from red (0) to blue (240)
            return {
              ...t,
              size: Math.max(t.size - 0.5, 3),
              opacity: Math.max(t.opacity - 0.05, 0),
              color: `hsl(${hue}, 100%, 50%)`,
            };
          })
          .filter((t) => t.opacity > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Make the default cursor invisible by adding 'cursor: none' to the body
  useEffect(() => {
    document.body.style.cursor = "none"; // Hide the default cursor
    return () => {
      document.body.style.cursor = ""; // Restore the cursor on cleanup
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none", // To ensure it doesn’t interfere with other elements
      }}
    >
      {/* Cursor trail effects */}
      {trail.map((t) => (
        <div
          key={t.id}
          style={{
            position: "absolute",
            left: `${t.x - t.size / 2}px`,
            top: `${t.y - t.size / 2}px`,
            width: `${t.size}px`,
            height: `${t.size}px`,
            borderRadius: "50%",
            backgroundColor: t.color,
            opacity: t.opacity,
            transition: "all 0.1s ease-out",
          }}
        />
      ))}

      {/* Invisible Cursor when not moving */}
      <div
        style={{
          position: "absolute",
          left: `${position.x - 10}px`,
          top: `${position.y - 10}px`,
          width: "20px",
          height: "20px",
          backgroundColor: "transparent",
          borderRadius: "50%",
          pointerEvents: "none",
          display: isMoving ? "block" : "none", // Only show when moving
        }}
      />
    </div>
  );
};

export default CursorEffect;
