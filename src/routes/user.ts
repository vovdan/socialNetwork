import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/me", [checkJwt], UserController.getCurrent);

router.patch("/me", [checkJwt], UserController.editUser);

router.get("/me/followings", [checkJwt], UserController.getAllFollowing);

router.post("/me/follow", [checkJwt], UserController.followUser);

export default router;