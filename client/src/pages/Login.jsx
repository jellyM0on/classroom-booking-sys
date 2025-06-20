import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingErrorMessage from "../components/FloatingErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { auth } from "../configs/firebase";

function Login({
  email,
  password,
  error,
  setEmail,
  setPassword,
  handleSubmit,
  handleForgotPassword, // new prop added
  loading,
}) {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800); // You can reduce/increase time

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return (
      <div className="fullscreen-spinner">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main id="login-page">
      <div className="login-container">
        <div className="login-form">
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p className="subtext">Please enter your details to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              <div
                className={`form-field ${error.message ? "error-field" : ""}`}
              >
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div
                className={`form-field ${error.message ? "error-field" : ""}`}
              >
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="button"
                className="transparent-btn"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
            {error.message && (
              <FloatingErrorMessage
                key={error.timestamp}
                message={error.message}
              />
            )}
          </form>
        </div>
      </div>
      <div className="login-image" />
    </main>
  );
}

export default function LoginContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // add useState for loading
  const [error, setError] = useState({ message: "", timestamp: null });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError({ message: "", timestamp: null });
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      sessionStorage.setItem("token", user.accessToken);
      sessionStorage.setItem("email", user.email);
      navigate("/");
    } catch (err) {
      console.error("Error signing in:", err);
      setError({
        message: err.message || "Login failed",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // add forgot password method
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Login
      email={email}
      password={password}
      error={error}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      handleForgotPassword={handleForgotPassword}
      loading={loading}
    />
  );
}
