const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

module.exports = ({ config, logger }) => {
  mongoose.connect(config.dbUrl).catch((error) => {
    logger.error(error);
    process.exit();
  });

  const models = {};
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;
    const factory = require(path.join(__dirname, file));
    const model = factory({ config });
    models[model.modelName] = model;
  });

  return {
    ...models,
    mongoose,
  };
};
