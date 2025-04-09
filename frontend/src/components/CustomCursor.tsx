import { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const frameCount = useRef(0);
  const spriteSize = 64;

  // Lightning man running animation frames (you would replace these with actual image paths)
  const runningFrames = [
    "⚡", // Frame 1 - simple emoji representation
    "🏃", // Frame 2
    "⚡", // Frame 3
    "🏃‍♂️", // Frame 4
  ];

  useEffect(() => {
    const updatePosition = (e) => {
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastPosition.current.x, 2) +
          Math.pow(e.clientY - lastPosition.current.y, 2)
      );

      if (distance > 5) {
        setIsMoving(true);
        lastPosition.current = { x: e.clientX, y: e.clientY };
      } else {
        setIsMoving(false);
      }

      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  useEffect(() => {
    const animate = () => {
      frameCount.current = (frameCount.current + 1) % runningFrames.length;
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isMoving) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
      frameCount.current = 0;
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isMoving]);

  return (
    <div
      className="fixed pointer-events-none transition-transform duration-75 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        fontSize: "2rem",
        filter: "drop-shadow(0 0 5px rgba(255, 255, 0, 0.8))",
        willChange: "transform",
      }}
    >
      <div
        className="relative"
        style={{
          width: `${spriteSize}px`,
          height: `${spriteSize}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            transform: `scaleX(${position.x > lastPosition.current.x ? 1 : -1})`,
            transition: "transform 0.1s ease",
          }}
        >
          {runningFrames[frameCount.current]}
        </span>
        {/* Trail effect */}
        {isMoving && (
          <>
            <span
              className="absolute opacity-70"
              style={{
                transform: `translate(-10px, 5px) scaleX(${
                  position.x > lastPosition.current.x ? 1 : -1
                })`,
              }}
            >
              {runningFrames[(frameCount.current + 1) % runningFrames.length]}
            </span>
            <span
              className="absolute opacity-40"
              style={{
                transform: `translate(-20px, 10px) scaleX(${
                  position.x > lastPosition.current.x ? 1 : -1
                })`,
              }}
            >
              {runningFrames[(frameCount.current + 2) % runningFrames.length]}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomCursor;