const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = ({ config }) => {
  const loginInfo = new mongoose.Schema(
    {
      userName: { type: "string", required: true, unique: true },
      password: { type: "string", required: true },
    },
    { timestamps: true },
  );

  loginInfo.methods.updateFrom = function(payload) {
    Object.entries(payload).forEach(([key, value]) => {
      this[keyOverrides[key] ? keyOverrides[key] : key] = value;
    });
    return this.save();
  };

  const LoginInfo = mongoose.model("LoginInfo", loginInfo);

  return LoginInfo;
};
