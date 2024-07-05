const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  dishName: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imageLink: {
    type: String,
    default:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/464303942.jpg?k=24e506ebac37b9faee6d31c754f97af1b1362355fc4a28cf7bb4ec72624cfc5d&o=&hp=1",
    set: (v) =>
      v === ""
        ? "https://cf.bstatic.com/xdata/images/hotel/max1024x768/464303942.jpg?k=24e506ebac37b9faee6d31c754f97af1b1362355fc4a28cf7bb4ec72624cfc5d&o=&hp=1"
        : v,
  },
  dishType:{
    type:String,
    require: true,
  },
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;