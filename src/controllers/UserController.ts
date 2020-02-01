import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from "class-validator";

class UserController {
        static getCurrent = async (req: Request, res: Response) => {
        
        const user_id = res.locals.jwtPayload.userId;

        
        const userRepository = getRepository(User);
        try{
            const user = await userRepository.findOneOrFail(user_id, {
                select: ["user_id", "first_name", "second_name", "birth_date", "profile_picture_url", "isMale" ]
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
        } catch (error){
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

    static getAll = async (req: Request, res: Response) => {
   
    };
    
    static followUser = async (req: Request, res: Response) => {
   
    };
    
}

export default UserController;