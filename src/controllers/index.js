const express = require("express");
const container = require("../container.js");
const html = require("html")

module.exports = () => {
  const { config } = container.cradle;

  const router = express.Router();

  router.get("/", function(req, res) {
    res.sendFile(__dirname + "/html/index.html");
  });

  return router;
};
