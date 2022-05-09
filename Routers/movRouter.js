import { Router } from "express";
import { getMov, postMov} from "../Controllers/movController.js"

const movRouter = Router();

movRouter.post("/movimentacoes", postMov);
movRouter.get("/movimentacoes", getMov);

export default movRouter;