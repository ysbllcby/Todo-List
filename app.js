//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// // Create and connect mongoose database
// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// mongoose.connect(
//   "mongodb+srv://admin-ysa:Test123@cluster0.ljm0uov.mongodb.net/todolist?ssl=true&authSource=admin&w=majority"
// );

// mongoose.connect(
//   "mongodb+srv://admin-ysa:Test123@cluster0.ljm0uov.mongodb.net/todolist?ssl=true&authSource=admin&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

mongoose.connect(
  "mongodb+srv://admin-ysa:Test123@cluster0.ljm0uov.mongodb.net/todolistDB"
);

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

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("list", listSchema);

// Insert items into database
// Item.insertMany(defaultItems);

// app.get("/", async (req, res) => {
//   Item.find()
//     .then(function (items) {
//       if (items.length === 0) {
//         Item.insertMany(items);
//       } else {
//         res.render("list", { listTitle: "Today", newListItems: items });
//       }
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// });

app.get("/", async (req, res) => {
  try {
    const items = await Item.find();

    if (items.length === 0) {
      await Item.insertMany(defaultItems);
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then(function (foundList) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then(function (foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.deleteMany({ _id: checkedItemId }).then(() => {
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    ).then(function (foundList) {
      res.redirect("/" + listName);
    });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
