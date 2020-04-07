const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();
const repositories = [];

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", verifyRepositoryExistent);

function verifyRepositoryExistent(request, response, next) {
  
  const repositoryIndex = findRepositoryIndexId(request.params.id);

  if (repositoryIndex < 0) {
    response.status(400).json({errorMessage: "Repository not found."});
  }

  next();
}

function findRepositoryIndexId(id) {

  return repositories.findIndex(repository => repository.id === id);

}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {

  const repositoryIndex = findRepositoryIndexId(request.params.id);

  const {title, url, techs} = request.body;

  const repository = {...repositories[repositoryIndex], title, url, techs};
  
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {

  const repositoryIndex = findRepositoryIndexId(request.params.id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

  const repositoryIndex = findRepositoryIndexId(request.params.id);

  const repository = {...repositories[repositoryIndex], likes: ++repositories[repositoryIndex].likes};
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

module.exports = app;
