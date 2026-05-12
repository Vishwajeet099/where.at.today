import express from "express";
import cityRoutes from "./city.js";
import venueRoutes from "./venue.js";
import categoryRoutes from "./category.js";
import tagRoutes from "./tags.js";
import organizerRoutes from "./organizer.js";
import performerRoutes from "./performer.js";
import ticketSellerRoutes from "./ticketSeller.js";

const router = express.Router();

router.use("/cities", cityRoutes);
router.use("/venues", venueRoutes);
router.use("/categories", categoryRoutes);
router.use("/tags", tagRoutes);
router.use("/organizers", organizerRoutes);
router.use("/performers", performerRoutes);
router.use("/ticket-sellers", ticketSellerRoutes);

export default router;