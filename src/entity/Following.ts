import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity()
export class Following {
    @PrimaryGeneratedColumn()
    following_id: number;

    @PrimaryGeneratedColumn()
    user_id: number;

}