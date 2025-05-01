// components/UI/Counter.js
import React, { useEffect, useState } from "react";

const Counter = ({ value, duration = 1200, className = "", decimals = 0 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newValue = start + (value - start) * progress;
      setDisplay(Number(newValue.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, decimals]);

  return <span className={className}>{display}</span>;
};

export default Counter;
