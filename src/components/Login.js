import React, { useState } from 'react';
import '../components_styling/Login.css';

function Login({ onLoginSuccess, close }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://spring-assig-5.onrender.com/auth";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const user = { email, password };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Login failed. Check credentials.");
      }

      const data = await response.json();

      if (data.Status === true) {
        onLoginSuccess(data.Id);  // use the callback passed from App.js
      } else {
        setError("Invalid credentials");
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
      setPassword('');
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
