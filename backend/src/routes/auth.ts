import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "enterprise_secret_key";

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({ name, email, password: hashedPassword });
        await userRepository.save(user);

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/users", async (req, res) => {
    const users = await AppDataSource.getRepository(User).find({ select: ["id", "name", "email"] });
    res.json(users);
});

export default router;