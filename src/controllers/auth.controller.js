import bcrypt from "bcrypt";
import User from "../models/User.js";

/*
200 OK                → Eragiketa arrakastatsua
201 Created           → Baliabidea sortu da
400 Bad Request       → Sarrera-datu baliogabeak
401 Unauthorized      → Autentifikaziorik ez / kredentzial okerrak
500 Internal Server   → Zerbitzariaren errorea
*/

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, lastName, email, password } = req.body;

        // 400 – sarrera-datu baliogabeak
        if (!name || !lastName || !email || !password) {
            return res.status(400).json({ message: "Sarrera-datu baliogabeak" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Emaila jada existitzen da" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Lehen erabiltzailea admin
        const usersCount = await User.countDocuments();
        let role;
        if (usersCount === 0) {
            role = "admin";
        } else {
            role = "user";
        }

        await User.create({
            name,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        // 201 – baliabidea sortua
        res.status(201).json({ message: "Erabiltzailea arrakastaz sortua" });

    } catch (error) {
        // 500 – zerbitzariaren errorea
        res.status(500).json({ message: "Zerbitzariaren errorea" });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 400 – sarrera-datu baliogabeak
        if (!email || !password) {
            return res.status(400).json({ message: "Sarrera-datu baliogabeak" });
        }

        const user = await User.findOne({ email });

        // 401 – ez dago autentifikatuta / kredentzial okerrak
        if (!user) {
            return res.status(401).json({ message: "Kredentzial okerrak" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Kredentzial okerrak" });
        }

        req.session.user = {
            id: user._id,
            role: user.role
        };

        // 200 – eragiketa arrakastatsua
        res.status(200).json({ message: "Saioa hasita" });

    } catch (error) {
        // 500 – zerbitzariaren errorea
        res.status(500).json({ message: "Zerbitzariaren errorea" });
    }
};

// LOGOUT
export const logout = (req, res) => {
    // 401 – erabiltzailea ez dago autentifikatuta
    if (!req.session.user) {
        return res.status(401).json({ message: "Ez dago saiorik hasita" });
    }

    req.session.destroy(() => {
        // 200 – eragiketa arrakastatsua
        res.status(200).json({ message: "Saioa itxita" });
    });
};
