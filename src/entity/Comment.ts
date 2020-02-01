import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { User } from "./User";
import { Post } from "./Post";
import { Request, Response } from "express";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    comment_id: number;

    @Column()
    content: string;

    @Column()
    date_created: Date;

    @ManyToOne(type => Post, post => post.comments)
    post: Post;

    makeFromRequestAndResponse(req: Request, res: Response) {
        const post = new Post();
        post.post_id = +req.params.id;
        this.post = post;

        const { content, date_created } = req.body;
        this.content = content;
        this.date_created = date_created;
    }
}