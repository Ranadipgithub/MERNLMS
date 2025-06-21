import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyOtpService, resendOtpService } from "@/services";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.userEmail;
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      navigate("/auth");
    }
  }, [userEmail, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const data = await verifyOtpService({ userEmail, otp });
      if (data.success) {
        setMessage(data.message || "Email verified! Redirecting to login...");
        setTimeout(() => {
          navigate("/auth");
        }, 1500);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const data = await resendOtpService({ userEmail });
      if (data.success) {
        setMessage("OTP resent. Check your email (and spam/junk folder).");
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!userEmail) return null; // avoid rendering if redirect is in progress

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
      <p className="mb-1">
        We sent an OTP to: <strong>{userEmail}</strong>
      </p>
      <p className="mb-4 text-sm text-gray-600">
        If you dont see the email, please check your spam/junk folder.
      </p>
      <form onSubmit={handleVerify}>
        <label htmlFor="otp" className="block mb-1">Enter OTP:</label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full mb-4 p-2 border rounded"
          placeholder="6-digit OTP"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full p-2 text-white rounded mb-2"
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
      <button
        onClick={handleResend}
        disabled={loading}
        className="w-full p-2 bg-gray-200 text-black rounded"
      >
        {loading ? "Resending..." : "Resend OTP"}
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
