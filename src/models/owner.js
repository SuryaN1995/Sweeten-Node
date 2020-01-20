const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = ({ config }) => {
  const owner = new mongoose.Schema(
    {
      location: {
          lat: mongoose.Types.Decimal128,
          lon: mongoose.Types.Decimal128
      },
      minBudget: 'number',
      maxBudget: 'number',
      designServiceNeed: 'boolean',
      buildServiceNeed: 'boolean',
      optContractors: [{
          contractorId: { type: Schema.Types.ObjectId, ref: 'Contractor' },
          interested: 'boolean',
          awardedProj: 'boolean'
      }],
    },
    { timestamps: true },
  );

  owner.methods.updateFrom = function(payload) {
    const keyOverrides = {};
    Object.entries(payload).forEach(([key, value]) => {
      this[keyOverrides[key] ? keyOverrides[key] : key] = value;
    });
    return this.save();
  };

  const Owner = mongoose.model('Owner', owner);

  return Owner;
};
