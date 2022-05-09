import joi from "joi";
import dados from "../db.js";


export async function getMov(req, res){
    const {authorization } = req.headers;
    const token = authorization.replace('Bearer ', '');

    if(!token) {
        console.log("tolken são inserido")
        return res.sendStatus(401);
    }
    console.log(token);

    try{
        const sessao = await dados.collection('sessao').findOne({token: token});

        if (!sessao) {
            console.log('sessao não encontrada')
            return res.sendStatus(401);
        }

        const usuario = await dados.collection("usuarios").findOne({_id: sessao.userId});

        console.log(usuario)

        if(!usuario){
            console.log("usuario não identificado")
            return res.sendStatus(401);
        }
        else{
            console.log(usuario._id.toString());

            const movimentacoes = await dados.collection('movimentacoes').find({usuarioId: usuario._id.toString()}).toArray();


            res.status(200).send(movimentacoes);
        }
    }
    catch(e){
        res.status(500).send(e);

        console.log(e)

    }
}

export async function postMov(req, res){
    const movimentacaoSchema = joi.object({
        titulo: joi.string().required(),
        valor: joi.number().required(),
        tipo: joi.string().valid("entrada", "saida").required(),
        usuarioId: joi.required()
    })
       
    const {authorization } = req.headers;
    const token = authorization.replace('Bearer ', '');

    if(!token) {
        return res.sendStatus(401);
    }
    console.log(token);

    try{
        const sessao = await dados.collection('sessao').findOne({token: token});

        if (!sessao) {
            return res.sendStatus(401);

        }

        const usuario = await dados.collection("usuarios").findOne({_id: sessao.userId});

        console.log(usuario)

        if(!usuario){
            return res.sendStatus(401);

        }
        else{
            delete usuario.senha;

            const movimentacao = {
                ...req.body,
                usuarioId: usuario._id.toString()
            }

            console.log(movimentacao);

            const validacao = movimentacaoSchema.validate(movimentacao, { abortEarly: false });

            if(validacao.error){
                console.log(validacao.error.details);
        
                res.status(422).send("Erro nos dados enviados");

        
                return;
            }

            await dados.collection('movimentacoes').insertOne(movimentacao);

            res.status(201).send("enviado");
        }

    }
    catch(e){
        res.status(500).send(e);

        console.log(e)

    }
}