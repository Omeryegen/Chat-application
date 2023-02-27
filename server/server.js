const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const { User, Chat} = require('./database')
const dotenv = require('dotenv').config();
const bcrypt = require("bcrypt")
const saltRound = 10
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

mongoose.set('strictQuery', true)
const port = process.env.PORT


app.use(cors());
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
 


    

app.get('/users',  (req , res) =>{
    User.find({}, (err, searchedUser) =>{
        if(!err){
            res.json(searchedUser)
        }else{
            res.status(400).json('No match')
        } 
    })
});
    


app.get('/account/:email', async (req , res) =>{
    const {email} = req.params
    const account = await User.find({email:email})
    if(account.length) {
        res.json(account)
    }else{
        res.status(400).json('No match')
    }
    
});

app.post('/login', async (req,res) =>{
    const{password, email} = req.body
    const user =  await User.exists({email: email})
    if(user){
        try{
            const data = await User.find({email:email})
            const success = await bcrypt.compare(password, data[0].password)
            if(success){
                const token = jwt.sign({email}, 'secret', {expiresIn: "10min"})
                res.status(200).json({email: email, token:token})
            }else{
                res.status(400).json({details: "Error"})
            }
        }catch (error){
            res.status(400).json({detail: "Wrong happened!"})
        }
    }else{
        res.status(400).json({detail:"User exists!"})
    }
})

app.post('/register', async (req,res) =>{
    const{password, email, name, surname, profileImg} = req.body
    const nameLower = name.toLowerCase() + " " + surname.toLowerCase()
    const user =  await User.exists({email: email})
    if(!user){
        bcrypt.genSalt(saltRound, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                const newUser = new User({ userName: nameLower,friends:[], email: email, password: hash, profileImg})
                newUser.save()
                    .then(response => {
                        const token = jwt.sign({email}, "secret", {expiresIn: "10min"})
                        res.status(200).json({email, token})
                    })
                    .catch(error => res.status(400).json(error))
            });
        });
    }else{
        res.status(400).json({detail:"User exists!"})
    } 
});

app.post('/friend', async (req, res) =>{
   
    const{friendEmail, userEmail} = req.body
    const update = await User.findOneAndUpdate({email: userEmail}, { "$push": { "friends": friendEmail }}, { "new": true, "upsert": true })
    res.status(200).json('finish')
   
})
app.delete('/friend', async (req, res) =>{
    const{friendEmail, userEmail} = req.body
    const update = await User.findOneAndUpdate({email: userEmail}, { "$pull": { "friends": friendEmail }}, { "new": true, "upsert": true })
    res.status(200).json({detail:"hello"});
})

app.post('/chat', async (req, res) =>{
    const{friendEmail, userEmail} = req.body
    const chatId = friendEmail + userEmail
    const newChat = new Chat({id: chatId, chat: []})
    const data = await  newChat.save()
    res.status(200).json(data[0]);
    
});
app.delete('/chat', async (req, res) =>{
    const{friendEmail, userEmail} = req.body
    const chatId = friendEmail + userEmail
    const chatIdSec = userEmail + friendEmail
    const data1 = await Chat.find({id: chatId})
    const data2 = await Chat.find({id: chatIdSec})
   /* if(data1.length === 1) {*/
        const data1Delete = await Chat.findOneAndDelete({id: chatId})
        /*if(data1Delete.length === 1){
            res.status(200).json(data1Delete[0]);
        }*/
    /*}else if(data2.length === 1){*/
        const data2Delete = await Chat.findOneAndDelete({id: chatIdSec})
       /* if(data2Delete.length === 1){
            res.status(200).json(data2Delete[0]);
        }*/
    /*}*/
    res.status(200).json({detail: "success"})
});

app.post('/singleChat', async (req, res) =>{
    const{friendEmail, userEmail} = req.body
    const chatId = friendEmail + userEmail
    const chatIdSec = userEmail + friendEmail
    const data1 = await Chat.find({id: chatId})
    const data2 = await Chat.find({id: chatIdSec})
    if(data1.length === 1){
        res.status(200).json(data1[0])
    }else if(data2.length === 1){
        res.status(200).json(data2[0])
    }
});

app.post('/message', async (req, res) =>{
    const{friendEmail, userEmail, message} = req.body
    const chatId = friendEmail + userEmail
    const chatIdSec = userEmail + friendEmail
    const data1 = await Chat.find({id: chatId})
    const data2 = await Chat.find({id: chatIdSec})
    if(data1.length === 1){
        const update = await Chat.findOneAndUpdate({id: chatId}, { "$push": { "chat": {email: userEmail, message: message} }}, { "new": true, "upsert": true })
        res.status(200).json(data1[0])
    }else if(data2.length === 1){
        const update = await Chat.findOneAndUpdate({id: chatIdSec}, { "$push": { "chat": {email: userEmail, message: message} }}, { "new": true, "upsert": true })
        res.status(200).json(data2[0])
    }
});

mongoose.connect(process.env.MONGODB)
    .then(response =>{
        app.listen(port, () =>{
            console.log("Listening this port: " + port);
        });
    })
    .catch(err =>{
        console.log(err);
    });