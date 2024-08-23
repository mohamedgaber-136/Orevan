import React, { useState } from 'react';
import './AnimatedBarsButton.css';

const AnimatedBarsButton = ({ onClick }) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    if (animate) return;
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
      onClick();
    }, 500); // Duration should match animation time
  };

  return (
    <div className={`bars-button ${animate ? 'animate' : ''}`} onClick={handleClick}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};

export default AnimatedBarsButton;
