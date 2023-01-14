import { pool } from '../utils/db.js';
import { Router } from "express";

const encountersRouter = Router();

// Get Pantients encounter

encountersRouter.get("/", async (req, res) => {

    const results = await pool.query(`SELECT * FROM encounters WHERE is_delete=0`)
    return res.json({
        data: results.rows
    });
});

// Update Pantient Encounter by ID

encountersRouter.put("/:id", async (req, res) => {

    const updatedPost = {
        ...req.body,
        visit: new Date()
    };

    const encounterId = req.params.id;

    console.log("here")
    console.log(encounterId)

    await pool.query(`
    UPDATE encounters
	SET visit=$2, discharge=$3, physicalexamination=$4, historyofillness=$5, followup=$6 WHERE encounterId = $1`

        , [
            encounterId,
            updatedPost.visit,
            updatedPost.discharge,
            updatedPost.physicalexamination,
            updatedPost.historyofillness,
            updatedPost.followup
        ])

    return res.json({
        message: `This encounter has been updated.`,
    });

})

export default encountersRouter;