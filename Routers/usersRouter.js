import { Router } from "express";
import { cadastrar, login} from "../Controllers/usersController.js"

const usersRouter = Router();

usersRouter.post("/cadastrar", cadastrar);
usersRouter.post("/login", login);

export default usersRouter;