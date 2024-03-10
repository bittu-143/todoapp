const port = process.env.port ?? 8000;
import express from "express";
//import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import {v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt"; //used to hash password
import jwt from "jsonwebtoken";
import pg from "pg";

const db = new pg.Pool({
  connectionString: "postgres://default:o93yvFXIGxzg@ep-orange-math-a43s5dhd-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
});
db.connect((e)=>{if(e) throw e; console.log("connected to db")});

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
// const db = new pg.Client({
//     user: process.env.user,
//     host: process.env.host,
//     database: process.env.database,
//     password: process.env.password,
//     port: process.env.dbport
// });
// db.connect();

//getting todos
app.get('/todos/:userEmail',async (req,res)=>{
    //console.log(req);
    const {userEmail} = req.params; 
    try{
        const todos = await db.query("select * from todos where user_email=$1",[userEmail]);
        res.json(todos.rows);
    }catch(e){
        console.log("error in todos",e.message);
        res.status(500).json({error:"Internal server error"});
    }
});

//creating new post
app.post("/todos",async (req,res)=>{
    const {user_email,title,progress,date} = req.body;
    const id = uuidv4();
    console.log(user_email, title, progress, date);
    try{
        const newTodo = await db.query("insert into todos (id,user_email,title,progress,date) values ($1,$2,$3,$4,$5)",[id,user_email,title,progress,date]);
        res.json(newTodo);
    }catch(e){
        console.log("error in creating new post in app post ",e.message);
    }
});

//editing post
app.put("/todos/:id",async (req,res)=>{
    const {id} = req.params;
    const {user_email,title,progress,date} = req.body;
    console.log(user_email, title, progress, date);
    try{
        const editedTodo = await db.query("update todos set user_email = $1,title = $2,progress = $3,date = $4 where id = $5",[user_email,title,progress,date,id]);
        res.json(editedTodo);

    }catch(e){
        console.log("error in editing post in app put ",e.message);
    }
});

app.delete("/todos/:id", async (req,res)=>{
    const {id} = req.params;
    console.log(id);
    try{
        const deletedTodo = await db.query("delete from todos where id = $1",[id]);
        res.json(deletedTodo);

    }catch(e){
        console.log("error in deleting post in app put ",e.message);
    }
})

//signup

app.post('/signup',async (req,res)=>{
    const {email,password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password,salt);
    try{
        const signUp = await db.query("insert into users (email,hashed_password) values($1,$2)",[email,hashedPassword]);
        const token = jwt.sign({email},'secret',{expiresIn:'1hr'}); //this creates a token by signing it with email and time duration 
        // here secret is a default mandatory field
        res.json({email,token});
    }catch(e){
        console.log("error in server signup ",e.message);
        if(e){
            res.json({detail: e.detail})
        }
    }
})

//login
app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try{
        const users = await db.query("select * from users where email=$1",[email]);
        if(!users.rows.length) return res.json({detail: "user does not exist"});
        console.log(password, users.rows[0]);
        const success = await bcrypt.compareSync(password,users.rows[0].hashed_password);
        const token = jwt.sign({email},'secret',{expiresIn:'1hr'}); 
        if(success){
            res.json({"email":users.rows[0].email,token});
        } else{
            res.json({detail:"Login Failed"});
        }
    }catch(e){
        console.log("error in server signup ",e.message);
        if(e){
            res.json({detail: e.detail})
        }
    }
})

app.listen(process.env.PORT,()=>console.log(`running server on port ${port}`));