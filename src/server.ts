import express from "express";

const app = express();

app.get("/", (request, response) => {
    return response.json({message: "Welcome"});
});

app.get("/", (request, response) => {
    return response.json({message: "Seus dados foram salvos com sucesso"});
});

app.listen(3333, () => console.log("Server is running!"));
