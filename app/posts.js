import { pool } from '../utils/db.js';
import { Router } from "express";

const patientRouter = Router();

patientRouter.get("/", async (req, res) => {

    const searchKey = req.body.searchKey || "";
    console.log("here")
    console.log(req.body)

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

patientRouter.post("/", async (req, res) => {
    const newPatient = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
    };

    console.log(req.body)

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
        message: "Post has been created.",
    });
});

patientRouter.put("/", async (req, res) => {

    const updatedPost = {
        ...req.body,
        updated_at: new Date()
    };

    const whoPatient = [req.body.patient]

    let pantient = await pool.query(`
    SELECT patientId FROM patients WHERE firstname=$1 OR middlename=$1 OR lastname =$1
    `, whoPatient)

    const pantientWhoId = pantient.rows[0]

    console.log(updatedPost)

    await pool.query(`
    UPDATE patients
	SET firstname=$2, middlename=$3, lastname=$4, birthdate=$5, updatedat=$6 WHERE patientId = $1`
        , [
            pantientWhoId.patientid,
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

patientRouter.delete("/", async (req, res) => {

    const whoPatient = [req.body.patient]

    const deletePost = {
        ...req.body,
        delete_when: new Date()
    }

    let pantient = await pool.query(`
    SELECT patientId FROM patients WHERE firstname=$1 OR middlename=$1 OR lastname =$1
    `, whoPatient)

    const pantientWhoId = pantient.rows[0]

    await pool.query(`
    UPDATE patients
	SET is_delete = 1, delete_when=$2  WHERE patientId = $1`
        , [
            pantientWhoId.patientid,
            deletePost.delete_when,
        ])

    return res.json({
        message: `${whoPatient} has been deleted.`,
    });
});

patientRouter.delete("/:id", async (req, res) => {

    const pantientId = req.params.id;

    await pool.query(`DELETE FROM patients WHERE patientId=$1`, [pantientId])

    return res.json({
        message: `${req.body.firstname} has been deleted.`,
    });
});




export default patientRouter;