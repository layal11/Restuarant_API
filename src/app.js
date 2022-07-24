const express = require("express");
const dotenv = require('dotenv').config();

const database = require("../config/database");
database.connect();

const app = express();


var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const UserRoute = require("../routes/UserRoute");
app.use("/user", UserRoute);

const RestaurantRoute = require("../routes/RestaurantRoute");
app.use("/restaurant", RestaurantRoute);

const AddressRoute = require("../routes/AddressRoute");
app.use("/address", AddressRoute);

const CategoryRoute = require("../routes/CategoryRoute");
app.use("/category", CategoryRoute);

const ItemRoute = require("../routes/ItemRoute");
app.use("/item", ItemRoute);

// search querying
// DocumentSummary.find({$or:[
// 	{sourceText:{$regex:`.*${search}.*`}},
// 	{name:{$regex:`.*${search}.*`}}],_id:{ $in:documentIds}}).then(
// 	results=>{

// 	}).catch(e=>{
// 	console.log(e);
// });

module.exports = app;