// helpers/mpesa.js
const axios = require("axios");

let token; // Store the access token globally

const createToken = async () => {
  const secret = "sGRyCIXbbsCmMhFrjiljAW36IenetFytMfNnGGfVXH1QhAzgcFmUXHmN1RBkKGKX"; // Replace with your M-Pesa consumer secret
  const consumer = "qnoJN723IiD1nen7v4UqR6TOyVYp768O1RlDZUZ628V6s1AW"; // Replace with your M-Pesa consumer key
  const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    );
    token = response.data.access_token;
    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};

const stkPush = async (phone, amount, callbackUrl) => {
  const shortCode = 174379; // Replace with your M-Pesa business shortcode
  const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; // Replace with your M-Pesa passkey

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
  const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone.substring(1)}`, // Ensure phone number starts with 254
    PartyB: shortCode,
    PhoneNumber: `254${phone.substring(1)}`,
    CallBackURL: callbackUrl,
    AccountReference: "E-Commerce Payment",
    TransactionDesc: "Payment for goods",
  };

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      data,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error initiating STK Push:", error);
    throw error;
  }
};

module.exports = { createToken, stkPush };