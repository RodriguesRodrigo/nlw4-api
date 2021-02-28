import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from "path";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersReposirory = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRepository.findOne({email});

        if (!userAlreadyExists) {
            return response.status(400).json({
                error: "User does not exists!",
            });
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        if (!survey) {
            return response.status(400).json({
                error: "Survey does not exists!",
            });
        }

        const surveyUser = surveysUsersReposirory.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });
        await surveysUsersReposirory.save(surveyUser);

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        await SendMailService.execute(email, survey.title, survey.description, npsPath);
        
        return response.status(200).json(surveyUser);
    }
}

export { SendMailController };
