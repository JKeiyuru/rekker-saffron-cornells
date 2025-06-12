const express = require("express");
const {
  handleMpesaPaymentRequest,
  handleMpesaCallback,
} = require("../../controllers/shop/mpesaController");

const router = express.Router();

router.post("/payment", handleMpesaPaymentRequest);  // Handles the STK push request
router.post("/callback", handleMpesaCallback);       // Handles the payment confirmation callback

module.exports = router;
