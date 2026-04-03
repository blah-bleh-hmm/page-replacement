import 'dotenv/config';
import config from './config/index.js';
import connectDB from './config/db.js';
import app from './app.js';

connectDB();

const server = app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

export { app };
export default server;
