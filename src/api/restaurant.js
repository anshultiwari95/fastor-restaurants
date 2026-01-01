import axios from "axios";

const api = axios.create({
  baseURL: "https://staging.fastor.ai/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchRestaurants = (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  // Add auth token if available and not mock
  if (token && token !== "mock-token") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Fix the double ampersand in URL - use single &
  return api.get("/m/restaurant?city_id=118", config);
};
