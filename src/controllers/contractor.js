const express = require("express");
const container = require("../container.js");
const Helper = require("../helper/helperClass");

module.exports = () => {
  const {
    config,
    db: { Contractor, LoginInfo }
  } = container.cradle;

  const router = express.Router();

  router.patch("/requirement", async (req, res, next) => {
    try {
      let contractor = validateUser(req.headers);
      if (contractor instanceof HttpError) {
        return next(contractor);
      }
      await contractor.updateFrom({ ...req.body });
      res.send({
        message: "Contractor requirement updated"
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
      var contractor = await Contractor.findOne({
        contractorId: loginInfo._id
      });
      if (contractor)
        return next(new HttpError("Contractor already exist", 409));
      contractor = new Contractor({
        contractorId: loginInfo._id
      });
      await contractor.save();
      res.status(201);
      res.send({
        message: "Contractor created"
      });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/login", async (req, res, next) => {
    try {
      var loginInfo = await LoginInfo.findOne({ ...req.body });
      if (!loginInfo) {
        return next(new HttpError("Contractor not exist", 400));
      }

      res.send({
        contractorId: loginInfo._id
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
      if (!loginInfo) return next(new HttpError("Contractor not exist", 400));
      res.send({ password: loginInfo.password });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/getOwners", async (req, res, next) => {
    try {
      let contractor = await validateUser(req.headers);
      if (contractor instanceof HttpError) {
        return next(contractor);
      }
      let helper = new Helper();
      let ownerList = await Owner.find(null, {
        ownerId: true,
        location: true,
        minBudget: true,
        maxBudget: true,
        buildServiceNeed: true,
        designServiceNeed: true,
        optContractors: true
      });
      if (!ownerList || ownerList.length <= 0) {
        res.send({
          message: "No projects exists, please check after some time"
        });
      }
      let matchingProject = [];
      ownerList.forEach(owner => {
        if (
          owner.minBudget >= contractor.minBudget &&
          owner.maxBudget <= contractor.maxBudget
        ) {
          if (owner.designServiceNeed || owner.buildServiceNeed) {
            if (
              owner.designServiceNeed == contractor.offersDesignService ||
              owner.buildServiceNeed == contractor.offersBuildService
            ) {
              if (
                contractor.projectsTaken.length < 3 &&
                helper.getDistance(owner.location, contractor.location) <= 25
              )
                matchingProject.push(owner);
            }
          } else {
            if (
              contractor.projectsTaken.length < 3 &&
              helper.getDistance(owner.location, contractor.location) <= 25
            ) {
              matchingProject.push(owner);
            }
          }
        }
        if (!matchingProject || matchingProject.length <= 0) {
          return res.send({
            message: "No projects exists, please check after some time"
          });
        }

        matchingProject.forEach(owner => {
          let obj = {
            ownerId: owner.ownerId
          };
        });
      });
      await contractor.updateFrom({ matchingProject });
      res.send(JSON.stringify(matchingProject));
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.patch("/projectSelection", async (req, res, next) => {
    try {
      let contractor = await validateUser(req.headers);
      if (contractor instanceof HttpError) {
        return next(contractor);
      }
      let optOwners = req.body;
      contractor.optOwners = optOwners;
      contractor.save();
      res.send();
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.patch("/selected", async (req, res, next) => {
    try {
      let contractor = await validateUser(req.headers);
      if (contractor instanceof HttpError) {
        return next(contractor);
      }
      if (!contractor.projectsTaken.length < 3) {
        return res.send({ message: "Max limit reached" });
      }
      let selectedProj = req.body;
      let owner = Owner.findOne({ ownerId: selectedProj.ownerId });
      let cont = owner.optContractors.find(opt => {
        opt.contractorId == contractor.contractorId;
      });
      if (cont.interested && cont.awardedProj) {
        contractor.projectsTaken.push(owner.ownerId);
      }
      contractor.save();
      res.send({ message: "Project taken" });
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      let contractors = await Contractor.find();
      res.send(contractors);
    } catch (error) {
      return next(new HttpError(error));
    }
  });

  router.post("/completedOrOut",async (req, res, next) => {
    try {
      let contractor = await validateUser(req.headers);
      if (contractor instanceof HttpError) {
        return next(contractor);
      }
      let owners = contractor.optOwners.filter(({owner:{ownerId}}) => ownerId != req.body.ownerId);
      let projects = contractor.projectsTaken.filter(({proj:{ownerId}}) => ownerId != req.body.ownerId);
      contractor.projectsTaken = projects;
      contractor.optOwners = owners;
      contractor.save();
      let owner = await Owner.findOne({ownerId:req.body.ownerId});
      owner.optContractors.forEach(({cont:{contractorId}}) => {
          if(contractorId == contractor.contractorId){
            cont.awardedProj = false;
          }
      })
      owner.save();
      res.send();
    } catch (error) {
      return next(new HttpError(error));
    }
  });



  async function validateUser(headers) {
    try {
      let { userid: _id } = req.headers;
      if (!_id) {
        return new HttpError("User authentication failed", 401);
      }
      let loginInfo = await LoginInfo.findOne({ _id });
      if (!loginInfo) return new HttpError("User not exists", 400);
      var contractor = await Contractor.findOne({
        contractorId: loginInfo._id
      });
      if (!contractor) {
        return new HttpError("Contractor not found", 404);
      }
      return contractor;
    } catch (error) {
      return new HttpError(error);
    }
  }

  return router;
};
