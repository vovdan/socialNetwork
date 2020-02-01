import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";
import { Message } from "../entity/Message";

class MessageController {

    static listAll = async (req: Request, res: Response) => {
        
        const userId = res.locals.jwtPayload.userId;


        const messageRepository = getRepository(Message);
        const messages = await messageRepository.find({ 
            join: {
                alias: "message",
                innerJoin: {
                    profile: "message.users"
                }
            },
            where: { 
                userid: userId
            }
        })

        res.send(messages);
    }

    static getOneMessages = async (req: Request, res: Response) => { 
           
           const messageId = req.params.id;

           
           const userId = res.locals.jwtPayload.userId;
   
           
           const messageRepository = getRepository(Message);
           try{
               const message = await messageRepository.findOneOrFail({ 
                   join: {
                       alias: "message",
                       innerJoin: {
                           profile: "message.users"
                       }
                   },
                   where: { 
                       userid: userId,
                       message_id: messageId
                   }
                })
               res.send(message);
           } catch (error) {
               res.status(404).send("Message not found");
           }
    };

    static sendMessage = async (req: Request, res: Response) => {
         
        let message = new Message();
        message.makeFromRequestAndResponse(req, res);

        
        const errors = await validate(message);
        if (errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        
        const messageRepository = getRepository(Message);
        try{
            await messageRepository.save(message);
        } catch (error) {
            res.status(404).send();
            return;
        }

        
        res.status(201).send("Message created");
    };

    static deleteMessage = async (req: Request, res: Response) => {
        
        const messageId = req.params.id;

        
        const userId = res.locals.jwtPayload.userId;

        
        const messageRepository = getRepository(Message);
        let message: Message;
        try{
            message = await messageRepository.findOneOrFail(messageId);
        } catch (error){
            res.status(404).send("message not found");
            return;
        }

        messageRepository.delete(messageId); 

        
        res.status(204).send();

    };

}

export default MessageController;