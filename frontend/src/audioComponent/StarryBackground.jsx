import React, { useEffect, useRef } from 'react';
import './StarryBackground.css';

const COLORS = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];
const NUM_BALLS = 50;

const generateStars = (n) => {
  let shadows = '';
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    shadows += `${x}px ${y}px #FFF${i < n - 1 ? ',' : ''}`;
  }
  return shadows;
};

const StarryBackground = ({ isDarkTheme }) => {
  const ballsRef = useRef([]);
  const containerRef = useRef(null);
  const starsRef1 = useRef(null);
  const starsRef2 = useRef(null);
  const starsRef3 = useRef(null);

  // Handle dark mode stars
  useEffect(() => {
    if (isDarkTheme) {
      const smallStars = generateStars(700);
      const mediumStars = generateStars(200);
      const largeStars = generateStars(100);

      if (starsRef1.current) starsRef1.current.style.boxShadow = smallStars;
      if (starsRef2.current) starsRef2.current.style.boxShadow = mediumStars;
      if (starsRef3.current) starsRef3.current.style.boxShadow = largeStars;
    }
  }, [isDarkTheme]);

  // Handle light mode balls
  useEffect(() => {
    if (!isDarkTheme && containerRef.current) {
      // Clear previous balls
      ballsRef.current.forEach(ball => ball.remove());
      ballsRef.current = [];

      // Create new balls
      for (let i = 0; i < NUM_BALLS; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");
        ball.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        ball.style.left = `${Math.floor(Math.random() * 100)}%`;
        ball.style.top = `${Math.floor(Math.random() * 100)}%`;
        ball.style.transform = `scale(${Math.random()})`;
        ball.style.width = `${Math.random() + 0.5}em`;
        ball.style.height = ball.style.width;
        
        ballsRef.current.push(ball);
        containerRef.current.appendChild(ball);

        // Add animation
        const to = {
          x: Math.random() * (i % 2 === 0 ? -11 : 11),
          y: Math.random() * 12
        };

        ball.animate(
          [
            { transform: "translate(0, 0)" },
            { transform: `translate(${to.x}rem, ${to.y}rem)` }
          ],
          {
            duration: (Math.random() + 1) * 2000,
            direction: "alternate",
            fill: "both",
            iterations: Infinity,
            easing: "ease-in-out"
          }
        );
      }
    }

    // Cleanup
    return () => {
      ballsRef.current.forEach(ball => ball.remove());
      ballsRef.current = [];
    };
  }, [isDarkTheme]);

  if (isDarkTheme) {
    return (
      <div className="container dark">
        <div ref={starsRef1} id="stars" />
        <div ref={starsRef2} id="stars2" />
        <div ref={starsRef3} id="stars3" />
      </div>
    );
  }

  return <div ref={containerRef} className="container light" />;
};

export default StarryBackground; 