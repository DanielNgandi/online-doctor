import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

   if (!user || user.role?.toLowerCase() !== "admin") {
     return <Navigate to="/login" replace />;
  }
//   {user?.role === 'admin' && (
//   <Link to="/admin/profile" className="nav-link">
//     Admin Profile
//   </Link>
// )}

  // Otherwise render admin content
  return children;
}
export default AdminRoute;
