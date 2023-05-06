//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Create and connect mongoose database
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// Schema for items
const itemsSchema = {
  name: String
};

// Mongoose model
const Item = mongoose.model("item", itemsSchema);

// New documents for items
const item1 = new Item({
  name: "Study"
});

const item2 = new Item({
  name: "Laundry"
});

const item3 = new Item({
  name: "Meditate"
});

const defaultItems = [item1, item2, item3];

// Insert items into database
Item.insertMany(defaultItems);

app.get("/", async (req, res) => {
  try {
    await Item.find({ });
    res.send(defaultItems);
    console.log(defaultItems);
  } catch (err) {
    console.log(err);
  }
});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
