const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AZ_JqNEnvSzh_UGEdC5vY1URsP9E76HXtbiR9v75VPmFAUtIcK67O-hUOzMP4951MmWTiLyyWY2U7P4y",
  client_secret: "ECemqQeKt1kJJo_HLNqAN1ajOmgsxHYz71kX-bshJfxpPx2YvAh1pKkIYmYcmzW9K776yfaWoBgCHFQu",
});

module.exports = paypal;