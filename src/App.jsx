import './App.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home.jsx';
import AboutUs from './AboutUs.jsx';
import ContactUs from './ContactUs.jsx';
import LoginSignup from './LoginSignup.jsx';
import JobTracker from './JobTracker.jsx';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("user");
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <div className="App">
      <nav>
        <div className="nav-left">
          <Link to="/"><button>Home</button></Link>
          <Link to="/about"><button>About Us</button></Link>
          <Link to="/contact"><button>Contact Us</button></Link>
          <Link to="/tracker"><button>Job Tracker</button></Link>
        </div>
        <div className="nav-right">
          {isLoggedIn 
            ? <button onClick={handleLogout}>Logout</button>
            : <Link to="/login"><button>Login/Signup</button></Link>
          }
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/tracker" element={<PrivateRoute><JobTracker /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default App;