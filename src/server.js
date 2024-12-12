import express from 'express';
import { randomUUID } from 'node:crypto'

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
  response.status(200).json({
    products,
  })
})

app.post('/products', (request, response) => {
  const data = request.body

  const newProduct = {
    id: randomUUID(),
    nome: data.nome,
    preco: data.preco,
    quantidade: data.quantidade
  }

  products.push(newProduct)

  response.status(201).json({
    message: 'Produto criado com sucesso',
    data:  newProduct
  })
})

app.listen(3333, () => {
  console.log('Servidor escutando...')
})