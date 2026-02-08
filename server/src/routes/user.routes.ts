import { Router } from "express";
import { joinUser } from "../controllers/users/user.controller";

const router = Router();

router.post("/join", joinUser);
export default router;
