import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { initializeDatabase } from "./src/config/init.js";

const PORT = Number(process.env.PORT || 3000);

try {
  await connectDB();
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
} catch (err) {
  console.error(`Due to error: ${err.message}`);
  process.exit(1);
}
