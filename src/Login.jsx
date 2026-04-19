import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("${URL}/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.status === 429) {
            alert("Too many login attempts. Please try again later.");
            return;
        }

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("user", JSON.stringify({ email, is_admin: data.is_admin }));
            window.location.href = "/tracker";
        } else {
            alert("Invalid credentials");
        }
    } catch (err) {
        alert("Something went wrong. Please try again.");
    }
};


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
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
          placeholder="Enter your password"
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

