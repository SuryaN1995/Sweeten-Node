const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

module.exports = ({ logger, router, config, db }) => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.static('public'));
  app.use(router);

  const start = () => {
    return new Promise((resolve, reject) => {
      const server = app.listen(config.port, (error) => {
        if (error) reject(error);
        const { port } = server.address();
        logger.info(`🤘 API - Port ${port}`);
        resolve(server);
      });
    });
  };

  return { app, start };
};
