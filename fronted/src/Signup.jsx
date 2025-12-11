import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import "./Auth.css";

export function Signup({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authBox">
        <h1>SigmaGPT</h1>
        <p className="authSubtitle">Create your account</p>

        {error && <div className="authError">{error}</div>}

        <form onSubmit={handleSignup} className="authForm">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="authButton">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="authToggle">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} className="authLink">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
