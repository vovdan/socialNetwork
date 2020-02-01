import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";
import { Following } from "../entity/Following";

class UserController {
    static getCurrent = async (req: Request, res: Response) => {

        const user_id = res.locals.jwtPayload.userId;


        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(user_id, {
                select: ["user_id", "first_name", "second_name", "birth_date", "profile_picture_url", "isMale"]
            });
            res.send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }

    };

    static editUser = async (req: Request, res: Response) => {

        const user_id = res.locals.jwtPayload.userId;


        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(user_id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }


        user.updateFromRequest(req);


        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }


        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("username alreasy in use");
            return;
        }


        res.status(204).send();
    };

    static getAllFollowing = async (req: Request, res: Response) => {
          
        const userId = res.locals.jwtPayload.userId;


        const followingRepository = getRepository(Following);
        const followings = await followingRepository.find({ 
            join: {
                alias: "following",
                innerJoin: {
                    profile: "following.users"
                }
            },
            where: { 
                userid: userId
            }
        })

        res.send(followings);

    };

    static followUser = async (req: Request, res: Response) => {
        let following = new Following();
        following.makeFromRequestAndResponse(req, res);

        
        const errors = await validate(following);
        if (errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        
        const followingRepository = getRepository(Following);
        try{
            await followingRepository.save(following);
        } catch (error) {
            res.status(404).send();
            return;
        }

        
        res.status(201).send("Following created");
    };

}

export default UserController;