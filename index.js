const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Menu = require("./models/menu.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const schemaValidation = require("./schemaValidation.js");
const { wrap } = require("module");
const Reservation = require("./models/reservation.js");
const reservationValidation = require("./reservationValidation.js");

// const data = require("./init.js");
// const { copyFileSync } = require("fs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const AdminUserName="admin";
const AdminPassword="123456";
let AdminAccess=0;




main()
  .then((result) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/restraunt");
}

const menuValidate = (req, res, next) => {
  let result = schemaValidation.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

const reservationValidate = (req, res, next) => {
  let result = reservationValidation.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});

app.get(
  "/restraunt",
  wrapAsync(async (req, res) => {
    res.redirect("/restraunt/home");
  })
);

app.get(
  "/restraunt/home",
  wrapAsync(async (req, res) => {
    res.render("./user/home.ejs");
  })
);

app.get(
  "/restraunt/menu",
  wrapAsync(async (req, res) => {
    let data = await Menu.find({});
    res.render("./user/menu.ejs", { data });
  })
);

app.get("/admin",wrapAsync(async (req,res)=>{
  res.render("./admin/admin.ejs");
}));

app.post("/admin",wrapAsync(async (req,res)=>{
  let data=req.body;
  if(data.username===AdminUserName && data.password===AdminPassword){
    AdminAccess=1;
    res.redirect("/admin/menu");
  }
  else{
    res.redirect("/admin/menu");
  }
}));

app.use("/admin/",(req,res,next)=>{
  if(AdminAccess===1){
    next();
  }
  else{
    next(new ExpressError(401,"ACCESS DENIED!"));
    // res.redirect("/admin/menu");
  }
});



app.get(
  "/admin/menu",
  wrapAsync(async (req, res) => {
    let data = await Menu.find({});
    res.render("./admin/menu.ejs", { data });
  })
);

app.get(
  "/admin/menu/new",
  wrapAsync(async (req, res) => {
    res.render("./admin/new.ejs");
  })
);

app.post(
  "/admin/menu",
  menuValidate,
  wrapAsync(async (req, res) => {
    let menu = new Menu(req.body);

    await menu.save();
    res.redirect("/admin/menu");
  })
);

app.get(
  "/admin/menu/:id/edit",
  wrapAsync(async (req, res) => {
    let data = await Menu.find({ _id: req.params.id });
    // console.log(data[0]);
    res.render("./admin/edit.ejs", data[0]);
  })
);

app.patch(
  "/admin/menu/:id",
  menuValidate,
  wrapAsync(async (req, res) => {
    await Menu.updateOne({ _id: req.params.id }, req.body);
    res.redirect("/admin/menu");
  })
);

app.delete(
  "/admin/menu/:id",
  wrapAsync(async (req, res) => {
    await Menu.deleteOne({ _id: req.params.id });
    res.redirect("/admin/menu");
  })
);

app.get(
  "/restraunt/reservation",
  wrapAsync(async (req, res) => {
    res.render("user/reservation.ejs");
  })
);

app.post(
  "/restraunt",
  reservationValidate,
  wrapAsync(async (req, res) => {
    const reservation = new Reservation(req.body);
    // console.log(reservation);
    await reservation.save();
    // console.log(new Date().getDate());
    res.redirect("/restraunt/reservation");
  })
);

app.get(
  "/admin/reservations",
  wrapAsync(async (req, res) => {
    let currentDate=new Date();
    currentDate=new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+1);
    currentDate.setUTCHours(0, 0, 0, 0);
    // console.log(currentDate);

    await Reservation.deleteMany({dateTime: {$lt: currentDate}});

    const data = await Reservation.find({}).sort({ dateTime: 1 });
    for (let i of data) {
      i.date = `${i.dateTime.getDate()}-${i.dateTime.toLocaleString(
        "en-us",
        { month: "long" }
      )}-${i.dateTime.getFullYear()}`;
      let hour = i.dateTime.getHours();
      let minutes = i.dateTime.getMinutes();

      let ampm = "am";
      if (hour > 12) {
        hour -= 12;
        ampm = "pm";
      } else if (hour === 0) {
        hour = 12; // 12:00 am is midnight
      }

      i.time = `${hour}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
    }

    res.render("./admin/reservations.ejs", { data });
  })
);

app.delete("/admin/reservations/:id",wrapAsync(async (req,res)=>{
  await Reservation.deleteOne({_id: req.params.id});
  res.redirect("/admin/reservations");
}));

app.get("/admin/logout",wrapAsync(async (req,res)=>{
  AdminAccess=0;
  res.redirect("/admin");
}));

app.get("/restraunt/gallary",wrapAsync(async (req,res)=>{
  let data = await Menu.find({});
  res.render("./user/gallary.ejs",{data});
}));

app.get("/restraunt/aboutus",wrapAsync(async (req,res)=>{
  res.render("./user/aboutus.ejs");
}));


app.get("*", (req, res, next) => {
  throw new ExpressError(404, "page not found");
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some error occured" } = err;

  res.status(status).render("./user/error.ejs", { message });
  // res.status(status).send(message);
});

//for deleting all the entries of documents in mongoDB

// Menu.deleteMany({})
// .then((result)=>{
//   console.log("all deleted");
// })
// .catch((err)=>{
//   console.log(err);
// });

//for inserting many entries of documents in mongoDB.

// Menu.insertMany(data.data)
// .then((res)=>{
//     console.log("inserted");
// })
// .catch((err)=>{
//     console.log(err);
// });
