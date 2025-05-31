import React, { useState } from 'react';
import Login from '../components/Login';
import '../components_styling/Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedUpUser, setSignedUpUser] = useState(null);  // to track signup success

  const API_BASE_URL = "http://localhost:8080/auth";

  async function signup(user) {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }
      const data = await response.json();
      setSignedUpUser(data);  // set state on success to show Login
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  // On form submit, call signup with the user data
  const handleSignup = (e) => {
    e.preventDefault();
    const user = { email, password };
    signup(user);
  };

  // If signup successful, render Login component and pass data
  if (signedUpUser) {
    return <Login setDisplayADD={signedUpUser} />;
  }

  // Else show signup form
  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
