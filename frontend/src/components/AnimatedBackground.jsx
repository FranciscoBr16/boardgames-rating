import './AnimatedBackground.css';

function AnimatedBackground({ children }) {
  return (
    <div className="animated-bg-container">
      <div className="animated-bg"></div>
      <div className="content-overlay">
        {children}
      </div>
    </div>
  );
}

export default AnimatedBackground;