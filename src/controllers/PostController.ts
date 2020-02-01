import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from "class-validator";
import { Post } from "../entity/Post";
import { Like } from "../entity/Like";
import { Comment } from "../entity/Comment";

class PostController {

    static getAllPost = async (req: Request, res: Response) => { 

        const userId = res.locals.jwtPayload.userId;

        const postRepository = getRepository(Post);
        const posts = await postRepository.find({ 
            join: {
                alias: "post",
                innerJoin: {
                    profile: "post.user"
                }
            },
            where: { 
                userid: userId
            }
        })

        res.send(posts);
    };

    static getOnePost = async (req: Request, res: Response) => { 

           const postId = req.params.id;

           const userId = res.locals.jwtPayload.userId;
   
           const postRepository = getRepository(Post);
           try{
               const post = await postRepository.findOneOrFail({ 
                   join: {
                       alias: "post",
                       innerJoin: {
                           profile: "post.user"
                       }
                   },
                   where: { 
                       userid: userId,
                       post_id: postId
                   }
                })
               res.send(post);
           } catch (error) {
               res.status(404).send("Post not found");
           }
    };

    static createPost = async (req: Request, res: Response) => { 
        let post = new Post();
        post.makeFromRequestAndResponse(req, res);

        const errors = await validate(post);
        if (errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        const postRepository = getRepository(Post);
        try{
            await postRepository.save(post);
        } catch (error) {
            res.status(404).send(error);
            return;
        }

        res.status(201).send("Post created");
    };

    static deletePost = async (req: Request, res: Response) => {

        const postId = req.params.id;

        const userId = res.locals.jwtPayload.userId;

        const postRepository = getRepository(Post);
        let post: Post;
        try{
            post = await postRepository.findOneOrFail(postId);
        } catch (error){
            res.status(404).send("Post not found");
            return;
        }

        postRepository.delete(postId); 

        res.status(204).send("Post deleted");
       
    };

    static editPost = async (req: Request, res: Response) => {

        const postId = req.params.id;
        
        const userId = res.locals.jwtPayload.userId;

        const postRepository = getRepository(Post);
        let post: Post;
        try{
            post = await postRepository.findOneOrFail({ 
                join: {
                    alias: "post",
                    innerJoin: {
                        profile: "post.user"
                    }
                },
                where: { 
                    userid: userId,
                    post_id: postId
                }
             })
        } catch (error) {
            res.status(404).send("post not found");
        }
        
        post.updateFromRequest(req); 

        const errors = await validate(post);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try{
            await postRepository.save(post);
        } catch (error){
            res.status(400).send(error);
        }

        res.status(204).send();
       
    };

    static likePost = async (req: Request, res: Response) => {

        const postId = req.params.id;
    
        const postRepository = getRepository(Post);
        let post: Post;
        try{
            post = await postRepository.findOneOrFail({ 
                join: {
                    alias: "post",
                    innerJoin: {
                        profile: "post.user"
                    }
                },
                where: { 
                    post_id: postId
                }
             })
        } catch (error) {
            res.status(404).send("post not found");
        }


        let like = new Like();
        like.makeFromRequestAndResponse(req, res);

        const errors = await validate(like);
        if (errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        const likeRepository = getRepository(Like);
        try{
            await likeRepository.save(like);
        } catch (error) {
            res.status(404).send(error);
            return;
        }

        res.status(201).send("Like created");
    };

    static getAllLikePost = async (req: Request, res: Response) => { 

        const userId = res.locals.jwtPayload.userId;
        const postId = req.params.id;

        const likeRepository = getRepository(Like);
        const likes = await likeRepository.find({ 
            join: {
                alias: "like",
                innerJoin: {
                    profile: "like.user"
                }
            },
            where: { 
                post_id: postId
            }
        })

        res.send(likes);
    };

    static createCommentPost = async (req: Request, res: Response) => {
        let comment = new Comment();
        comment.makeFromRequestAndResponse(req, res);

        const errors = await validate(comment);
        if (errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        const commentRepository = getRepository(Comment);
        try{
            await commentRepository.save(comment);
        } catch (error) {
            res.status(404).send(error);
            return;
        }

        res.status(201).send("Comment created");
    };


    static getAllCommentPost = async (req: Request, res: Response) => {
       
        const userId = res.locals.jwtPayload.userId;
        const postId = req.params.id;

        const commentRepository = getRepository(Comment);
        const comments = await commentRepository.find({ 
            join: {
                alias: "comment",
                innerJoin: {
                    profile: "comment.post"
                }
            },
            where: { 
                post_id: postId
            }
        })

        res.send(comments);
    };
}

export default PostController;