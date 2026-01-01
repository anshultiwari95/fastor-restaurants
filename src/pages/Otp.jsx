
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import StatusBar from "../components/StatusBar";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "",""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mobile, login } = useAuth();

  if (!mobile) {
    navigate("/login");
    return null;
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    if (lastInput) lastInput.focus();
  };

  const otpString = otp.join("");
  // Accept 6-digit OTP or hardcoded 123456
  const isValidOtp = otpString.length === 6 || otpString === "123456";

  const handleVerify = async () => {
    try {
      setLoading(true);
      // For hardcoded OTP 123456, still try to get real token from API
      // If API fails, use mock token as fallback
      let token = "mock-token";
      
      try {
        const res = await loginUser(mobile, otpString);
        console.log("Login API Response:", res.data);
        
        // Extract token from response - token is at res.data.data.token
        token = res.data?.data?.token || res.data?.token || token;
        
        if (token && token !== "mock-token") {
          console.log("Login successful, token received:", token.substring(0, 20) + "...");
        } else {
          console.warn("No token found in response");
        }
      } catch (apiError) {
        console.error("API login failed:", apiError);
        console.error("Error response:", apiError.response?.data);
        // If hardcoded OTP, allow proceeding with mock token
        if (otpString !== "123456") {
          throw apiError;
        }
      }
      
      login(token);
      navigate("/home");
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMsg = err.response?.data?.message || "Invalid OTP. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await registerUser(mobile);
      setOtp(["", "", "", "", "", ""]);
      alert("OTP sent successfully!");
    } catch {
      alert("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <StatusBar />
      <div className="px-4 py-8">
        <div className="max-w-sm mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="mb-6 text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95"
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

        {/* Main Content */}
        <h1 className="mb-2 font-bold text-[26px] text-[#1E232C] leading-[130%] tracking-[-0.01em]">
          OTP Verification
        </h1>
        <p className="text-[#8391A1] font-medium text-base mb-8">
          Enter the verification code we just sent on your Mobile Number.
        </p>

        {/* OTP Input Boxes */}
        <div className="flex gap-3 mb-6 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:border-[#FF6D6A] focus:ring-2 focus:ring-[#FF6D6A]/20 transition-all duration-300 bg-[#f7f8f9] hover:border-gray-400 hover:scale-105 active:scale-95"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          disabled={!isValidOtp || loading}
          onClick={handleVerify}
          className="w-full bg-[#FF6D6A] text-white py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF5A57] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-medium mb-4"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Resend Link */}
        <p className="text-center text-sm text-[#1E232C]">
          Didn't received code?{" "}
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-blue-600 font-medium hover:underline transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Resend
          </button>
        </p>
        </div>
      </div>
    </div>
  );
}
