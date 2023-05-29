import express from "express";
import users from "./users/users";
import recipes from "./recipes/recipes";

import type { ErrorRequestHandler } from "express";
import ApiError from "../types/ApiError";

const router = express.Router();

router.use("/users", users);
router.use("/recipes", recipes);

router.get("/", (_req, res) => {
  res.status(200).json("server is up and running");
});

router.use("*", (_req, _res, next) => {
  next();
});

const errorHandler: ErrorRequestHandler = (error: any, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(error.message);
  } else {
    console.error(error);
    res.status(500).json("something went wrong!!");
  }
};

router.use(errorHandler);

export default router;
