import { AppError } from '../../utils/AppError.js';
import * as repository from './users.repository.js';
import type { UserRow } from './users.repository.js';
import type { CreateUserBody, UpdateUserBody } from './users.schema.js';

export interface User {
  id: number;
  name: string | null;
  email: string | null;
  status: string | null;
}

const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  status: row.status,
});

export async function listUsers(): Promise<{ data: User[]; meta: { total: number } }> {
  const rows = await repository.getAllUsers();
  const data = rows.map(toUser);

  return { data, meta: { total: data.length } };
}

export async function findUser(id: number): Promise<User> {
  const row = await repository.getUserById(id);
  if (!row) {
    throw AppError.notFound(`User ${id} was not found`);
  }

  return toUser(row);
}

export async function addUser(payload: CreateUserBody): Promise<User> {
  const row = await repository.createUser(payload);
  return toUser(row);
}

export async function modifyUser(id: number, payload: UpdateUserBody): Promise<User> {
  const row = await repository.updateUser(id, payload);
  if (!row) {
    throw AppError.notFound(`User ${id} was not found`);
  }

  return toUser(row);
}

export async function removeUser(id: number): Promise<void> {
  const rowsDeleted = await repository.deleteUser(id);
  if (rowsDeleted === 0) {
    throw AppError.notFound(`User ${id} was not found`);
  }
}
