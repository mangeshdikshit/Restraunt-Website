const { string } = require("joi");
const mongoose=require("mongoose");

const reservationSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    mobileNo:{
        type:Number,
        require:true,
    },
    tableFor:{
        type:Number,
        require:true,
    },
    dateTime:{
        type:Date,
        require:true,
    },
});

const Reservation = mongoose.model("Reservation",reservationSchema);

module.exports=Reservation;