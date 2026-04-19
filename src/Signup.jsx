import { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      if (response.status === 429) {
        alert("Too many signup attempts. Please try again later.");
        return;
      }
      const data = await response.json();

      if (data.success) {
    alert("Account created!");
    window.location.href = "/login";  

        
      } else {
        alert("Error creating account");
      }

    } catch (error) {
      alert("Server not connected yet");
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSignup} className="auth-form">
        <label>Email:</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />

        <label>Password:</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Create a password"
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
