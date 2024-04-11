const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require ('./models/FormData');
require('dotenv').config();

const PORT = process.env.PORT || 3001; 
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({  extended: true }));
// use dbURI for atlas cluster
const dbURI = process.env.MONGO_URI;
// use localURI for local host
const localURI=process.env.MONGO_URI_LOCAL;

// Determine the environment and choose the appropriate DB URI
// const isProduction = process.env.NODE_ENV === 'production';
// const dbURI = isProduction ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL;

mongoose
  .connect(localURI)
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch((e) => {
    console.log(e);
  });


//mongodb+srv://adilwahla360:u6Ru7cNLzRE3bwI3@cluster0.h1gisgv.mongodb.net/
app.post('/register', (req, res)=>{
    // To post / insert data into database

    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            res.json("Already registered")
        }
        else{
            FormDataModel.create(req.body)
            .then(log_reg_form => res.json(log_reg_form))
            .catch(err => res.json(err))
        }
    })
    
})

app.post('/login', (req, res)=>{
    // To find record from the database
    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            // If user found then these 2 cases
            if(user.password === password) {
                res.json("Success");
            }
            else{
                res.json("Wrong password");
            }
        }
        // If user not found then 
        else{
            res.json("No records found! ");
        }
    })
})
 // Use PORT from .env or default to 3001
 app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
  });