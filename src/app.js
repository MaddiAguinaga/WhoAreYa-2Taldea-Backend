import express from "express";
import path from "path";
import session from "express-session";
import authRoutes from "./routes/api/auth.routes.js";
import playersRoutes from "./routes/api/players.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SESSION (oso sinplea, milestone-rako nahikoa)
app.use(
    session({
       secret: "secret",
       resave: false,
       saveUninitialized: false
    })
);

// Static files
app.use(express.static(path.join(process.cwd(), "src", "public")));

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// PLAYERS ROUTES
app.use("/api/players", playersRoutes);

// Proba route
app.get("/", (req, res) => {
   res.send("WhoAreYa Backend is running");
});

// Ez bada route bilatu
app.use((req, res) => {
    res.status(404).json({ message: "Baliabidea ez da aurkitu" });
});





export default app;
