import { pool } from '../utils/db.js';
import { Router } from "express";

const encountersRouter = Router();

// Get Pantients encounter

encountersRouter.get("/", async (req, res) => {
    console.log("here 1")

    const results = await pool.query(`SELECT * FROM encounters WHERE is_delete=0`)

    console.log("here 2")

    return res.json({
        data: results.rows
    });
});

export default encountersRouter;