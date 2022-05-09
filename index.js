import dotenv from"dotenv";
import express, { json } from "express";;
import cors from "cors";
import chalk from "chalk";

import movRouter from "./Routers/movRouter.js"
import usersRouter from "./Routers/usersRouter.js"

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

app.use(movRouter);
app.use(usersRouter);

const porta = process.env.PORT || 5000;

app.listen(porta, () => {
    console.log(chalk.blue(`Servidor criado na porta ${porta}`))
})