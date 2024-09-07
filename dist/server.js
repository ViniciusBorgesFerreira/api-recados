"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const listUsers = [];
app.get("/users", (request, response) => {
    const resposta = {
        success: true,
        message: "usuários buscados com sucesso",
        data: listUsers,
    };
    return response.status(200).send(resposta);
});
app.post("/users", (request, response) => {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
        const resposta = {
            success: false,
            message: 'As propriedades "name", "email" e "password" são obrigatorias',
            data: null,
        };
        return response.status(400).send(resposta);
    }
    if (listUsers.some((user) => user.email === email)) {
        const resposta = {
            success: false,
            message: "Email ja cadastrado",
            data: null,
        };
        return response.status(400).send(resposta);
    }
    const newUser = {
        id: (0, uuid_1.v4)(),
        name,
        email,
        password,
        recados: [],
    };
    listUsers.push(newUser);
    const resposta = {
        success: true,
        message: "usuário criado com sucesso",
        data: newUser,
    };
    return response.status(201).send(resposta);
});
app.get("/users/:id/recados", (request, response) => {
    const { id } = request.params;
    const user = listUsers.find((user) => user.id === id);
    if (!user) {
        const resposta = {
            success: false,
            message: "usuario não encontrado",
            data: null,
        };
        return response.status(400).send(resposta);
    }
    const resposta = {
        success: true,
        message: "recados buscados com sucesso",
        data: user.recados,
    };
    return response.status(200).send(resposta);
});
app.post("/users/:id/recados", (request, response) => {
    const { id } = request.params;
    const { description, detail } = request.body;
    if (!description || !detail) {
        const resposta = {
            success: false,
            message: "As propriedades description e detail são obrigatórios ",
            data: null,
        };
        return response.status(400).send(resposta);
    }
    const indice = listUsers.findIndex((user) => user.id === id);
    if (indice === -1) {
        const resposta = {
            success: false,
            message: 'Usuário não encontrado',
            data: null
        };
        return response.status(400).send(resposta);
    }
    const newRecado = {
        id: (0, uuid_1.v4)(),
        description,
        detail,
    };
    listUsers[indice].recados.push(newRecado);
    const resposta = {
        success: true,
        message: "Recado cadastrado com sucesso!",
        data: newRecado,
    };
    return response.status(201).send(resposta);
});
app.put('/users/:userId/recados/:recadoId', (request, response) => {
    const { userId, recadoId } = request.params;
    const { description, detail } = request.body;
    const indiceUser = listUsers.findIndex((user) => user.id === userId);
    if (indiceUser === -1) {
        const resposta = {
            success: false,
            message: "Usuário não encontrado",
            data: null,
        };
        return response.status(400).send(resposta);
    }
    const indiceRecado = listUsers[indiceUser].recados.findIndex((recado) => recado.id === recadoId);
    if (indiceRecado === -1) {
        const resposta = {
            success: false,
            message: "Usuário não encontrado",
            data: null,
        };
        return response.status(400).send(resposta);
    }
    listUsers[indiceUser].recados[indiceRecado].description =
        description !== null && description !== void 0 ? description : listUsers[indiceUser].recados[indiceRecado].description;
    listUsers[indiceUser].recados[indiceRecado].detail =
        detail !== null && detail !== void 0 ? detail : listUsers[indiceUser].recados[indiceRecado].detail;
    const recadoUpdated = listUsers[indiceUser].recados[indiceRecado];
    const resposta = {
        success: true,
        message: "Recado atualizado com sucesso",
        data: recadoUpdated,
    };
    return response.status(200).send(resposta);
});
app.delete("/users/:userId/recados/:recadoId", (request, response) => {
    const { userId, recadoId } = request.params;
    const indiceUser = listUsers.findIndex((user) => user.id === userId);
    if (indiceUser === -1) {
        const resposta = {
            success: false,
            message: "Usuário não encontrado",
            data: null,
        };
        return response.status(400).send(resposta);
    }
    const newRecadosList = listUsers[indiceUser].recados.filter((recado) => recado.id !== recadoId);
    listUsers[indiceUser].recados = newRecadosList;
    const resposta = {
        success: true,
        message: "Recado excluído com sucesso",
        data: null,
    };
    return response.status(200).send(resposta);
});
