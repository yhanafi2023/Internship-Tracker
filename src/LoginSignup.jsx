import Login from "./Login";
import Signup from "./Signup";

const LoginSignup = () => {
  return (
    <div>
      <h1>Login / Signup</h1>
      <p>Please login or sign up to access your internship tracker.</p>

      <Login />
      <hr />
      <Signup />
    </div>
  );
};

export default LoginSignup;
