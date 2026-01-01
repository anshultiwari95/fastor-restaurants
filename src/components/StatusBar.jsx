import { useState, useEffect } from "react";

export default function StatusBar() {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };
    
    setTime(getCurrentTime());
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between items-center px-4 py-1.5 bg-white transition-all duration-300">
      <span className="text-sm font-semibold text-gray-900 transition-all duration-300">{time}</span>
      <img 
        src="/notificationbar.svg" 
        alt="Status bar" 
        className="h-3 transition-opacity duration-300 hover:opacity-80"
      />
    </div>
  );
}
