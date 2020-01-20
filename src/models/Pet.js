const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = ({ config }) => {
  const pet = new mongoose.Schema(
    {
      _id: Schema.Types.ObjectId,
      vetspireId: 'string', // vetspire patient id
      name: 'string',
      species: 'string',
      breed: 'string',
      identification: 'string',
      notes: 'string',
      isActive: 'boolean',
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
  );

  pet.methods.updateFrom = function(payload) {
    const keyOverrides = {};
    Object.entries(payload).forEach(([key, value]) => {
      this[keyOverrides[key] ? keyOverrides[key] : key] = value;
    });
    if (!this._id) this._id = new mongoose.Types.ObjectId();
    return this.save();
  };

  const Pet = mongoose.model('Pet', pet);

  return Pet;
};
