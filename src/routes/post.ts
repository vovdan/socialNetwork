import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import MessageController from "../controllers/MessageController";
import PostController from "../controllers/PostController";

const router = Router();

router.get("/posts", [checkJwt], PostController.getAllPost);

router.get("/post/:id([0-9]+)", [checkJwt], PostController.getOnePost);

router.post("/post", [checkJwt], PostController.createPost);

router.patch("/post/:id([0-9]+)", [checkJwt], PostController.editPost);

router.post("/like/:id([0-9]+)", [checkJwt], PostController.likePost);

router.get("/like/:id([0-9]+)", [checkJwt], PostController.getAllLikePost);

router.post("/comment/:id([0-9]+)", [checkJwt], PostController.createCommentPost);

router.get("/comment/:id([0-9]+)", [checkJwt], PostController.getAllCommentPost);

router.delete("/post/:id([0-9]+)", [checkJwt], PostController.deletePost);

export default router;