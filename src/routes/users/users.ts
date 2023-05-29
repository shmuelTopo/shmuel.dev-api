import express from "express";
import { IUser } from "../../databases/users/models/user.model";
import UserController from "../../databases/users/controllers/user.controller";
import * as dotenv from "dotenv";
dotenv.config();

const usersController = new UserController();
const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await usersController.getUsers();
  res.json(users);
});

router.get("/:username", async (req, res, next) => {
  try {
    const user = await usersController.getUser(req.params.username);
    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { first, last, username, email } = req.body;
  if (!first || !last || !username || !email) {
    res.status(422).json("You are missing some data");
    return;
  }

  const newUser: IUser = { first, last, username, email };
  const user = await usersController.addUser(newUser);
  res.status(201).json(user);
});

router.use("*", (req, res) => {
  res.status(404).json(req.originalUrl);
});

export default router;
