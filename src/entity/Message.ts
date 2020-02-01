import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Request, Response } from "express";
import { User } from "./User";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    message_id: number;
    
    @Column()
    content: string;

    
    @Column()
    date_created: Date;

    @ManyToMany(type => User, user => user.messages)
    users: User[];

    makeFromRequestAndResponse(req: Request, res: Response) {
        const user_from = new User();
        user_from.user_id = res.locals.jwtPayload.userId;

        const user_to = new User();
        const { content, date_created, user_id_to } = req.body;
        this.content = content;
        this.date_created = date_created;
        user_to.user_id = user_id_to;

        this.users = [user_from, user_to];
    }

}