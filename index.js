const express = require('express')
const nodemailer = require("nodemailer");
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Contact = require('./models/Contact')
const { check, validationResult }
    = require('express-validator');


// connection to db

mongoose.connect('mongodb+srv://admin-summit:2146255sb8@cluster0.fyuq8.mongodb.net/contact_db').then(()=>{
    console.log(`Database connected!`);
}).catch((e)=>{
    console.log(e);
})
const app = express()
app.use(cors())
app.use(express.json())

app.post('/contact',[
    check('email', 'Invalid Email')
                    .isEmail().isLength({ min: 10, max: 30 }),
   
],async (req,res)=>{
    const {email,fname,lname,message} = req.body;

    const errors =validationResult(req);


    if(!errors.isEmpty()){
        return res.status(200).send({error:"😞 Invalid Email address"})
    }

 



    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user:'reactgraminfo@gmail.com',
            pass: '2146255$b8'
        }
    });
      const mailOptions = {
        from: 'reactgraminfo@gmail.com', // sender address
        to: 'sb78639@gmail.com', // list of receivers
        subject: `Quient Messages`, // Subject line
        html: `<div style="width:90%;padding:15px;box-shadow:10px 10px 10px 0 rgba(0,0,0,.115)">
        <h1>Quient Message</h1>
        <h3>${fname} ${lname}</h3>
        <p>${message}</p>
        <p>-by email: ${email}
        </div>`
        
        // plain text body
      };

      new Contact({
          first_name:fname,
          last_name:lname,
          email,
          message
      }).save().then(()=>{
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                console.log(err)
                return res.status(200).send({error:"😩 Error in Sending Message,Try Again!"})
            }
            res.status(200).send({message:"🎉 Thank you for contacting us!"})
    
         })
      })

      


}).delete('/contact/:id',async (req,res)=>{
    const {id} = req.params;
    console.log(id);

    Contact.deleteOne({_id:id}).then(async ()=>{
        const responses = await Contact.find()
        res.status(200).send({contacts:responses})
    })
}).
get('/contact/:type',async (req,res)=>{
    const {type} = req.params;
    if(type==="fname"){
        const responses = await Contact.find().sort({'first_name':1})
        res.status(200).send(responses)
    }
    else if(type==="lname"){
        const responses = await Contact.find().sort({'last_name':1})
        res.status(200).send(responses)
    }
    else if(type==="email"){
        const responses = await Contact.find().sort({'email':1})
        res.status(200).send(responses)
    }
    else if(type==="message"){
        const responses = await Contact.find().sort({'message':1})
        res.status(200).send(responses)
    }
    else{
        const responses = await Contact.find()
        res.status(200).send(responses)
    }
    
}).
post('/feedback/search',async (req,res)=>{
   
    let responses = await Contact.find();
    responses = responses.filter((response)=>response.first_name.toLowerCase().includes(req.body.key.toLowerCase()))
    res.status(200).send(responses);
}).
get('/contact',async (req,res)=>{
    const contacts = await Contact.find();
    res.status(200).send(contacts)
})
.post('/admin/login',async (req,res)=>{
    const {username,password} = req.body;
    

    if(!username || !password){
        return res.status(200).send({error:"All field required!"});
    }

    if(username === "admin" && password ==="admin@mail"){
        const token = await jwt.sign({email:"admin@mail"},"mytopsecret");
        res.status(200).send({token});
    }
    else{
        res.status(200).send({error:"Wrong Admin credidentails!"});
    }
})


const port = process.env.PORT || 5000


app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})