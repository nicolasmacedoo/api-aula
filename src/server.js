import express from 'express';
import { randomUUID } from 'node:crypto'
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error("erro ao conectar com o banco de dados", err.message)
  }
  console.log('Conectado ao banco de dados!')
})

db.run(
  `CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    quantidade INTEGER NOT NULL
  )`
);

const products = [
  {
    id: randomUUID(),
    nome: "produto 1",
    preco: 2.99,
    quantidade: 10
  },
  {
    id: randomUUID(),
    nome: "produto 2",
    preco: 12.99,
    quantidade: 101
  },
  {
    id: randomUUID(),
    nome: "produto 3",
    preco: 22.99,
    quantidade: 20
  },
  {
    id: randomUUID(),
    nome: "produto 4",
    preco: 5.99,
    quantidade: 67
  },
]

const app = express()

app.use(express.json())

app.get('/products', (request, response) => {
  const query = 'SELECT * FROM produtos'
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message)
      return response.status(500).json({
        message: 'Erro ao buscar produtos'
      })
    }
    console.log(rows)
    response.status(200).json({
      produtos: rows
    })
  })
})

app.get('/products/:id', (request, response) => { 
  const id = request.params.id

  const query = 'SELECT * FROM produtos WHERE id = ?'

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(err.message)
      return response.status(500).json({
        message: 'Erro ao buscar produto'
      })
    }
    response.status(200).json({
      produto: row
    })
  })
})

app.post('/products', (request, response) => {
  const data = request.body

  const query = `INSERT INTO produtos (id, nome, preco, quantidade) VALUES (?, ?, ?, ?)`;

  db.run(query, [randomUUID(), data.nome, data.preco, data.quantidade], (err) => {
    if (err) {
      console.error(err.message)
      return response.status(500).json({
        message: 'Erro ao criar produto'
      })
    }
    response.status(201).json({
      message: 'Produto criado com sucesso'
    })
  })

  app.put('/products/:id', (request, response) => {
    const data = request.body
    const id = request.params.id

    const query = `UPDATE produtos SET nome = ?, preco = ?, quantidade = ? WHERE id = ?`;

    db.run(query, [data.nome, data.preco, data.quantidade, id], (err) => {
      if (err) {
        console.error(err.message)
        return response.status(500).json({
          message: 'Erro ao atualizar produto'
        })
      }
      response.status(200).json({
        message: 'Produto atualizado com sucesso'
      })
    })
  })

  app.delete('/products/:id', (request, response) => {
    const id = request.params.id

    const query = `DELETE FROM produtos WHERE id = ?`;

    db.run(query, [id], (err) => {
      if (err) {
        console.error(err.message)
        return response.status(500).json({
          message: 'Erro ao deletar produto'
        })
      }
      response.status(200).json({
        message: 'Produto deletado com sucesso'
      })
    })
  })
})

app.listen(3333, () => {
  console.log('Servidor escutando...')
})