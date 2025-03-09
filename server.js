const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'seuSegredoJWT'; // Chave para assinar o token

app.use(express.json());

// Lista de usuários em memória (com senha hashada)
let users = [];
let idCounter = 1;

// Usuário fixo para login
const userDB = {
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 8) // Senha hashada
};

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'Token necessário' });
    }

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.userId = decoded.id;
        next();
    });
};

// Rota de login (gera token JWT)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email !== userDB.email || !bcrypt.compareSync(password, userDB.password)) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

// Rota GET /users (Protegida)
app.get('/users', verifyToken, (req, res) => {
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
