import { Router } from "express";
import { getTrustProfile } from "../controllers/trust.controller";

const router = Router();

router.get("/:wallet", getTrustProfile);

export default router;
