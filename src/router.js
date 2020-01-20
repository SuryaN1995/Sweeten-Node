const bodyParser = require("body-parser");
const express = require("express");
const { partialRight } = require("ramda");

const controller = require("./utils/createController");

const { errorHandler } = require("./utils/errorHandler.js");

module.exports = ({ config, logger }) => {
  const router = express.Router();

  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());

  router.use("/", controller("index"));

  // 404, should be the last route.
  router.get("*", function(req, res) {
    res.status(404).send();
  });

  router.use(partialRight(errorHandler, [logger, config]));
  return router;
};
