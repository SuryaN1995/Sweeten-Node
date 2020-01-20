const dotenv = require('dotenv');
dotenv.config().parsed;

module.exports = {
  port: process.env.PORT || 8000,
  dbUrl: process.env.DB_URL,
  appKey: process.env.APP_KEY,
  appUrl: process.env.APP_URL,

  

  push: {
    serviceAccount: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    },
  },

  vetspire: {
    url: process.env.VETSPIRE_URL,
    apiKey: process.env.VETSPIRE_API_KEY,
  },
};
