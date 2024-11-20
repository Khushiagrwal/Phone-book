const express = require("express");
const conn = require("../database/db");
const router = express.Router();


router.post("/add", async (req, res) => {
    const { first_name, middle_name, last_name, email, phone_1, phone_2, address } = req.body;

    if (!first_name || !last_name || !email || !address) {
        return res.status(400).json({ message: "Please provide all required fields except middle_name and phone numbers." });
    }

    if (!phone_1 && !phone_2) {
        return res.status(400).json({ message: "Please provide at least one phone number (phone_1 or phone_2)." });
    }

    try {
        const [rows] = await conn.query("SELECT * FROM contacts WHERE email = ?", [email]);

        if (rows.length > 0) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        const [result] = await conn.query("INSERT INTO contacts SET ?", { first_name, middle_name, last_name, email, phone_1, phone_2, address });
        
        return res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/list", async (req, res) => {
    try {
        console.log(req.query)
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;
        const [rows] = await conn.query("SELECT * FROM contacts LIMIT ?, ?", [offset, limit]);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/remove/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await conn.query("DELETE FROM contacts WHERE id = ?", [id]);
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/modify/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    
    try {
        await conn.query("UPDATE contacts SET ? WHERE id = ?", [data, id]);
        return res.status(200).json({ success: true, message: "User updated successfully." });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});

module.exports = router;
