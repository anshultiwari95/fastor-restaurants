import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import ImageStage from "../components/ImageStage";
import StatusBar from "../components/StatusBar";

export default function RestaurantDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  if (!state) {
    navigate("/home");
    return null;
  }

  // Get the address - prioritize location field from normalized data
  const getAddress = () => {
    if (state.location && state.location !== "null" && String(state.location).trim() !== "") {
      return String(state.location).trim();
    }
    if (state.address_complete && state.address_complete !== "null" && String(state.address_complete).trim() !== "") {
      return String(state.address_complete).trim();
    }
    const fallback = state.location_name || state.locationName || state.address || state.restaurant_location || "";
    if (fallback && fallback !== "null" && String(fallback).trim() !== "") {
      return String(fallback).trim();
    }
    return "Connaught Place, New Delhi";
  };
  
  const displayAddress = getAddress();

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert("Image is still loading. Please wait a moment and try again.");
      return;
    }

    try {
      // Wait a bit to ensure canvas is fully rendered
      await new Promise(resolve => setTimeout(resolve, 200));

      // Native canvas toDataURL - this captures the entire canvas
      const dataURL = canvas.toDataURL("image/png", 1.0);

      if (!dataURL || dataURL === "data:,") {
        throw new Error("Failed to generate image data");
      }

      // Convert data URL to blob
      const response = await fetch(dataURL);
      if (!response.ok) {
        throw new Error("Failed to convert image to blob");
      }
      
      const blob = await response.blob();
      const file = new File([blob], `fastor-${state.name || state.restaurant_name || 'restaurant'}.png`, {
        type: "image/png",
      });

      // Use Web Share API if available (PWA feature)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Fastor",
            text: `Check out ${state.name || state.restaurant_name || 'this restaurant'}!`,
          });
          console.log("Image shared successfully via Web Share API");
        } catch (shareError) {
          // User cancelled or share failed, fall through to download
          if (shareError.name !== "AbortError") {
            console.error("Share error:", shareError);
            throw shareError;
          }
        }
      } else {
        // Fallback: Download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fastor-${state.name || state.restaurant_name || 'restaurant'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("Image downloaded successfully");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert(`Failed to share image: ${error.message || "Please try again."}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white mx-auto max-w-6xl w-full min-h-screen">
        <StatusBar />
        
        {/* Image Section */}
        <div className="relative w-full" style={{ height: "50vh", minHeight: "300px" }}>
          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image Stage - This should display the image */}
          <ImageStage
            image={state.image}
            onCanvasReady={(c) => {
              canvasRef.current = c;
              console.log("Canvas ready callback fired, canvas:", c);
            }}
          />
        </div>

        {/* Restaurant Information */}
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold mb-2">
            {state.name || state.restaurant_name || "Restaurant"}
          </h1>

          {/* Location and Rating */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{displayAddress}</span>
            </p>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span className="text-sm font-semibold">{state.rating || 4.5}</span>
            </div>
          </div>

          {/* Offers */}
          <div className="flex items-center gap-1.5 mb-4">
            <svg
              className="w-4 h-4 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <span className="text-sm text-orange-600 font-medium">
              {state.offers || 4} Offers Trending
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            {state.description ||
              "Our delicate vanilla cake swirled with chocolate and filled with mocha chocolate chip cream and a layer of dark chocolate ganache"}
          </p>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full bg-[#FF6D6A] text-white py-4 rounded-lg font-medium hover:bg-[#FF5A57] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out shadow-lg mb-4"
          >
            📤 Share Image
          </button>

          {/* Hints */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800 font-medium text-center mb-1">
              🎯 Bonus Feature: Reposition the Logo
            </p>
            <p className="text-xs text-blue-700 text-center mb-1">
              💡 Click and drag the Fastor logo to move it anywhere on the image
            </p>
            <p className="text-xs text-blue-600 text-center">
              ✨ Scroll over the logo to resize it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
