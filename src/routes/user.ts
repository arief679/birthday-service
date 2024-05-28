import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const router = Router();

//list
router.get('/users', async (req, res) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find();
  res.status(200).send(users);
});

//create
router.post('/user', async (req, res) => {
  const userRepository = getRepository(User);
  const user = userRepository.create(req.body);
  await userRepository.save(user);
  res.status(201).send(user);
});

//update
router.put('/user/:id', async (req, res) => {
  const userRepository = getRepository(User);
  await userRepository.update(req.params.id, req.body);
  const updatedUser = await userRepository.findOne({
    where: {id: parseInt(req.params.id, 10)}
  });
  res.status(200).send(updatedUser);
});

//update
router.delete('/user/:id', async (req, res) => {
  const userRepository = getRepository(User);
  await userRepository.delete(req.params.id);
  res.status(204).send();
});

export default router;