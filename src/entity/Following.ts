import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "./User";
import { Request, Response } from "express";

@Entity()
export class Following {
    @PrimaryGeneratedColumn()
    following_id: number;

    @ManyToMany(type => User, user => user.followings)
    users: User[];

    makeFromRequestAndResponse(req: Request, res: Response) {
        const user_from = new User();
        user_from.user_id = res.locals.jwtPayload.userId;

        const user_to = new User();
        const { user_id_to } = req.body;
        user_to.user_id = user_id_to;
        this.users = [user_from, user_to];
    }
}