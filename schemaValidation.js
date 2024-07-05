const joi= require("joi");

const schemaValidation=joi.object({
    dishName: joi.string().required(),
    price: joi.number().required(),
    description: joi.string().required(),
    imageLink: joi.string(),
    dishType: joi.string().required(),
});

module.exports=schemaValidation;