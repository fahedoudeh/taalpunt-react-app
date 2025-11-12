import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Wrap any element you want to protect:
 * <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
 */
export default function PrivateRoute({ children }) {
  const { isAuth } = useAuth(); // are we logged in?
  const location = useLocation(); // remember where user tried to go

  if (!isAuth) {
    // Redirect to /login and remember the attempted URL in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
