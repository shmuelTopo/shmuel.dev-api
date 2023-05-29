import { createUsersTable } from "./models/user.model";

export default function initializeUsersDb() {
  createUsersTable().catch((error) => {
    console.error("Error creating users table:", error);
  });
}
