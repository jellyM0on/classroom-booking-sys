import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../configs/firebase";

function Login({
  email,
  password,
  error,
  setEmail,
  setPassword,
  handleSubmit,
}) {
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
              <div className={`form-field ${error ? "error-field" : ""}`}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className={`form-field ${error ? "error-field" : ""}`}>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="transparent-btn">Forgot password?</button>
            </div>
            <button class="submit-btn" type="submit">
              Sign In
            </button>
            {error && <p className="error-msg">Invalid Credentials!</p>}
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
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      sessionStorage.setItem("token", user.accessToken);
      sessionStorage.setItem("email", user.email);
      navigate("/");
    } catch (err) {
      console.error("Error signing in:", err);
      setError(err.message);
    }
  };

  return (
    <Login
      email={email}
      password={password}
      error={error}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
}
