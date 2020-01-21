const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = ({ config }) => {
  const ownerInfo = new mongoose.Schema(
    {
      userName: { type: "string", required: true },
      password: { type: "string", required: true },
    },
    { timestamps: true },
  );

  ownerInfo.methods.updateFrom = function(payload) {
    Object.entries(payload).forEach(([key, value]) => {
      this[keyOverrides[key] ? keyOverrides[key] : key] = value;
    });
    return this.save();
  };

  const OwnerInfo = mongoose.model("OwnerInfo", ownerInfo);

  return OwnerInfo;
};
