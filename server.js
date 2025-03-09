const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir JSON no body das requisições
app.use(express.json());

// Lista de usuários armazenada na memória
let users = [];
let idCounter = 1;

// Rota GET /users - Retorna todos os usuários
app.get('/users', (req, res) => {
    res.json(users);
});

// Rota POST /users - Adiciona um novo usuário
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
    }

    const newUser = { id: idCounter++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Rota PUT /users/:id - Atualiza um usuário pelo ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
});

// Rota DELETE /users/:id - Remove um usuário pelo ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    users = users.filter(user => user.id !== parseInt(id));
    res.status(204).send();
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
