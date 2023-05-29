import pool from "../pool";

export interface IUser {
  first: string;
  last: string;
  username: string;
  email: string;
}
export interface User extends IUser {
  id: number;
}

export const createUsersTable = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first VARCHAR(255) NOT NULL,
        last VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE
      );
    `);
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    client.release();
  }
};
