const express = require("express");
const container = require("../container.js");
const HttpError = require("../utils/HttpError");
const Helper = require("../helper/helperClass");

module.exports = () => {
  const {
    db: { Owner, LoginInfo, Contractor }
  } = container.cradle;

  const router = express.Router();

  router.patch("/requirement", async (req, res, next) => {
    try {
      let owner = await validateUser(req.headers);
      if (owner instanceof HttpError) return next(owner);
      await owner.updateFrom({ ...req.body });
      res.send({
        message: "Owner requirements updated"
      });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.post("/register", async (req, res, next) => {
    try {
      var loginInfo = await LoginInfo.findOne({ ...req.body });
      if (!loginInfo) {
        loginInfo = new LoginInfo({ ...req.body });
        await loginInfo.save();
      }
      var owner = await Owner.findOne({ ownerId: loginInfo._id });
      if (owner) return next(new HttpError("Owner already exist", 409));
      owner = new Owner({
        ownerId: loginInfo._id
      });
      await owner.save();
      res.status(201);
      res.send({ message: "Owner created" });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/login", async (req, res, next) => {
    try {
      var loginInfo = await LoginInfo.findOne({ ...req.body });
      if (!loginInfo) {
        return next(new HttpError("User not exist", 400));
      }
      res.send({
        ownerId: loginInfo._id
      });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/forgot", async (req, res, next) => {
    try {
      let loginInfo = await LoginInfo.findOne({
        ...req.body
      });
      if (!loginInfo) return next(new HttpError("User not exist", 400));
      res.send({ password: loginInfo.password });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/getContractors", async (req, res, next) => {
    try {
      let owner = await validateUser(req.headers);
      if (owner instanceof HttpError) {
        return next(owner);
      }
      let helper = new Helper();
      let contractorList = await Contractor.find(null, {
        contractorId: true,
        location: true,
        minBudget: true,
        maxBudget: true,
        offersDesignService: true,
        offersBuildService: true,
        optOwners: true,
        projectsTaken: true
      });
      if (!contractorList || contractorList.length <= 0) {
        res.send({
          message: "No contractor exists, please check after some time"
        });
      }
      let matchingContractor = [];
      let optContractors = [];
      contractorList.forEach(contractor => {
        if (
          contractor.minBudget >= owner.minBudget &&
          contractor.maxBudget <= owner.maxBudget
        ) {
          if (owner.designServiceNeed || owner.buildServiceNeed) {
            if (
              owner.designServiceNeed == contractor.offersDesignService ||
              owner.buildServiceNeed == contractor.offersBuildService
            ) {
              if (
                contractor.projectsTaken.length < 3 &&
                helper.getDistance(contractor.location, owner.location) <= 25
              )
                matchingContractor.push(contractor);
            }
          } else {
            if (
              contractor.projectsTaken.length < 3 &&
              helper.getDistance(contractor.location, owner.location) <= 25
            ) {
              matchingContractor.push(contractor);
            }
          }
        }
        if (!matchingContractor || matchingContractor.length <= 0) {
          return res.send({
            message: "No contractor exists, please check after some time"
          });
        }

        matchingContractor.forEach(contract => {
          let obj = {
            contractorId: contract.contractorId
          };
          optContractors.push(obj);
        });
      });
      await owner.updateFrom({ optContractors });
      res.send(JSON.stringify(matchingContractor));
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.patch("/contractorSelection", async (req, res, next) => {
    try {
      let owner = await validateUser(req.headers);
      if (owner instanceof HttpError) {
        return next(owner);
      }
      let optContractors = req.body;
      owner.optContractors = optContractors;
      owner.save();
      res.send();
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.patch("/selected", async (req, res, next) => {
    try {
      let owner = await validateUser(req.headers);
      if (owner instanceof HttpError) {
        return next(owner);
      }
      let selectedContractor = req.body;
      owner.optContractors.forEach(obj =>{
        if(obj.contractorId == selectedContractor.contractorId){
          obj.awardedProj = selectedContractor.awardedProj;
        }
      })
      owner.save();
      res.send({"message":"Contractor is selected"});
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

  async function validateUser(headers) {
    try {
      let { userid: _id } = headers;
      if (!_id) {
        return new HttpError("User authentication failed", 401);
      }
      let loginInfo = await LoginInfo.findOne({ _id });
      if (!loginInfo) return new HttpError("User not exists", 400);
      var owner = await Owner.findOne({ ownerId: loginInfo._id });
      if (!owner) {
        return new HttpError("Owner not found", 404);
      }
      return owner;
    } catch (error) {
      return new HttpError(error);
    }
  }

  return router;
};
