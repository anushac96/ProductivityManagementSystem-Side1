const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

//const db = mysql.createPool
const db = mysql.createPool({
    host: "localhost",
    user:"anushahadagali",
    password:"Animallover@3006",
    database:"KaryaDB"
})

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
        console.log("india");
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
                        console.log("Sign in successful");// Here, send the userId in the response
                        console.log("111111111");
                        const userId = result[0].userId; // Extract userId from the result
                        
                        // Optionally, you can return user data here if needed
                        //res.status(200).json({auth: true, success: true, message: "Sign in successful", token:token, result:result, userId: result[0].userId});
                        res.status(200).json({auth: true, success: true, message: "Sign in successful", userId: userId});
                    } else {
                        // Passwords don't match, sign-in failed
                        console.log("Incorrect password");
                        console.log("22222222222");
                        res.status(401).json({ auth: false, success: false, message: "Incorrect email or password" });
                    }
                } else {
                    // No user found with the provided email, sign-in failed
                    console.log("User not found");
                    console.log("3333333333");
                    res.status(401).json({ auth: false, success: false, message: "User not found" });
                }
            }
        });
    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({ success: false, message: "Failed to sign in" });
    }
});

// Add a new endpoint to insert events for a specific user
app.post("/addEvents", (req, res) => {
    const userId = req.body.userId;
    const eventName = req.body.eventName;
    const eventTimeFrom = req.body.startTime;
    const eventTimeTo = req.body.endTime;

    try {
        console.log("hello");
        console.log("eventTimeFrom: ",eventTimeFrom);
        console.log("req.body.startTime: ",req.body.startTime);
        const sqlInsert = "INSERT INTO events (userId, eventName, startTime, endTime) VALUES (?, ?, ?, ?)";
        db.query(sqlInsert, [userId, eventName, eventTimeFrom, eventTimeTo], (err, result) => {
            if (err) {
                console.error("Error inserting event:", err);
               res.status(500).json({ success: false, message: "Failed to add event" });
            } else {
               console.log("Event added successfully");
                res.status(200).json({ success: true, message: "Event added successfully" });
        }
    });} catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ success: false, message: "Failed to register user" });
    }
});

app.listen(3001,()=>{
    console.log("running");
})
