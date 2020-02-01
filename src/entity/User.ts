import {
    Entity,
    PrimaryGeneratedColumn, 
    Column, 
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
    ManyToOne
} from "typeorm";

import { Length, IsNotEmpty} from "class-validator";
import * as bcrypt from "bcryptjs";
import { Message } from "./Message";
import { Like } from "./Like";
import { Request } from "express";
import { Post } from "./Post";
import { Following } from "./Following";

@Entity()
@Unique(["email"])
export class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    @IsNotEmpty()
    first_name: string;

    
    @Column({
        nullable: true
    })
    second_name: string;

    @Column()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsNotEmpty()
    @Length(4, 100)
    password: string;

    @Column()
    @CreateDateColumn()
    date_created: Date;

    @Column({
        nullable: true
    })
    @UpdateDateColumn()
    date_updated: Date;

    @Column({
        nullable: true
    })
    birth_date: Date; 

    @Column({
        nullable: true
    })
    isMale: Boolean; 

    @Column({
        nullable: true
    })
    profile_picture_url: string;


    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    @ManyToMany(type => Message, message => message.users, {
        cascade: true
    })
    @JoinTable({
        name: "user_has_messanges"
    })
    messages: Message[];

    @OneToMany(type => Like, like => like.user)
    likes: Like[];

    @ManyToMany(type => Following, following => following.users, {
        cascade: true
    })
    @JoinTable({
        name: "user_has_tasks"
    })
    followings: Following[];

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    updateFromRequest(req: Request){
        const {first_name, second_name, birth_date, profile_picture_url} = req.body;
        this.first_name = first_name;
        this.second_name = second_name;
        this.birth_date = birth_date;
        this.profile_picture_url = profile_picture_url;
    }

}
