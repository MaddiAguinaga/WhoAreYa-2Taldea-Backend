import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import connectDB from "../../src/config/database.js";
import User from "../../src/models/User.js";

beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});


describe("AUTH API tests", () => {

    test("Erabiltzailea erregistratzen da (201)", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test",
                lastName: "User",
                email: "testapi@uni.eus",
                password: "123456"
            });

        expect(res.statusCode).toBe(201);
    });

    test("Login zuzena (200)", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "testapi@uni.eus",
                password: "123456"
            });

        expect(res.statusCode).toBe(200);
    });

    test("Login okerra (401)", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "testapi@uni.eus",
                password: "okerra"
            });

        expect(res.statusCode).toBe(401);
    });

    test("Login + Logout zuzena (200)", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "testapi@uni.eus",
                password: "123456"
            });

        const res = await agent.post("/api/auth/logout");

        expect(res.statusCode).toBe(200);
    });

});
