import 'reflect-metadata';
import express from "express";
import './database';

const app = express();

app.get("/", (request, response) => {
    return response.json({message: "Welcome"});
});

app.get("/", (request, response) => {
    return response.json({message: "Seus dados foram salvos com sucesso"});
});

app.listen(3333, () => console.log("Server is running!"));
