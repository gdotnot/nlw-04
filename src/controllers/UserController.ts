import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import {AppError} from '../errors/AppError'
import * as yup from 'yup'

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required("Nome é obrigatório"),
      email: yup.string().email().required("Email é obrigatório")
    })

    try {
      await schema.validate(req.body, { abortEarly: false})
    } catch (err) {
      return res.status(400).json({error: err})
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email
    })

    if (userAlreadyExists) {
      throw new AppError("User already exists!")
    }

    const user = usersRepository.create({
      name, email
    })

    await usersRepository.save(user);

    return res.status(201).json(user);
  }

  async listAll(req: Request, res: Response) {
    const usersRepository = getCustomRepository(UsersRepository)

    const allUsers = await usersRepository.find();

    return res.status(200).json(allUsers)
  }
}

export { UserController };

