
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
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto">

        {/* Back Button - 44x44px minimum touch target */}
        <button
          onClick={() => navigate("/login")}
          className="mb-6 sm:mb-8 text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center"
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

        {/* Main Content */}
        <h1 className="mb-2 sm:mb-3 font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E232C] leading-[130%] tracking-[-0.01em]">
          OTP Verification
        </h1>
        <p className="text-[#8391A1] font-medium text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-10">
          Enter the verification code we just sent on your Mobile Number.
        </p>

        {/* OTP Input Boxes - Responsive sizing with 44x44px minimum */}
        <div className="flex gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 justify-center">
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
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border border-gray-300 rounded-lg text-center text-lg sm:text-xl lg:text-2xl font-semibold focus:outline-none focus:border-[#FF6D6A] focus:ring-2 focus:ring-[#FF6D6A]/20 transition-all duration-300 bg-[#f7f8f9] hover:border-gray-400 hover:scale-105 active:scale-95 min-w-[48px] min-h-[48px]"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Verify Button - 44px minimum height */}
        <button
          disabled={!isValidOtp || loading}
          onClick={handleVerify}
          className="w-full bg-[#FF6D6A] text-white py-4 sm:py-5 lg:py-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF5A57] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-medium mb-4 sm:mb-6 text-base sm:text-lg min-h-[48px] sm:min-h-[52px] lg:min-h-[56px]"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Resend Link - 44px minimum touch target */}
        <p className="text-center text-sm sm:text-base text-[#1E232C]">
          Didn't received code?{" "}
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-blue-600 font-medium hover:underline transition-all duration-200 hover:scale-105 active:scale-95 py-2 px-2 min-h-[44px] inline-flex items-center"
          >
            Resend
          </button>
        </p>
        </div>
      </div>
    </div>
  );
}
