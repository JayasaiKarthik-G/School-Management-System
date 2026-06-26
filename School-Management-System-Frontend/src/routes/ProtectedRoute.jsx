import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function ProtectedRoute({ children }) {
  const authState = useSelector((state) => state.auth);
  if (!authState?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
