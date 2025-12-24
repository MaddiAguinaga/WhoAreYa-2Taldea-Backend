
import express from "express";
import path from "path";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(process.cwd(), "src", "public")));

// Proba route
app.get("/", (req, res) => {
    res.send("WhoAreYa Backend is running");
});

export default app;
