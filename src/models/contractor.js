const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = ({ config }) => {
  const contractor = new mongoose.Schema(
    {
      contractorId: 'string',
      location: {
          lat: mongoose.Types.Decimal128,
          lon: mongoose.Types.Decimal128
      },
      minBudget: 'number',
      maxBudget: 'number',
      offersDesignService: 'boolean',
      offersBuildService: 'boolean',
      optOwners: [{
          ownerId: { type: Schema.Types.ObjectId, ref: 'Owner' },
          interested: 'boolean'
      }],
    },
    { timestamps: true },
  );

  contractor.methods.updateFrom = function(payload) {
    const keyOverrides = {};
    Object.entries(payload).forEach(([key, value]) => {
      this[keyOverrides[key] ? keyOverrides[key] : key] = value;
    });
    return this.save();
  };

  const Contractor = mongoose.model('Contractor', contractor);

  return Contractor;
};
