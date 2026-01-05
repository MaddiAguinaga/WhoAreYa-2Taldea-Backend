import request from "supertest";
import dotenv from "dotenv";
import app from "../../src/app.js";
import connectDB from "../../src/config/database.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../../src/models/User.js";

dotenv.config();

//DB konexioa
beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});



// Erabiltzailea sortzeko funtzioa
const sortuErabiltzailea = async (rola) => {
    const pasahitzHasheatua = await bcrypt.hash("123456", 10);

    return User.create({
        name: "Test",
        lastName: "User",
        email: `${rola}@test.com`,
        password: pasahitzHasheatua,
        role: rola
    });
};

// ADMIN route-en baimen testak
describe("ADMIN route babestuen testak", () => {

    test("Saioa hasi gabe redirect /admin/login", async () => {
        const erantzuna = await request(app).get("/admin");

        expect(erantzuna.statusCode).toBe(302);
        expect(erantzuna.headers.location).toBe("/admin/login");
    });


    test("Erabiltzaile arrunta (user) 403 Forbidden", async () => {
        await sortuErabiltzailea("user");

        const agentea = request.agent(app);

        // saioa hasi user rola duen erabiltzailearekin
        await agentea
            .post("/api/auth/login")
            .send({
                email: "user@test.com",
                password: "123456"
            });

        const erantzuna = await agentea.get("/admin");

        expect(erantzuna.statusCode).toBe(403);
    });

});
