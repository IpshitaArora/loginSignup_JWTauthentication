const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const LogInCollection = require("./mongodb");


const templatePath=path.join(__dirname, '../templates');

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({extended:true}));



app.get("/", (req,res)=>{
    res.render("login");
});

app.get("/signup", (req,res)=>{
    res.render("signup");
});


app.post("/signup", async(req,res)=>{
    try{
        console.log(req.body);
        const data={
            name: req.body.name,
            password: req.body.password
    };

    await LogInCollection.insertMany([data]);
    res.render("home");
    } catch (error){
        console.error("signup error:", error);
        res.status(500).send("signup failed");
    }
});

app.post("/login", async(req,res)=>{
 
    try {
        const check = await LogInCollection.findOne({name:req.body.name});

if (!check) {
        return res.send("User not found");
    }
        if(check.password === req.body.password){
            return res.render("home");
        } else{
           return res.send("Wrong password");
        }

    } catch (error) {
        res.send("wrong details");
    }
});


app.listen(3000,()=>{
    console.log("port connected");
});
