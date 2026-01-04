import express from "express";
import path from "path";
import session from "express-session";
import authRoutes from "./routes/api/auth.routes.js";
import playersRoutes from "./routes/api/players.routes.js";
import teamsRoutes from "./routes/api/teams.routes.js";
import leaguesRoutes from "./routes/api/leagues.routes.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SESSION
app.use(
    session({
       secret: "secret",
       resave: false,
       saveUninitialized: false
    })
);

// Static files
app.use(express.static(path.join(process.cwd(), "src", "public")));

// View engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));


// AUTH ROUTES
app.use("/api/auth", authRoutes);

// PLAYERS ROUTES
//app.use("/api/players", playersRoutes);
app.use("/players", playersRoutes);

// TEAMS ROUTES
app.use("/api/teams", teamsRoutes);

// LEAGUES ROUTES
app.use("/api/leagues", leaguesRoutes);

app.use("/admin", adminRoutes);


// Proba route
app.get("/", (req, res) => {
   res.send("WhoAreYa Backend is running");
});

// Ez bada route bilatu
app.use((req, res) => {
    res.status(404).json({ message: "Baliabidea ez da aurkitu" });
});





export default app;

