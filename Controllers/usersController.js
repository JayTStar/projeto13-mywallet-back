import joi from "joi";
import dados from "../db.js";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import chalk from "chalk";

export async function cadastrar(req, res){
    const usuarioSchema = joi.object({
        nome: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().required()
    });

    const usuario = req.body;

    const validacao = usuarioSchema.validate(usuario, { abortEarly: false });

    if(validacao.error){
        console.log(validacao.error.details);

        res.status(422).send("Erro nos dados enviados");

        return;
    }

    try{
        const senhaCriptografada = bcrypt.hashSync(req.body.senha, 10);

        await dados.collection("usuarios").insertOne({nome: usuario.nome, email:usuario.email, senha: senhaCriptografada});
        console.log(chalk.green(`Usuário ${usuario.nome} cadastrado!`));

        console.log(chalk.yellow("Fechando conexão..."));
    }
    catch(e){
        res.status(500).send(e);

        console.log(e)
    }

    res.status(200).send("tudo certo")
}

export async function login(req, res){
    const loginSchema = joi.object({
        email: joi.string().email().required(),
        senha: joi.string().required()
    })
    
    const login = req.body;

    const validacao = loginSchema.validate(login, { abortEarly: false });

    if(validacao.error){
        console.log(validacao.error.details);

        res.status(422).send("Erro nos dados enviados");

        return;
    }

    try{
        const usuario = await dados.collection('usuarios').findOne({email: login.email});

        if(usuario && bcrypt.compareSync(login.senha, usuario.senha)){
            console.log("Acesso autorizado");
            const token = uuid();


            await dados.collection("sessao").insertOne({ name: usuario.nome,
                userId: usuario._id,
                token: token });

            res.status(200).send({ name: usuario.nome,
                userId: usuario._id,
                token: token });
        }
        else{
            res.status(422).send("Erro nos dados enviados");
        }
    }
    catch(e){
        res.status(500).send(e);

        console.log(e)
    }
}