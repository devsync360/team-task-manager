import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_enterprise_key";

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        // 1. Check if user already exists
        const existing = await userRepo.findOneBy({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 2. Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepo.create({ name, email, password: hashedPassword });
        await userRepo.save(user);

        // 3. Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

        // CRITICAL: Returning exact format React expects -> { token, user }
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server error during registration" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOneBy({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// Fetch all users for the "Assign To" dropdown
router.get("/users", async (req, res) => {
    try {
        const users = await AppDataSource.getRepository(User).find({
            select: ["id", "name", "email"] // Don't send passwords to frontend!
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

export default router;