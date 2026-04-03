export default {
  PORT: process.env.PORT || 5000,
  MAX_HISTORY: 25,
  ALLOW_SAVE_HISTORY: process.env.ALLOW_SAVE_HISTORY !== 'false',
  MONGO_URI: process.env.MONGO_URI,
};
