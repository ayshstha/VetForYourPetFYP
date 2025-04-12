import React, { useState } from "react";

const KhaltiPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("Token");

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate amount
      const donationAmount = parseInt(amount);
      if (!donationAmount || donationAmount < 10) {
        throw new Error("Please enter a valid amount (minimum Rs. 10)");
      }

      const response = await fetch("http://127.0.0.1:8000/khalti-verify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          return_url: window.location.origin + "/home", // Redirect to home after success

          website_url: window.location.origin,
          amount: donationAmount * 100, // Convert to paisa
          purchase_order_id: "order_" + Date.now(),
          purchase_order_name: "Donation",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Payment initiation failed");
      }

      const data = await response.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Payment error:", err);
    }
  };

  return (
    <div className="donation-container">
      <h2>Make a Donation</h2>

      <div className="donation-form">
        <label htmlFor="amount">Enter Donation Amount (Rs.)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter amount in rupees"
          min="10"
          step="10"
        />

        <button
          onClick={handlePayment}
          disabled={loading || !amount}
          className="donate-button"
        >
          {loading ? "Processing..." : `Donate Rs. ${amount || 0}`}
        </button>

        {error && <div className="error-message">{error}</div>}

        <p className="note">Minimum donation amount: Rs. 10</p>
      </div>
    </div>
  );
};

export default KhaltiPayment;