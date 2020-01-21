const express = require("express");
const container = require("../container.js");

module.exports = () => {
  const { config } = container.cradle;

  const router = express.Router();



  return router;
};