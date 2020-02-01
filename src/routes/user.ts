import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/me", [checkJwt], UserController.getCurrent);

router.patch("/me", [checkJwt], UserController.editUser);

router.get("/me", [checkJwt], UserController.getAll);

router.post("/me", [checkJwt], UserController.followUser);

export default router;