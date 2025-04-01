import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import "./Layout.css";

export const Layout = () => {
  const location = useLocation();

  // Check if the current route is the user profile page
  const isUserProfilePage = location.pathname === "/userprofile";

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <main>{<Outlet />}</main>
      </div>
      {/* Conditionally render the footer */}
      {!isUserProfilePage && <Footer />}
    </div>
  );
};
