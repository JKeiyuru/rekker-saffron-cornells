const axios = require("axios");

// Load M-Pesa credentials from environment variables
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const passkey = process.env.MPESA_PASSKEY;
const shortCode = process.env.MPESA_SHORTCODE || "174379"; // fallback to sandbox default

const createToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  return response.data.access_token;
};

const stkPush = async (token, phone, amount, callbackUrl) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const date = new Date();
  const timestamp =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0");

  const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone.substring(1)}`,
    PartyB: shortCode,
    PhoneNumber: `254${phone.substring(1)}`,
    CallBackURL: callbackUrl,
    AccountReference: "Mpesa Test",
    TransactionDesc: "Testing stk push",
  };

  const response = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

module.exports = { createToken, stkPush };
