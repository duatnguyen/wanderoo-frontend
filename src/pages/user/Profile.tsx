import React from "react";
import { Navigate } from "react-router-dom";

// This is kept for backwards compatibility, but now redirects to the new structure
const Profile: React.FC = () => {
  return <Navigate to="/user/profile" replace />;
};

export default Profile;
