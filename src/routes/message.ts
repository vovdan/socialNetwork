import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import MessageController from "../controllers/MessageController";

const router = Router();

router.post("/me", [checkJwt], MessageController.sendMessage);

router.delete("/me/:id([0-9]+)", [checkJwt], MessageController.deleteMessage);

router.get("/me", [checkJwt], MessageController.listAll);

router.get("/me/:id([0-9]+)", [checkJwt], MessageController.getOneMessages);

export default router;