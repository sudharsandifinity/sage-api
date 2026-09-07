import { executeProcedure, input, output, sql } from '../../db/executeProcedure.js';
import type { CreateUserBody, UpdateUserBody } from './users.schema.js';

export interface UserRow {
  id: number;
  name: string | null;
  email: string | null;
  status: string | null;
}

const GET_ALL_USERS = 'dbo.usp_GetAllUsers';
const GET_USER_BY_ID = 'dbo.usp_GetUserById';
const CREATE_USER = 'dbo.usp_CreateUser';
const UPDATE_USER = 'dbo.usp_UpdateUser';
const DELETE_USER = 'dbo.usp_DeleteUser';

export async function getAllUsers(): Promise<UserRow[]> {
  const result = await executeProcedure<UserRow>(GET_ALL_USERS);

  return result.recordset;
}

export async function getUserById(id: number): Promise<UserRow | null> {
  const result = await executeProcedure<UserRow>(GET_USER_BY_ID, {
    Id: input(sql.Int, id),
  });

  return result.recordset[0] ?? null;
}

export async function createUser(payload: CreateUserBody): Promise<UserRow> {
  const result = await executeProcedure<UserRow>(CREATE_USER, {
    Name: input(sql.VarChar(50), payload.name),
    Email: input(sql.VarChar(50), payload.email),
    Status: input(sql.VarChar(20), payload.status),
    Id: output(sql.Int),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error('usp_CreateUser did not return the inserted row');
  }

  return row;
}

export async function updateUser(id: number, payload: UpdateUserBody): Promise<UserRow | null> {
  const result = await executeProcedure<UserRow>(UPDATE_USER, {
    Id: input(sql.Int, id),
    Name: input(sql.VarChar(50), payload.name),
    Email: input(sql.VarChar(50), payload.email),
    Status: input(sql.VarChar(20), payload.status ?? null),
  });

  return result.recordset[0] ?? null;
}

export async function deleteUser(id: number): Promise<number> {
  const result = await executeProcedure(DELETE_USER, {
    Id: input(sql.Int, id),
    RowsDeleted: output(sql.Int),
  });

  return Number(result.output.RowsDeleted ?? 0);
}
