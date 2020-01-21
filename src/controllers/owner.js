const express = require("express");
const container = require("../container.js");
const HttpError = require("../utils/HttpError");

module.exports = () => {
  const {
    config,
    db: { Owner, OwnerInfo }
  } = container.cradle;

  const router = express.Router();

  router.patch("/requirement", async (req, res, next) => {
    try {
      let ownerInfo = await OwnerInfo.findOne({ _id: req.headers.ownerId });
      if (!ownerInfo) return next(new HttpError("Owner not exists", 404));
      var owner = await Owner.findOne({ ownerId: ownerInfo._id });
      if (!owner) {
        return next(new HttpError("Owner not found", 404));
      }
      await owner.updateFrom({ ...req.body });
      res.send("Owner requirements updated");
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.post("/register", async (req, res, next) => {
    try {
      var owner = await OwnerInfo.findOne({ ...req.body });
      if (!owner) {
        owner = new OwnerInfo({ ...req.body });
        await owner.save();
      }
      var ownerInfo = await Owner.findOne({ ownerId: Owner._id });
      if (ownerInfo) return next(new HttpError("Owner already exist", 404));
      ownerInfo = new Owner({
        ownerId: owner._id
      });
      await ownerInfo.save();
      res.send("Owner created");
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/login", async (req, res, next) => {
    try {
      var owner = await OwnerInfo.findOne({ ...req.body });
      if (!owner) {
        return next(new HttpError("Owner not exist", 404));
      }
      res.send({
        ownerId: owner._id
      });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/forgot", async (req, res, next) => {
    try {
      let ownerInfo = await OwnerInfo.findOne({
        ...req.body
      });
      if (!ownerInfo) return next(new HttpError("Owner not exist", 402));
      res.sendStatus(204).send({ password: ownerInfo.password });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      let owners = await Owner.find();
      res.send(owners);
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  return router;
};
