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
      <div className="bg-white mx-auto w-full max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl min-h-screen">
        <StatusBar />
        
        {/* Image Section */}
        <div className="relative w-full" style={{ height: "50vh", minHeight: "300px", maxHeight: "600px" }}>
          {/* Back Button - 44x44px minimum */}
          <button
            onClick={() => navigate("/home")}
            className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl min-w-[44px] min-h-[44px]"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
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
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">
            {state.name || state.restaurant_name || "Restaurant"}
          </h1>

          {/* Location and Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 flex items-center gap-1 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="break-words">{displayAddress}</span>
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0"
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
              <span className="text-sm sm:text-base lg:text-lg font-semibold">{state.rating || 4.5}</span>
            </div>
          </div>

          {/* Offers */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0"
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
            <span className="text-sm sm:text-base lg:text-lg text-orange-600 font-medium">
              {state.offers || 4} Offers Trending
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
            {state.description ||
              "Our delicate vanilla cake swirled with chocolate and filled with mocha chocolate chip cream and a layer of dark chocolate ganache"}
          </p>

          {/* Share Button - 44px minimum height */}
          <button
            onClick={handleShare}
            className="w-full bg-[#FF6D6A] text-white py-4 sm:py-5 lg:py-6 rounded-lg font-medium hover:bg-[#FF5A57] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out shadow-lg mb-4 sm:mb-6 text-base sm:text-lg lg:text-xl min-h-[48px] sm:min-h-[52px] lg:min-h-[56px]"
          >
            📤 Share Image
          </button>

          {/* Hints */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5 mb-4">
            <p className="text-xs sm:text-sm text-blue-800 font-medium text-center mb-1 sm:mb-2">
              🎯 Bonus Feature: Reposition the Logo
            </p>
            <p className="text-xs sm:text-sm text-blue-700 text-center mb-1 sm:mb-2">
              💡 Click and drag the Fastor logo to move it anywhere on the image
            </p>
            <p className="text-xs sm:text-sm text-blue-600 text-center">
              ✨ Scroll over the logo to resize it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
