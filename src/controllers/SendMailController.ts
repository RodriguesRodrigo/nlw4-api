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

        const user = await usersRepository.findOne({email});

        if (!user) {
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

        const variables = {
            user_id: user.id,
            name: user.name,
            title: survey.title,
            description: survey.description,
            link: process.env.URL_MAIL,
        }

        const surveyUserAlreadyExists = await surveysUsersReposirory.findOne({
            where: [{user_id: user.id}, {value: null}],
            relations: ["user", "survey"],
        });

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        if (surveyUserAlreadyExists) {
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.status(200).json(surveyUserAlreadyExists);
        }

        const surveyUser = surveysUsersReposirory.create({
            user_id: user.id,
            survey_id,
        });
        await surveysUsersReposirory.save(surveyUser);

        await SendMailService.execute(email, survey.title, variables, npsPath);
        
        return response.status(200).json(surveyUser);
    }
}

export { SendMailController };
