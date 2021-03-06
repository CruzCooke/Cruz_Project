const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const myconn = require("./connection");

// every single collection will need a model
const Writer = require("./models/writers-model");
const Books = require("./models/books-model");

// init express, bodyparser now built in to express...
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
// end init express

// init database stuff
mongoose.connect(myconn.atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("connected", e => {
  console.log("+++ Mongoose connected ");
});

db.on("error", () => console.log("Database error"));
// end database stuff

// start of routes
const router = express.Router();
app.use("/api", router);

// CREATE
router.post("/writers", (req, res) => {
  var newwriter = new Writer();

  var data = req.body;
  console.log(">>> ", data);
  Object.assign(newwriter, data);

  newwriter.save().then(
    result => {
      return res.json(result);
    },
    () => {
      return res.send("problem adding new user");
    }
  );
});

// READ
router.get("/writers", (req, res) => {
  // .sort({ age: "descending" })
  Writer.find()
    .populate("books")
    .then(writers => {
      res.json(writers);
    });
});

router.get("/books/:id", (req, res) => {
  console.log("findingbook")
  Books.findOne({ _id: req.params.id }, function(err, objFromDB) {
    res.send([objFromDB]);
  });
});




router.get("/books", (req, res) => {
  // .sort({ age: "descending" })
  books.find()
    .then(answerFromDB => {
      res.json(answerFromDB);
    });
});











// create a new book
router.post("/books", (req, res) => {
  var newbook = new Books();

  var data = req.body;
  console.log(">>> ", data);
  Object.assign(newbook, data);

  newbook.save().then(
    result => {
      return res.json(result);
    },
    () => {
      return res.send("problem adding new book");
    }
  );
});

// deal with any unhandled urls on the api endpoint - place at end
router.get("/*", (req, res) => {
  res.json({ result: "invalid endpoint, please choose another" });
});

app.get("/*", (req, res) => {
  res.json({ result: "invalid endpoint, please choose another" });
});

// grab a port and start listening
const port = 4001;
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});
