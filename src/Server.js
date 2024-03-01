const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

//const db = mysql.createPool
const db = mysql.createPool({
    host: "localhost",
    user:"anushahadagali",
    password:"Animallover@3006",
    database:"KaryaDB"
})

// app.get("/",(req,res) =>{
//     const sqlInsert = "INSERT INTO users (username, userpwd, useremailid) VALUES ('dummy_user', 'dummy_password_hash', 'dummy@example.com');"
//     db.query(sqlInsert,(err,result)=>{
//         res.send("hello peoples");
        
//     })
// });

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const userpwd  = req.body.userpwd;
    const useremailid = req.body.useremailid;
    console.log(username);
    console.log(userpwd);
    console.log(useremailid);
    const sqlInsert = "INSERT INTO users (username, userpwd, useremailid) VALUES (?, ?, ?)";
    db.query(sqlInsert, [username, userpwd, useremailid], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).json({ success: false, message: "Failed to register user" });
        } else {
            console.log("User registered successfully");
            res.status(200).json({ success: true, message: "User registered successfully" });
        }
    });
});

app.listen(3001,()=>{
    console.log("running");
})
