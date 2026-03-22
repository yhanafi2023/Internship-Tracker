import { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        alert("Account created!");
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

      <form onSubmit={handleSignup}>
        <label>Email:</label><br />
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />

        <label>Password:</label><br />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
