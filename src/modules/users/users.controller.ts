import type { RequestHandler } from 'express';
import { validatedBody, validatedParams } from '../../middleware/validate.js';
import type { CreateUserBody, UpdateUserBody, UserIdParam } from './users.schema.js';
import { addUser, findUser, listUsers, modifyUser, removeUser } from './users.service.js';

export const listUsersHandler: RequestHandler = async (_req, res) => {
  const result = await listUsers();
  res.status(200).json(result);
};

export const getUserHandler: RequestHandler = async (req, res) => {
  const { id } = validatedParams<UserIdParam>(req);
  const user = await findUser(id);
  res.status(200).json({ data: user });
};

export const createUserHandler: RequestHandler = async (req, res) => {
  const payload = validatedBody<CreateUserBody>(req);
  const user = await addUser(payload);
  res.status(201).location(`${req.baseUrl}/${user.id}`).json({ data: user });
};

export const updateUserHandler: RequestHandler = async (req, res) => {
  const { id } = validatedParams<UserIdParam>(req);
  const payload = validatedBody<UpdateUserBody>(req);
  const user = await modifyUser(id, payload);
  res.status(200).json({ data: user });
};

export const deleteUserHandler: RequestHandler = async (req, res) => {
  const { id } = validatedParams<UserIdParam>(req);
  await removeUser(id);
  res.status(204).send();
};
