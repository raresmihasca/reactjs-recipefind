import React from "react";
import { useState } from "react";
import "./SessionExpired.css"; 

function SessionExpiredBox({ onLogout }) {
    const [isVisible, setIsVisible] = useState(true);
  const handleLogout = () => {
    setIsVisible(false); // Hide the box when logout is clicked
    window.location.href = "/login";
  };
  return (
    <div className="session-expired-modal">
      <div className="session-expired-box">
        <h3>Your session has expired</h3>
        <button onClick={handleLogout}>Login Again</button>
      </div>
    </div>
  );
}

export default SessionExpiredBox;