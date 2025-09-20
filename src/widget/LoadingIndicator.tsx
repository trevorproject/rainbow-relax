import { useEffect, useState } from "react";
import { assetLoader } from "./AssetLoader";

interface LoadingIndicatorProps {
  onComplete?: () => void;
}

export const LoadingIndicator = ({ onComplete }: LoadingIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkProgress = () => {
      const currentProgress = assetLoader.getLoadingProgress();
      setProgress(currentProgress);

      if (currentProgress >= 1 && !isComplete) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete?.();
        }, 500); // Small delay for smooth transition
      }
    };

    // Check progress every 100ms
    const interval = setInterval(checkProgress, 100);
    
    // Initial check
    checkProgress();

    return () => clearInterval(interval);
  }, [isComplete, onComplete]);

  if (isComplete) {
    return null;
  }

  return (
    <div 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000,
        fontFamily: "var(--font-global, Arial, sans-serif)"
      }}
    >
      {/* Loading spinner */}
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #f0f0f0",
          borderTop: "3px solid #ff5a3e",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "16px"
        }}
      />
      
      {/* Progress text */}
      <p style={{ 
        margin: 0, 
        color: "#666", 
        fontSize: "14px",
        textAlign: "center"
      }}>
        Loading Rainbow Relax...
      </p>
      
      {/* Progress bar */}
      <div
        style={{
          width: "200px",
          height: "4px",
          backgroundColor: "#f0f0f0",
          borderRadius: "2px",
          marginTop: "12px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${Math.round(progress * 100)}%`,
            height: "100%",
            backgroundColor: "#ff5a3e",
            borderRadius: "2px",
            transition: "width 0.3s ease"
          }}
        />
      </div>
      
      {/* Progress percentage */}
      <span style={{ 
        fontSize: "12px", 
        color: "#999", 
        marginTop: "8px" 
      }}>
        {Math.round(progress * 100)}%
      </span>

      {/* CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
