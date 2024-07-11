import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import your auth hook or context

const PrivateRoute = ({ children, allowedRoles }) => {

    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          return decodedToken.role
          ; // Adjust according to your token structure
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      }
      return null;
    };
  
    const userRole = getUserIdFromToken();
    
    localStorage.setItem("User_role",userRole); // Get the authenticated user from your auth context or hook

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

export default PrivateRoute;
