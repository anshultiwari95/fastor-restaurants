import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRestaurants } from "../api/restaurant";
import { useAuth } from "../auth/AuthContext";
import StatusBar from "../components/StatusBar";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerScrollIndex, setBannerScrollIndex] = useState(0);

  const navigate = useNavigate();
  const { logout, token } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRestaurants(token);
        console.log("Full API Response:", res);
        console.log("Response Data:", res.data);
        console.log("Response Status:", res.status);
        
        if (!res || !res.data) {
          console.error("No response data received");
          setError("No data received from API");
          setLoading(false);
          return;
        }

        const findArrayInObject = (obj, depth = 0) => {
          if (depth > 3) return null;
          if (Array.isArray(obj)) return obj;
          if (typeof obj !== 'object' || obj === null) return null;
          
          const arrayKeys = ['data', 'restaurants', 'items', 'list', 'results', 'result', 'restaurant'];
          for (const key of arrayKeys) {
            if (Array.isArray(obj[key])) {
              return obj[key];
            }
            if (obj[key] && typeof obj[key] === 'object') {
              const found = findArrayInObject(obj[key], depth + 1);
              if (found) return found;
            }
          }
          
          for (const key in obj) {
            if (Array.isArray(obj[key])) {
              return obj[key];
            }
            if (obj[key] && typeof obj[key] === 'object') {
              const found = findArrayInObject(obj[key], depth + 1);
              if (found) return found;
            }
          }
          
          return null;
        };

        let restaurantData = null;
        
        if (Array.isArray(res.data)) {
          restaurantData = res.data;
        } 
        else if (Array.isArray(res.data?.data)) {
          restaurantData = res.data.data;
        } 
        else if (Array.isArray(res.data?.restaurants)) {
          restaurantData = res.data.restaurants;
        }
        else if (Array.isArray(res.data?.items)) {
          restaurantData = res.data.items;
        }
        else if (Array.isArray(res.data?.list)) {
          restaurantData = res.data.list;
        }
        else if (Array.isArray(res.data?.results)) {
          restaurantData = res.data.results;
        }
        else if (Array.isArray(res.data?.result)) {
          restaurantData = res.data.result;
        }
        else if (res.data?.data && typeof res.data.data === 'object') {
          if (Array.isArray(res.data.data.list)) {
            restaurantData = res.data.data.list;
          } else if (Array.isArray(res.data.data.restaurants)) {
            restaurantData = res.data.data.restaurants;
          } else if (Array.isArray(res.data.data.items)) {
            restaurantData = res.data.data.items;
          } else if (Array.isArray(res.data.data.data)) {
            restaurantData = res.data.data.data;
          } else {
            restaurantData = findArrayInObject(res.data.data);
          }
        }
        else if (typeof res.data === 'object') {
          restaurantData = findArrayInObject(res.data);
        }
        
        console.log("Extracted restaurant data:", restaurantData);
        console.log("Restaurant data type:", typeof restaurantData);
        console.log("Is array?", Array.isArray(restaurantData));
        
        if (!restaurantData || !Array.isArray(restaurantData)) {
          console.error("Could not find restaurant array in response.");
          console.error("Full response structure:", JSON.stringify(res.data, null, 2));
          console.error("Response keys:", Object.keys(res.data || {}));
          
          let responseInfo = `Response is ${typeof res.data}`;
          if (res.data && typeof res.data === 'object') {
            responseInfo += ` with keys: ${Object.keys(res.data).join(', ')}`;
            if (res.data.data && typeof res.data.data === 'object') {
              responseInfo += ` | data keys: ${Object.keys(res.data.data).join(', ')}`;
            }
          }
          
          setError(`Invalid response format. ${responseInfo}. Check console for full response structure.`);
          setLoading(false);
          return;
        }

        if (restaurantData.length === 0) {
          console.warn("Restaurant array is empty");
          setRestaurants([]);
          setError(null);
          setLoading(false);
          return;
        }

        const normalized = restaurantData.map((item, index) => {
          if (index === 0) {
            console.log("Sample restaurant item structure:", item);
          }
          
          let imageUrl = item.logo || item.restaurant_image || item.image || item.restaurantImage || item.photo || "";
          
          if (imageUrl === "null" || imageUrl === null) {
            imageUrl = "";
          }
          
          if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:") && !imageUrl.startsWith("/")) {
            imageUrl = "/" + imageUrl;
          }
          
          if (!imageUrl || imageUrl.trim() === "") {
            const foodImages = [
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
              "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
              "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
              "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80",
              "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&q=80",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
              "https://images.unsplash.com/photo-1563379091339-03246963d4c9?w=800&q=80",
              "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
              "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
            ];
            const imageIndex = (item.restaurant_id || item.id || index) % foodImages.length;
            imageUrl = foodImages[imageIndex];
          }
          
          let location = item.address_complete || item.location_name || item.location || item.locationName || item.address || "";
          if (location === "null" || location === null) {
            location = "";
          }
          
          return {
            id: item.restaurant_id || item.id || item.restaurantId || index,
            name: item.restaurant_name || item.name || item.restaurantName || "Unknown Restaurant",
            image: imageUrl,
            rating: item.rating || item.rating_text || item.ratingText || 0,
            price: item.avg_cost_for_two || item.price || item.avgCostForTwo || item.cost_for_two || 0,
            location: location,
            address_complete: item.address_complete,
            cuisine: item.cuisine || item.cuisine_type || item.cuisineType || "",
            offers: item.offers || item.offers_count || 4,
            restaurant_name: item.restaurant_name,
            restaurant_id: item.restaurant_id,
          };
        });
        
        console.log("Normalized restaurants:", normalized);
        setRestaurants(normalized);
        setError(null);
      } catch (err) {
        console.error("Error loading restaurants:", err);
        console.error("Error response:", err.response);
        console.error("Error data:", err.response?.data);
        
        let errorMessage = "Failed to load restaurants";
        
        if (err.response) {
          errorMessage = err.response.data?.message || 
                        err.response.data?.error || 
                        err.response.statusText || 
                        `Server error: ${err.response.status}`;
        } else if (err.request) {
          errorMessage = "No response from server. Check your internet connection.";
        } else {
          errorMessage = err.message || "Failed to load restaurants";
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Failed to Load Restaurants</h2>
          <p className="text-red-500 mb-6 text-sm">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Check browser console for details
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <StatusBar />

      <div className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 sm:pb-3">
        <div className="bg-gray-100 rounded-lg p-4 sm:p-5 lg:p-6 shadow-lg transition-all duration-300 hover:shadow-xl" style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}>
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-xs sm:text-sm text-gray-500">Pre Order From</p>
          </div>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
            Connaught Place
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6">

        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex-1 bg-gray-100 rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-[#8391A1]">Karan</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-800 font-bold">Let's explore this evening</p>
          </div>
          <div className="flex flex-row gap-2 sm:gap-3">
            <button className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 ease-out min-w-[56px] min-h-[56px]">
              <span className="text-xl sm:text-2xl font-bold">%</span>
              <span className="text-xs sm:text-sm text-gray-200">Offers</span>
            </button>
            <button className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 ease-out min-w-[56px] min-h-[56px]">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-xs sm:text-sm mt-1 text-gray-200">Wallet</span>
            </button>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 px-0 sm:px-4">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Your taste</h3>
            <button className="text-sm sm:text-base text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:scale-105 transform py-2 px-2 min-h-[44px] min-w-[44px]">see all &gt;</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { name: "Nik Baker's", location: "Connaught Place, New Delhi", bg: "bg-pink-100" },
              { name: "It's Bake", location: "Connaught Place, New Delhi", bg: "bg-blue-100" },
              { name: "Cakery", location: "Connaught, New Delhi", bg: "bg-gray-100" },
            ].map((item, i) => (
              <div
                key={i}
                className={`shrink-0 w-32 h-40 ${item.bg} rounded-lg p-3 flex flex-col cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 ease-out`}
              >
                <div className="flex-1 bg-white rounded-lg mb-2 flex items-center justify-center overflow-hidden group">
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {i === 0 ? "🍰" : i === 1 ? "🧁" : "🎂"}
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-800 mb-1">{item.name}</p>
                <p className="text-xs text-gray-500">{item.location}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 sm:mb-8 relative h-56 sm:h-64 lg:h-72 overflow-visible">
          <div 
            className="flex overflow-x-auto h-full snap-x snap-mandatory scrollbar-hide px-4 sm:px-6"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
            onScroll={(e) => {
              const scrollLeft = e.target.scrollLeft;
              const itemWidth = e.target.clientWidth - 16;
              const index = Math.round(scrollLeft / itemWidth);
              setBannerScrollIndex(Math.min(Math.max(index, 0), 3));
            }}
          >
            {[
              {
                title: "VEGGIE FRIENDLY EATERIES",
                buttonText: "TRY NOW",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
                emoji: "🥗"
              },
              {
                title: "SWEET DESSERTS",
                buttonText: "ORDER NOW",
                image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
                emoji: "🍰"
              },
              {
                title: "FRESH SEAFOOD",
                buttonText: "DISCOVER",
                image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
                emoji: "🐟"
              },
              {
                title: "ITALIAN SPECIALS",
                buttonText: "Taste Now",
                image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80",
                emoji: "🍝"
              }
            ].map((banner, index) => (
              <div
                key={index}
                className="shrink-0 h-full relative rounded-xl overflow-hidden snap-center mr-3"
                style={{
                  width: 'calc(100vw - 2rem)',
                  minWidth: 'calc(100vw - 2rem)',
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always'
                }}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    objectPosition: 'center center',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
                <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8 z-10">
                  <div className="text-white">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 drop-shadow-lg">{banner.title}</h3>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-h-[44px] sm:min-h-[48px]">
                      {banner.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i - 1 === bannerScrollIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-4 sm:mb-6 px-0 sm:px-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Popular Ones</h3>
          {restaurants.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No restaurants found
            </div>
          )}
          <div className="space-y-3">
        {restaurants.map((r) => (
          <div
            key={r.id}
                onClick={() => navigate(`/restaurant/${r.id}`, { state: r })}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out shadow-sm group"
              >
                <div className="flex items-stretch">
                  <div className="w-24 sm:w-28 lg:w-32 shrink-0 bg-gray-200 relative rounded-l-lg overflow-hidden self-stretch">
                    {r.image ? (
            <img
              src={r.image}
              alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          const foodImages = [
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
                            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
                            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
                            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
                            "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
                            "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80",
                            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
                            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
                          ];
                          const randomIndex = Math.floor(Math.random() * foodImages.length);
                          e.target.src = foodImages[randomIndex];
                        }}
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
                        alt={r.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-3 sm:p-4 lg:p-5 flex flex-col justify-center">
                    <h2 className="font-bold text-base sm:text-lg lg:text-xl mb-0.5 sm:mb-1 text-gray-800">{r.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-1.5">
                      {r.cuisine || "Cakes, Pastry, Pastas"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
                      {(r.location && r.location !== "null" && r.location.trim() !== "") 
                        ? r.location 
                        : "Connaught Place, New Delhi"}
                    </p>
                    <div className="flex items-center gap-1 mb-1.5">
                      <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-orange-600 font-medium">
                        {r.offers || 4} Offers trending
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-xs font-semibold text-gray-700">{r.rating || 4.5}</span>
                        <span className="text-xs text-gray-500 ml-1">Popularity</span>
                      </div>
                      <div className="text-xs text-gray-600 text-right">
                        <div className="font-semibold">${r.price || 200}</div>
                        <div className="text-gray-500">Cost for two</div>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center pb-4 sm:pb-6 px-4">
          <button
            onClick={logout}
            className="text-red-500 text-sm sm:text-base font-medium hover:text-red-600 transition-all duration-200 hover:scale-105 active:scale-95 py-2 px-4 min-h-[44px] min-w-[44px]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
