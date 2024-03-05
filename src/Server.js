const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
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

app.post("/signup", async(req, res) => {
    const username = req.body.username;
    const userpwd  = req.body.userpwd;
    const useremailid = req.body.useremailid;
    console.log(username);
    console.log(userpwd);
    console.log(useremailid);
    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(userpwd, 10); // 10 is the number of salt rounds

        // Insert the hashed password into the database
        const sqlInsert = "INSERT INTO users (username, userpwd, useremailid) VALUES (?, ?, ?)";
        db.query(sqlInsert, [username, hashedPassword, useremailid], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                res.status(500).json({ success: false, message: "Failed to register user" });
            } else {
                console.log("User registered successfully");
                res.status(200).json({ success: true, message: "User registered successfully" });
            }
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ success: false, message: "Failed to register user" });
    }
});

// Add a new route for handling sign-in requests
app.post("/signin", async (req, res) => {
    const useremailid = req.body.email;
    const userpwd = req.body.pwd;
    try {
        // Retrieve the user record from the database based on the provided email
        const sqlSelect = "SELECT * FROM users WHERE useremailid = ?";
        db.query(sqlSelect, [useremailid], async (err, result) => {
            if (err) {
                console.error("Error querying database:", err);
                res.status(500).json({ success: false, message: "Failed to sign in" });
            } else {
                // Check if the user with the provided email exists
                if (result.length > 0) {
                    // Compare the provided password with the hashed password stored in the database
                    const match = await bcrypt.compare(userpwd, result[0].userpwd);
                    if (match) {
                        // Passwords match, sign-in successful
                        console.log("Sign in successful");

                        // const id = result[0].userId
                        // const token = jwt.sign({id},"jwtSecret",{
                        //     expiresIn:300   // 5min
                        // })
                        // Optionally, you can return user data here if needed
                        res.status(200).json({auth: true, success: true, message: "Sign in successful", token:token, result:result});
                        //res.status(200).json({auth: true, success: true, message: "Sign in successful", token:token, result:result});
                    } else {
                        // Passwords don't match, sign-in failed
                        console.log("Incorrect password");
                        res.status(401).json({ success: false, message: "Incorrect email or password" });
                    }
                } else {
                    // No user found with the provided email, sign-in failed
                    console.log("User not found");
                    res.status(401).json({ success: false, message: "User not found" });
                }
            }
        });
    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({ success: false, message: "Failed to sign in" });
    }
});

app.listen(3001,()=>{
    console.log("running");
})
