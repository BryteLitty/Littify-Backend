const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5")

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/Clients", {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(!err){
        console.log("DB Connected Successfully");
    } else {
        console.log(err)
    }
});

const clientSchema = {
    name: String,
    email: String,
    company: String
}


const Client = new mongoose.model("Client", clientSchema);

//Registered Users
const registeredUsers = new mongoose.Schema({
    fullname: String,
    address: String,
    phone: Number,
    email: String,
    password: String,
    confirmed: String
});

const secret = "Shitain'treallygottabeexciting";

const Registered = new mongoose.model("Registerd", registeredUsers);



app.get("/", function(req, res){
    res.render("login");
});

app.get("/index", function(req, res){
    res.render("index");
});

app.get("/docs", function(req, res){
    res.render("docs");
});

app.get("/features", function(req, res){
    res.render("features");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});



app.post("/send", function(req, res){
    let name = req.body.name;
    let email = req.body.email;
    let company = req.body.company;

    const client = new Client({
        name: name,
        email: email,
        company: company
    });

    client.save(function(err){
        if(err){
            console.log(err)
        } else{
            console.log("successful");
            res.redirect("/")
        }
    });
});



app.post("/register", function(req, res){
    let fullname = req.body.fullname;
    let address = req.body.address;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = req.body.password;
    let confirmed = req.body.confirmed;

    const newUser = new Registered ({ 
        fullname: fullname,
        address: address,
        email: email,
        phone: phone,
        password: md5(password),
        confirmed: confirmed
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("New")
            res.redirect("login")
        }
    })

});


app.post("/login", function(req, res){
    const email = req.body.email;
    const password = md5(req.body.password);

//Unthentication
    Registered.findOne({email: email}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    console.log(foundUser.fullname + " has logged in");
                    res.redirect("index")
                    
                }
            }else{
                console.log(err)
                console.log("not found");
                res.render("notFound")
        
            }
        }
    });

});


app.listen(3000, function(err){
    if(err){
        console.log(err)
    } else{
        console.log("Voom! It's live");
    }
});
