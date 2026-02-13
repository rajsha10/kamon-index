import { Router } from "express";
import { getTrustProfile, compareTrustProfiles, getTrustDebug } from "../controllers/trust.controller";

const router = Router();

router.post("/compare", compareTrustProfiles);
router.get("/debug/:wallet", getTrustDebug);
router.get("/:wallet", getTrustProfile);

export default router;
