const request = require('supertest');
const { app, server } = require('./server'); // Importando o servidor

describe("Testes da API", () => {

    it("Deve retornar mensagem de funcionamento", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "API funcionando!");
    });

});

afterAll(() => {
    server.close(); // Fecha o servidor depois dos testes
});
