import { pool } from '../utils/db.js';
import { Router } from "express";

const patientRouter = Router();

// Get Pantients

patientRouter.get("/", async (req, res) => {

    const searchKey = req.body.searchKey || "";

    let query = "";
    let values = [];

    if (searchKey) {
        query = `SELECT * FROM patients WHERE (firstname= $1 OR middlename= $1 OR lastname = $1) AND is_delete=0`;
        values = [searchKey];
    } else {
        query = `SELECT * FROM patients WHERE is_delete=0`
    }

    const results = await pool.query(query, values)

    return res.json({
        data: results.rows
    });
});

patientRouter.get("/:id", async (req, res) => {

    const pantientId = req.params.id

    const results = await pool.query(`SELECT * FROM patients WHERE is_delete=0 AND patientId=$1 `, [pantientId])

    return res.json({
        data: results.rows[0]
    });
});



patientRouter.get("/:id/encounter", async (req, res) => {

    const pantientId = req.params.id

    const results = await pool.query(`SELECT * FROM encounters WHERE patientId = $1 AND is_delete=0 `, [pantientId])
    return res.json({
        data: results.rows[0]
    });

});

//Create Pantient

patientRouter.post("/", async (req, res) => {

    const newPatient = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
    };

    await pool.query(`
    INSERT INTO patients(
	firstname, middlename, lastname, birthdate, createdat, updatedat)
	VALUES ($1, $2, $3, $4, $5, $6); 
    `, [
        newPatient.firstname,
        newPatient.middlename,
        newPatient.lastname,
        newPatient.birthdate,
        newPatient.created_at,
        newPatient.updated_at
    ]);

    return res.json({
        message: "Pantient has been created.",
    });
});

// Create Pantient Encounter by ID

patientRouter.post("/:id/encounter", async (req, res) => {

    const pantientId = req.params.id

    const newEncounter = {
        ...req.body,
        visit: new Date(),
    };

    await pool.query(`
    INSERT INTO encounters(
	 visit, discharge, physicalexamination, historyofillness, followup, patientid)
	VALUES ($1,$2,$3,$4,$5,$6);
    `, [
        newEncounter.visit,
        newEncounter.discharge,
        newEncounter.physicalexamination,
        newEncounter.historyofillness,
        newEncounter.followup,
        pantientId,
    ]);

    return res.json({
        message: "encounter has been created.",
    });
});

// Update Pantient by ID

patientRouter.put("/:id", async (req, res) => {

    const updatedPost = {
        ...req.body,
        updated_at: new Date()
    };

    const pantientId = req.params.id;

    await pool.query(`
    UPDATE patients
	SET firstname=$2, middlename=$3, lastname=$4, birthdate=$5, updatedat=$6 WHERE patientId = $1`

        , [
            pantientId,
            updatedPost.firstname,
            updatedPost.middlename,
            updatedPost.lastname,
            updatedPost.birthdate,
            updatedPost.updated_at
        ])

    return res.json({
        message: `Post ${updatedPost.firstname} has been updated.`,
    });

})

// Update Pantient Encounter by ID

patientRouter.put("/encounter/:id", async (req, res) => {

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

//Soft Delete Pantient by ID

patientRouter.delete("/:id", async (req, res) => {

    const deletePost = {
        ...req.body,
        delete_when: new Date()
    }

    const pantientId = req.params.id;

    await pool.query(`
    UPDATE patients
	SET is_delete = 1, delete_when=$2  WHERE patientId = $1`
        , [
            pantientId,
            deletePost.delete_when,
        ])

    return res.json({
        message: `This Pantient has been deleted.`,
    });
});

//Soft Delete Pantient Encouter by ID

patientRouter.delete("/encounter/:id", async (req, res) => {

    const deletePost = {
        ...req.body,
        delete_when: new Date()
    }

    const encounterId = req.params.id;

    await pool.query(`
    UPDATE encounters
	SET is_delete = 1, delete_when=$2  WHERE encounterId = $1`
        , [
            encounterId,
            deletePost.delete_when,
        ])

    return res.json({
        message: `encounter ${encounterId} has been deleted.`,
    });
});

export default patientRouter;