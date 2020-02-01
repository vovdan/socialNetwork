import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, ManyToOne } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { User } from "./User";
import { Like } from "./Like";
import { Comment } from "./Comment";
import { Request, Response } from "express";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    post_id: number;

    @Column()
    description: string;

    @Column()
    date_created: Date;

    @Column()
    date_updated: Date;

    @Column()
    type: string;


    @ManyToOne(type => User, user => user.posts)
    user: User;

    @OneToMany(type => Like, like => like.post)
    likes: Like[];

    @OneToMany(type => Comment, comment => comment.post)
    comments: Comment[];

    makeFromRequestAndResponse(req: Request, res: Response) {
        const user = new User();
        user.user_id = res.locals.jwtPayload.userId;

        this.updateFromRequest(req);
        this.user = user;
    }

    updateFromRequest(req: Request) {
        const { description, date_created, date_updated, type } = req.body;
        this.description = description;
        this.date_created = date_created;
        this.date_updated = date_updated;
        this.type = type;
    }
}