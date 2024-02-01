import { Link } from "react-router-dom";

function Auth() {
  return (
    <div className="Auth">
      <Link to='/login' className="login-link">Login</Link>
    </div>
  )
}

export default Auth;