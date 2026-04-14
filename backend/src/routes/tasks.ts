import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/Task";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();
const taskRepo = AppDataSource.getRepository(Task);

router.use(verifyToken); // Protect all task routes

router.get("/", async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    const tasks = await taskRepo.find({
        where: [
            { createdBy: { id: userId } },
            { assignedTo: { id: userId } }
        ],
        relations: ["createdBy", "assignedTo"]
    });
    
    // Map to exactly what your React frontend expects
    const formatted = tasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        createdBy: t.createdBy?.id,
        assignedTo: t.assignedTo?.id,
        createdAt: t.createdAt
    }));
    res.json(formatted);
});

router.post("/", async (req: AuthRequest, res) => {
    const { title, description, assignedTo, status } = req.body;
    const task = taskRepo.create({
        title,
        description,
        status: status || "Pending",
        createdBy: { id: req.user?.id },
        assignedTo: { id: assignedTo }
    });
    await taskRepo.save(task);
    res.status(201).json(task);
});

router.put("/:id", async (req: AuthRequest, res) => {
    const { title, description, assignedTo, status } = req.body;
    // FIX: Added 'as string' here
    const task = await taskRepo.findOneBy({ id: parseInt(req.params.id as string) });
    if (!task) return res.status(404).json({ message: "Not found" });

    task.title = title;
    task.description = description;
    task.status = status;
    task.assignedTo = { id: assignedTo } as any;

    await taskRepo.save(task);
    res.json(task);
});

router.delete("/:id", async (req: AuthRequest, res) => {
    const task = await taskRepo.findOne({ 
        // FIX: Added 'as string' here
        where: { id: parseInt(req.params.id as string) },
        relations: ["createdBy"] 
    });

    if (!task) return res.status(404).json({ message: "Not found" });
    
    // CRITICAL: Only creator can delete
    if (task.createdBy.id !== req.user?.id) {
        return res.status(403).json({ message: "Only creator can delete" });
    }

    await taskRepo.remove(task);
    res.json({ message: "Deleted" });
});

export default router;