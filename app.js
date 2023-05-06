//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Create and connect mongoose database
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// Schema for items
const itemsSchema = {
  name: String,
};

// Mongoose model
const Item = mongoose.model("item", itemsSchema);

// New documents for items
const item1 = new Item({
  name: "Study",
});

const item2 = new Item({
  name: "Laundry",
});

const item3 = new Item({
  name: "Meditate",
});

const defaultItems = [item1, item2, item3];

// Insert items into database
// Item.insertMany(defaultItems);

app.get("/", async (req, res) => {
  Item.find()
    .then(function (items) {
      if (items.length === 0) {
        Item.insertMany(items);
      } else {
        res.render("list", { listTitle: "Today", newListItems: items });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  Item.deleteMany({ _id: checkedItemId })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
