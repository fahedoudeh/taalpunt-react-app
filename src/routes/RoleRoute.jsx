import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Usage:
 * <Route path="/teachers" element={
 *   <PrivateRoute>
 *     <RoleRoute allow={["teacher"]}>
 *       <TeachersRoom/>
 *     </RoleRoute>
 *   </PrivateRoute>
 * } />
 */
export default function RoleRoute({ allow = [], children }) {
  const { user } = useAuth();
  const location = useLocation();

  const ok = !!user && (allow.length === 0 || allow.includes(user.role));
  return ok ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location, reason: "forbidden" }} replace />
  );
}
