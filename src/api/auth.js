import axios from "axios";

const api = axios.create({
  baseURL: "https://staging.fastor.ai/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (mobile) => {
  return api.post("/pwa/user/register", {
    phone: mobile,
  });
};

export const loginUser = (mobile, otp) => {
  return api.post("/pwa/user/login", {
    phone: mobile,
    otp,
  });
};
