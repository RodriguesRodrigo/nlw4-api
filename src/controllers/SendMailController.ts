import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


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

        const surveyAlreadyExists = await surveysRepository.findOne({id: survey_id});

        if (!surveyAlreadyExists) {
            return response.status(400).json({
                error: "Survey does not exists!",
            });
        }

        const surveyUser = surveysUsersReposirory.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });
        await surveysUsersReposirory.save(surveyUser);

        return response.status(200).json(surveyUser);
    }
}

export { SendMailController };
