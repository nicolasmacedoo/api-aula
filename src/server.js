import express from 'express';
import sqlite3 from 'sqlite3';
import { randomUUID } from 'node:crypto'

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.log("Erro ao conectar com o banco", err.message)
  }
  console.log("Conectado ao banco de dados!")
})

db.run(
  `CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY, 
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    quantidade INTEGER NOT NULL
  );`
)

const app = express()

app.use(express.json())

app.get('/products', (request, response) => {
  const query = 'SELECT * FROM produtos'
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err.message)
      return response.status(500).json({
        message: "Erro ao buscar produtos"
      })
    }
    response.status(200).json({
      produtos: rows
    })
  })
})

app.post('/products', (request, response) => {
  const data = request.body

  const query = "INSERT INTO produtos (id, nome, preco, quantidade) VALUES (?, ? ,?, ?)"

  const id = randomUUID()

  db.run(query, [id, data.nome, data.preco, data.quantidade], (err) => {
    if (err) {
      console.log(err.message)
      return response.status(500).json({
        message: "Erro ao criar produto"
      })
    }
    response.status(201).json({
      message: "Produto criado com sucesso"
    })
  })
})

app.put('/products/:id', (request, response) => {
  const { id } = request.params
  const data = request.body

  const query = "UPDATE produtos SET nome = ?, preco = ?, quantidade = ? WHERE id = ?";

  db.run(query, [data.nome, data.preco, data.quantidade, id], (err) => {
    if(err) {
      console.log(err.message)
      return response.status(500).json({
        message: "Erro ao atualizar produto"
      })
    }
    return response.status(200).json({
      message: "Produto atualizado com sucesso"
    })
  })
})

app.delete('/products/:id', (request, response) => {
  const { id } = request.params

  const queryBusca = "SELECT * FROM produtos WHERE id = ?"
  let produto;

  db.all(queryBusca, (err, rows) => {
    if(err) {
      console.log(err.message)
      return response.status(500).json({
        message: "Erro interno"
      })
    }
    produto = rows
  })

  if(!produto) {
    return response.status(404).json({
      message: "Produto nao encontrado"
    })
  }

  const query = "DELETE FROM produtos WHERE id = ?";

  db.run(query, [id], (err) => {
    if(err) {
      console.log(err.message)
      return response.status(500).json({
        message: "Erro ao deletar produto"
      })
    }
    return response.status(200).json({
      message: "Produto deletado com sucesso"
    })
  })
})

app.listen(3333, () => {
  console.log('Servidor escutando...')
})