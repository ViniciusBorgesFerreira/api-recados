import express, { Request, Response } from "express";
import "dotenv/config";
import { Recado, ResponseAPI, User } from "./types";
import { v4 as uuid } from "uuid";
import cors from "cors"

const app = express();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});

app.use(express.json());
app.use(cors())

const listUsers: User[] = [];

app.get("/users", (request: Request, response: Response) => {
  const resposta: ResponseAPI = {
    success: true,
    message: "usuários buscados com sucesso",
    data: listUsers,
  };

  return response.status(200).send(resposta);
});

app.post("/users", (request: Request, response: Response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    const resposta: ResponseAPI = {
      success: false,
      message: 'As propriedades "name", "email" e "password" são obrigatorias',
      data: null,
    };
    return response.status(400).send(resposta);
  }

  if (listUsers.some((user) => user.email === email)) {
    const resposta: ResponseAPI = {
      success: false,
      message: "Email ja cadastrado",
      data: null,
    };
    return response.status(400).send(resposta);
  }
  const newUser = {
    id: uuid(),
    name,
    email,
    password,
    recados: [],
  };

  listUsers.push(newUser);

  const resposta: ResponseAPI = {
    success: true,
    message: "usuário criado com sucesso",
    data: newUser,
  };

  return response.status(201).send(resposta);
});

app.get("/users/:id/recados", (request: Request, response: Response) => {
  const { id } = request.params;

  const user = listUsers.find((user) => user.id === id);

  if (!user) {
    const resposta: ResponseAPI = {
      success: false,
      message: "usuario não encontrado",
      data: null,
    };

    return response.status(400).send(resposta);
  }

  const resposta: ResponseAPI = {
    success: true,
    message: "recados buscados com sucesso",
    data: user.recados,
  };

  return response.status(200).send(resposta);
});

app.post("/users/:id/recados", (request: Request, response: Response) => {
  const { id } = request.params;
  const { description, detail } = request.body;

  if (!description || !detail) {
    const resposta: ResponseAPI = {
      success: false,
      message: "As propriedades description e detail são obrigatórios ",
      data: null,
    };

    return response.status(400).send(resposta);
  }

  const indice = listUsers.findIndex((user) => user.id === id);

  if( indice === -1 ){
    const resposta: ResponseAPI = {
      success: false,
      message: 'Usuário não encontrado',
      data: null
    }
    
    return response.status(400).send(resposta);

  }

  const newRecado: Recado = {
    id: uuid(),
    description,
    detail,
  };

  listUsers[indice].recados.push(newRecado);

  const resposta: ResponseAPI = {
    success: true,
    message: "Recado cadastrado com sucesso!",
    data: newRecado,
  };

  return response.status(201).send(resposta);
});

app.put('/users/:userId/recados/:recadoId',(request: Request, response: Response)=>{
  const {userId, recadoId} = request.params;
  const {description, detail} = request.body;

  const indiceUser = listUsers.findIndex((user) => user.id === userId);

  if (indiceUser === -1) {
    const resposta: ResponseAPI = {
      success: false,
      message: "Usuário não encontrado",
      data: null,
    };

    return response.status(400).send(resposta);
  }
  const indiceRecado = listUsers[indiceUser].recados.findIndex((recado) => recado.id === recadoId);

  if (indiceRecado === -1) {
    const resposta: ResponseAPI = {
      success: false,
      message: "Usuário não encontrado",
      data: null,
    };

    return response.status(400).send(resposta);
  }

  listUsers[indiceUser].recados[indiceRecado].description =
    description ?? listUsers[indiceUser].recados[indiceRecado].description; 

  listUsers[indiceUser].recados[indiceRecado].detail =
    detail ?? listUsers[indiceUser].recados[indiceRecado].detail; 

  const recadoUpdated = listUsers[indiceUser].recados[indiceRecado];

  const resposta: ResponseAPI = {
    success: true,
    message: "Recado atualizado com sucesso",
    data: recadoUpdated,
  };
  return response.status(200).send(resposta);

})

app.delete("/users/:userId/recados/:recadoId",(request:Request, response:Response)=>{
  const { userId, recadoId } = request.params;

   const indiceUser = listUsers.findIndex((user) => user.id === userId);

   if (indiceUser === -1) {
     const resposta: ResponseAPI = {
       success: false,
       message: "Usuário não encontrado",
       data: null,
     };

     return response.status(400).send(resposta);
   }

   const newRecadosList = listUsers[indiceUser].recados.filter((recado)=> recado.id !== recadoId)

   listUsers[indiceUser].recados = newRecadosList;

   const resposta: ResponseAPI = {
     success: true,
     message: "Recado excluído com sucesso",
     data: null,
   };

  return response.status(200).send(resposta);

});

