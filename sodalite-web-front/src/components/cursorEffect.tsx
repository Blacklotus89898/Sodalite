import { useState, useEffect } from "react";

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  interface Trail {
    id: string; // Unique ID for each trail element
    x: number;
    y: number;
    size: number; // Size of the trail dot
    opacity: number; // Opacity for fading effect
    color: string; // Trail color (hot to cold gradient)
  }

  const [trail, setTrail] = useState<Trail[]>([]);

  // Update position on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
      setIsMoving(true);

      // Create a new trail with a unique id based on timestamp and random number
      const newTrail: Trail = {
        id: `${Date.now()}-${Math.random()}`, // Unique ID
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
        size: 10, // Initial size of the trail dot
        opacity: 1, // Initial opacity of the trail dot
        color: "red", // Start with red color for the trail
      };

      // Add the new trail point
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
            // Easing function to create quicker color change at the start
            // The closer opacity is to 1, the faster the color change
            const easedOpacity = 1 - Math.pow(1 - t.opacity, 2); // Squared easing function for quicker start and slower end
            const hue = Math.max(0, 240 * easedOpacity); // From red (0) to blue (240) as opacity decreases
            return {
              ...t,
              size: Math.max(t.size - 0.5, 3), // Shrink the size but maintain a minimum size
              opacity: Math.max(t.opacity - 0.05, 0), // Fade out the trail points
              color: `hsl(${hue}, 100%, 50%)`, // Hot to cold gradient (Red to Blue)
            };
          })
          .filter((t) => t.opacity > 0) // Remove fully faded trails
      );
    }, 30); // Update every 30ms for a smoother effect

    return () => clearInterval(interval);
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
          key={t.id} // Using the unique id for each trail element
          style={{
            position: "absolute",
            left: `${t.x - t.size / 2}px`, // Adjust position based on size
            top: `${t.y - t.size / 2}px`, // Adjust position based on size
            width: `${t.size}px`, // Shrinking size
            height: `${t.size}px`, // Shrinking size
            borderRadius: "50%",
            backgroundColor: t.color, // Changing color for the trail (hot to cold gradient)
            opacity: t.opacity,
            transition: "all 0.1s ease-out", // Smooth transition for the shrinking/fading effect
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
