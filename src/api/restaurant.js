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
  
  if (token && token !== "mock-token") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return api.get("/m/restaurant?city_id=118", config);
};
