import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("Nome é obrigatório"),
            email: yup.string().email().required("Por favor, informe um e-mail valido")
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        }
        catch (error) {
            throw new AppError(error.message);
        }

        const usersRepository = getCustomRepository(UserRepository);

        const userAlreadyExists = await usersRepository.findOne({ email });

        if (userAlreadyExists) {
            throw new AppError("User already exists!");
        }

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save(user);

        return response.status(201).send(user);
    }
}

export { UserController };
