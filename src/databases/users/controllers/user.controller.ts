import pool from "../pool";
import { User, IUser } from "../models/user.model";
import ApiError, { errorType } from "../../../types/ApiError";

export default class UserController {
  public async getUsers(): Promise<User[]> {
    const query = "SELECT * FROM users";
    const result = await pool.query(query);
    return result.rows as User[];
  }

  public async getUser(username: string): Promise<User> {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);
    if (!result.rows[0]) {
      throw new ApiError(errorType.NOT_FOUND, "user not found");
    }
    return result.rows[0];
  }

  public async addUser(user: IUser): Promise<User> {
    const query =
      "INSERT INTO users (first, last, username, email) VALUES ($1, $2, $3, $4) RETURNING id;";

    try {
      const results = await pool.query(query, [
        user.first,
        user.last,
        user.username,
        user.email,
      ]);

      return {
        id: results.rows[0]?.id,
        ...user,
      };
    } catch (error: any) {
      if (error.code === "23505") {
        const apiError = new ApiError(
          errorType.ALREADY_EXISTS,
          "user already exists"
        );
        throw apiError;
      } else {
        throw new ApiError();
      }
    }
  }
}
