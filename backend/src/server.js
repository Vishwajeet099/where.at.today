import express from "express";
import cors from "cors";

import eventsRoutes from "./routes/events.js";
import adminRoutes from "./routes/admin/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/events", eventsRoutes);
app.use('/api/admin', adminRoutes);

app.listen(5050, () => {
  console.log("Server running on port 5050");
});