import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/Task";

const router = Router();

// GET: Fetch all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await AppDataSource.getRepository(Task).find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching tasks from database" });
    }
});

// POST: Create a new task
router.post("/", async (req, res) => {
    try {
        const taskRepo = AppDataSource.getRepository(Task);
        const newTask = taskRepo.create(req.body);
        const savedTask = await taskRepo.save(newTask);
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: "Failed to create task" });
    }
});

// PUT: Update an existing task
router.put("/:id", async (req, res) => {
    try {
        const taskRepo = AppDataSource.getRepository(Task);
        const task = await taskRepo.findOneBy({ id: parseInt(req.params.id) });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        taskRepo.merge(task, req.body);
        const updatedTask = await taskRepo.save(task);
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: "Failed to update task" });
    }
});

// DELETE: Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const taskRepo = AppDataSource.getRepository(Task);
        const result = await taskRepo.delete(parseInt(req.params.id));
        
        if (result.affected === 0) {
            return res.status(404).json({ message: "Task not found to delete" });
        }
        
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: "Failed to delete task" });
    }
});

export default router;