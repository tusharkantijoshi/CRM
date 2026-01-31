import { Box } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";

const PrivateRoute: React.FC = () => {
  // Check for authentication token
  // In a real app, you might want to validate the token or use a context
  const token = localStorage.getItem("token");

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return token ? (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <Box
        component="main"
        sx={{ flexGrow: 1, overflow: "auto", bgcolor: "background.default" }}
      >
        <Outlet />
      </Box>
    </Box>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
