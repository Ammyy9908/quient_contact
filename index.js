const express = require('express')
const nodemailer = require("nodemailer");
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/contact',async (req,res)=>{
    const {email,fname,lname,message} = req.body;

 



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

      transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(err)
            return res.status(500).send({error:"Error in Sending Message,Try Again!"})
        }
        res.status(200).send({message:"Thank you for contacting us!"})

     })


})


const port = process.env.PORT || 5000


app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})