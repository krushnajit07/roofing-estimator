import express from 'express';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import configRoutes from "./routes/configRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Roof estimator API is running'
  });
});

app.use("/api/config", configRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});