import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let dados = null;
try {
  const mongoClient = new MongoClient(process.env.MONGO_URL);
  await mongoClient.connect();
  dados = mongoClient.db(process.env.BANCO);
  console.log("Conexão com o banco dados MongoDB estabelecida!");
} catch(e) {
  console.log("Erro ao se conectar ao banco de dados!", e);
}

export default dados;