import "./PasswordReset.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import { useParams } from "react-router-dom";

const PasswordReset = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, watch } = useForm();
  const { token } = useParams();
  console.log(token);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submission = (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    AxiosInstance.post("api/password_reset/confirm/", {
      password: data.password,
      token: token,
    })
      .then((response) => {
        setShowMessage(true);
      })
      .catch((error) => {
        setErrorMessage("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="container">
      <div className="card">
        {showMessage && (
          <div className="message success">
            Your password has been reset successfully!
          </div>
        )}

        {errorMessage && <div className="message error">{errorMessage}</div>}

        <h1>Set New Password</h1>
        <p className="subtitle">Enter your new password below</p>

        <form onSubmit={handleSubmit(submission)}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", { required: true })}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
