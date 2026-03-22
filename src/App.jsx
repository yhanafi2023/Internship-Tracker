import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import AboutUs from './AboutUs.jsx';
import ContactUs from './ContactUs.jsx';
import LoginSignup from './LoginSignup.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';

const App = () => {

  return (
    <div className="App">
      <nav>
        <div className="nav-left">
          <Link to="/"><button>Home</button></Link>
          <Link to="/about"><button>About Us</button></Link>
          <Link to="/contact"><button>Contact Us</button></Link>
        </div>
        <div className="nav-right">
          <Link to="/login"><button>Login/Signup</button></Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </div>
  )
}

export default App