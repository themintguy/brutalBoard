import {  Router } from "express";
import { getGameState } from "../controllers/game/state.controller";
import { joinUser } from "../controllers/users/user.controller";


const router = Router();


router.get("/state", getGameState);
router.post("/join", joinUser);

export default router;