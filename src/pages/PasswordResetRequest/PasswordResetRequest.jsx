import "./PasswordResetRequest.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance.jsx";


const PasswordResetRequest = () => {
   const navigate = useNavigate();
   const { handleSubmit, register } = useForm();
   const [showMessage, setShowMessage] = useState(false);
  
    
   const submission = (data) => {
     AxiosInstance.post("api/password_reset/", {
       email: data.email,
     })
       .then((response) => {
         setShowMessage(true)
       })
   
   };
  return (
    <div className="container">
      <div className="card">
        {showMessage && (
          <div className="message">
            If your email exists, you have received an email with instructions
            for resetting the password.
          </div>
        )}

        <h1>Reset Password</h1>
        <p className="subtitle">Enter your email to reset your password</p>

        <form onSubmit={handleSubmit(submission)}>
          {" "}
          {/* ✅ Wrap handleSubmit around submission */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })} // ✅ Use react-hook-form's register
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Send Reset Link
          </button>
        </form>

        <div className="back-link">
          Remember your password? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
