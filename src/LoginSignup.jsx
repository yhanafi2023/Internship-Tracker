import Login from "./Login";
import Signup from "./Signup";

const LoginSignup = () => {
  return (
    <div className="auth-container">
      <div className="auth-section">
        <Login />
      </div>
      <div className="auth-divider">
        <span>OR</span>
      </div>
      <div className="auth-section">
        <Signup />
      </div>
    </div>
  );
};

export default LoginSignup;
