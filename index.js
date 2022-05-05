import dotenv from"dotenv";
import express from "express";
import cors from "cors";
import chalk from "chalk";
import joi from "joi";
import { MongoClient } from "mongodb";
import dayjs from "dayjs"
import bcrypt from 'bcrypt';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017");

const porta = 5000;

const usuarioSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required()
});

const movimentacao = joi.object({
    titulo: joi.string().required(),
    valor: joi.number().required(),
    tipo: joi.string().valid("entrada", "saida").required()
})

app.post("/cadastro",async (req, res) => {
    const usuario = req.body;

    const validacao = usuarioSchema.validate(usuario, { abortEarly: false });

    if(validacao.error){
        console.log(validacao.error.details);

        res.status(422).send("Erro nos dados enviados");

        return;
    }

    try{
        console.log(chalk.yellow("Acessando banco de dados..."));
        await mongoClient.connect();
        const dados = mongoClient.db("projeto-13");

        console.log(chalk.yellow("Cadastrando usuário..."));

        const senhaCriptografada = bcrypt.hashSync(req.body.senha, 10);

        await dados.collection("usuarios").insertOne({nome: usuario.nome, email:usuario.email, senha: senhaCriptografada});
        console.log(chalk.green(`Usuário ${usuario.nome} cadastrado!`));

        console.log(chalk.yellow("Fechando conexão..."));
        mongoClient.close();
    }
    catch(e){

    }

    res.status(200).send("tudo certo")
});

app.post("/login", (req, res) => {
    
})

app.post("/movimentacoes", (req, res) => {

})

app.get("/movimentacoes", (req, res) => {

})

app.listen(porta, () => {
    console.log(chalk.blue(`Servidor criado na porta ${porta}`))
})