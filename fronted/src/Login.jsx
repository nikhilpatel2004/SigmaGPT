import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import "./Auth.css";

export function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authBox">
        <h1>SigmaGPT</h1>
        <p className="authSubtitle">Welcome back</p>

        {error && <div className="authError">{error}</div>}

        <form onSubmit={handleLogin} className="authForm">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="authButton">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="authDivider">
          <span>or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="googleButton"
        >
          <i className="fa-brands fa-google"></i> Sign in with Google
        </button>

        <p className="authToggle">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitchToSignup} className="authLink">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
