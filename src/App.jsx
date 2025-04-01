import React, { useState } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import Home from "./pages/Homepage/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Rescue from "./pages/Rescue/PetRescue";
import Appointment from "./pages/Appointments/Appointment";
import Blog from "./pages/Blog/Blog";
import Adoption from "./pages/Adoption/Adoption";
import Userprofile from "./pages/Userprofile/Userprofile";
import ProtectedRoute from "./components/ProtectedRoutes";
import PasswordResetRequest from "./pages/PasswordResetRequest/PasswordResetRequest";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import AdminDashboard from "./pages/AdminDashBoard/AdminDashBoard"; // Import AdminDashboard

function App() {
  const [token, setToken] = useState(localStorage.getItem("Token"));

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes (Redirect logged-in users) */}
        <Route
          path="/login"
          element={
            !localStorage.getItem("Token") ? <Login /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/register"
          element={
            !localStorage.getItem("Token") ? (
              <Register />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/request/password_reset"
          element={<PasswordResetRequest />}
        />
        <Route path="/password-reset/:token" element={<PasswordReset />} />

        {/* Protected Routes (Only accessible when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/rescue" element={<Rescue />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/userprofile" element={<Userprofile />} />
          </Route>
        </Route>

        {/* Admin Protected Route */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
