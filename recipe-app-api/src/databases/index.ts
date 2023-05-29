import initializeUsersDb from "./users/initialization";
import initializeRecipesDb from "./recipes/initialization";
export default function initialize() {
  initializeUsersDb()
  initializeRecipesDb()
}