const {model,Schema} = require('mongoose')



const contact_schema = new Schema({
    first_name:{
        type:"String",
        required:true
    },
    last_name:{
        type:"String",
        required:true
    },
    email:{
        type:"String",
        required:true
    },
    message:{
        type:"String",
        required:true
    }
},{
    timestamps:true
})



const Contact = model('contact',contact_schema);

module.exports = Contact;