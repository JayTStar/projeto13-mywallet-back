import dotenv from"dotenv";
import express from "express";
import cors from "cors";
import chalk from "chalk";
import joi from "joi";
import { MongoClient } from "mongodb";
import dayjs from "dayjs"
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

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

const loginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required()
})

const movimentacaoSchema = joi.object({
    usuario: joi.string().required(),
    email: joi.string().required(),
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

app.post("/sign-in",async (req, res) => {
    const login = req.body;

    const validacao = loginSchema.validate(login, { abortEarly: false });

    if(validacao.error){
        console.log(validacao.error.details);

        res.status(422).send("Erro nos dados enviados");

        return;
    }

    try{
        console.log(chalk.yellow("Acessando banco de dados..."));
        await mongoClient.connect();
        const dados = mongoClient.db("projeto-13");

        const usuario = await dados.collection('usuarios').findOne({email: login.email});

        console.log(usuario);

        if(usuario && bcrypt.compareSync(login.senha, usuario.senha)){
            console.log("Acesso autorizado");
            const token = uuid();

            console.log(token)

            await dados.collection("sessao").insertOne({
                userId: usuario._id,
                token: token
            });

            res.status(200).send(token);
        }
        else{
            console.log("Email ou senha errados");
            res.status(422).send("Erro nos dados enviados");
        }
    }
    catch(e){

    }
})

app.post("/movimentacoes", (req, res) => {

})

app.get("/movimentacoes", (req, res) => {

})

app.listen(porta, () => {
    console.log(chalk.blue(`Servidor criado na porta ${porta}`))
})