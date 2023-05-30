import express from "express";
import bodyParser from "body-parser";
import { Logger } from "./logger";
import routes from "./routes/index";
import initialize from "./databases/index";
import cors from "cors";

class App {
  public express: express.Application;
  public logger: Logger;

  constructor() {
    this.express = express();
    this.middleware();
    this.setRoutes();
    this.logger = new Logger();
    initialize()
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(
      cors({
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "https://projects.shmuel.dev",
          "https://api.shmuel.dev",
          "https://shmuel.dev",
          "https://recipes.shmuel.dev"
        ],
      })
    );
  }

  private setRoutes(): void {
    this.express.use("/", (req, res, next) => {
      this.logger.info(`${req.method}::::: ${req.url}`);
      next();
    });

    this.express.use("/", routes);

    this.express.use("*", (_req, res) => {
      res.status(404).json("404 not found");
    });
  }
}

export default new App().express;

