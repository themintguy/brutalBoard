import { Router } from "express";
import { claimTile } from "../controllers/game/game.controller";

const router = Router();

router.post("/claim", claimTile);

export default router;
