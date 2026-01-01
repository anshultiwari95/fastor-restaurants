import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import StatusBar from "../components/StatusBar";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setMobile: setAuthMobile } = useAuth();

  const isValid = mobile.length === 10;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await registerUser(mobile);
      setAuthMobile(mobile);
      navigate("/otp");
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <StatusBar />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto">

        {/* Main Content */}
        <h1 className="mb-2 sm:mb-3 font-bold text-2xl sm:text-3xl lg:text-4xl leading-[130%] tracking-[-0.01em] text-[#1E232C]">
          Enter Your Mobile Number
        </h1>
        <p className="text-[#8391A1] font-medium text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-10">
          We will send you the 4 digit verification code
        </p>

        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
          className="w-full border bg-[#f7f8f9] rounded-[8px] p-4 sm:p-5 text-base sm:text-lg mb-6 sm:mb-8 opacity-100 focus:outline-none focus:border-[#FF6D6A] focus:ring-2 focus:ring-[#FF6D6A]/20 transition-all duration-300 placeholder:font-medium placeholder:text-sm sm:placeholder:text-[15px] text-[#8391A1] hover:border-gray-400 min-h-[48px] sm:min-h-[52px]"
          style={{ fontFamily: 'Urbanist' }}
          placeholder="Enter your mobile number"
          maxLength={10}
        />

        <button
          disabled={!isValid || loading}
          onClick={handleSubmit}
          className="w-full bg-[#FF6D6A] text-white py-4 sm:py-5 lg:py-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF5A57] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-medium text-base sm:text-lg min-h-[48px] sm:min-h-[52px] lg:min-h-[56px]"
        >
          {loading ? "Sending..." : "Send Code"}
        </button>
        </div>
      </div>
    </div>
  );
}
