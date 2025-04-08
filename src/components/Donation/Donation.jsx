import React, { useState } from "react";

const KhaltiPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = () => {
    setLoading(true);
    setError(null);

    const requestBody = {
      return_url: "http://localhost:5173/home", // Your home page URL
      website_url: "http://localhost:5173/home",
      amount: 1000,
      purchase_order_id: "order123",
      purchase_order_name: "Khalti Test Product",

    };

    fetch("http://127.0.0.1:8000/khalti-verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.payment_url) {
          // Redirect to Khalti payment page
          window.location.href = data.payment_url;
        } else {
          setError("Payment URL not available.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("There was an error processing the payment.");
        console.error("Verification error", err);
      });
  };

  return (
    <div>
      <h2>Pay with Khalti</h2>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default KhaltiPayment;
