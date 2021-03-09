const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  
  const {title, url, techs} = request.body;

  const repositorie = {
    'title': title, 
    'url': url,
    'techs' : techs,
    'id': uuid(),
    'likes': 0
  }

  repositories.push(repositorie);

  return response.json(repositorie);

});

app.put("/repositories/:id", (request, response) => {
  
  const {title, url, techs} = request.body;
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'O parametro ID não é valido'});
  }

  const repositorieIndex = repositories.findIndex(r => r.id === id);
  const repositorie = repositories.find((r) => r.id === id );

  if(repositorieIndex < 0){
    return response.status(400).json({error: 'Respositório não encontrado.'});
  }

  const newRepositorie = {
    id, 
    title, 
    url, 
    techs, 
    'likes': repositorie.likes
  }

  repositories[repositorieIndex] = newRepositorie;

  return response.json(newRepositorie);

});

app.delete("/repositories/:id", (request, response) => {

    const {id} = request.params;

    if(!isUuid(id)){
      return response.status(400).json({ error: 'O parametro ID não é valido'});
    }

    const repositorieIndex = repositories.findIndex(r => r.id === id);

    if(repositorieIndex < 0){
      return response.status(400).json({error: 'Respositório não encontrado.'});
    }

    repositories.splice(repositorieIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

    const {id} = request.params;

    if(!isUuid(id)){
      return response.status(400).json({ error: 'O parametro ID não é valido'});
    }

    const repositorieIndex = repositories.findIndex(r => r.id === id);

    if(repositorieIndex < 0){
      return response.status(400).json({error: 'Respositório não encontrado.'});
    }

    repositories[repositorieIndex].likes += 1;
    
    return response.json(repositories[repositorieIndex]);

});

module.exports = app;
