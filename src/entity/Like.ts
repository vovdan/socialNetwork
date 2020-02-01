import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Request, Response } from "express";
@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    like_id;
    
    @ManyToOne(type => User, user => user.likes)
    user: User;

    @ManyToOne(type => Post, post => post.likes)
    post: Post;

    makeFromRequestAndResponse(req: Request, res: Response) {
        const user = new User();
        user.user_id = res.locals.jwtPayload.userId;
        this.user = user;

        const post = new Post();
        post.post_id = +req.params.id;
        this.post = post;
    }
}