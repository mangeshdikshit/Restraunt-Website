const joi= require("joi");

const reservationValidation=joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    mobileNo: joi.number().required(),
    tableFor: joi.number().required(),
    dateTime: joi.date().required(),
});

module.exports=reservationValidation;