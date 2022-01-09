const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const url =
  "mongodb+srv://anass2:n5M54RDZUf8bRX7L@cluster0.6bpfc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const Movies = require("./modules/movies");

mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

const movies = [
  { title: "Jaws", year: 1975, rating: 8 },
  { title: "Avatar", year: 2009, rating: 7.8 },
  { title: "Brazil", year: 1985, rating: 8 },
  { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ok.");
});

app.get("/test", (req, res) => {
  res.status(200).send({ status: 200, message: "ok" });
});

app.get("/time", (req, res) => {
  let time = new Date();
  res
    .status(200)
    .send({ status: 200, message: `${time.getHours()}:${time.getMinutes()}` });
});

app.get("/hello/:userID", (req, res) => {
  res.status(200).send({ status: 200, message: `Hello, ${req.params.userID}` });
});

app.get("/search", (req, res) => {
  if (req.query.s) {
    res.status(200).send({ status: 200, message: "ok", data: req.query.s });
  } else {
    res.status(500).send({
      status: 500,
      error: true,
      message: "you have to provide a search",
    });
  }
});

// Movies :

app.post("/movies", (req, res) => {
  let newTitle = req.body.title;
  let newYear = req.body.year;
  let newRating = req.body.rating;
  if (newTitle && newYear && newYear >= 1000 && !isNaN(newYear)) {
    if (newRating == undefined) {
      req.body.rating = 4;
      movies.push(req.body);
      res.send(movies);
    } else {
      movies.push(req.body);
      res.send(movies);
    }
  } else {
    res.status(403).send({
      status: 403,
      error: true,
      message: "you cannot create a movie without providing a title and a year",
    });
  }
});



app.get("/movies/read", (req, res) => {
  res.status(200).send({ status: 200, data: movies });
});
app.get("/movies/read/:content", (req, res) => {
  if (req.params.content == "by-date") {
    res
      .status(200)
      .send({ status: 200, data: movies.sort((a, b) => a.year - b.year) });
  } else if (req.params.content == "by-rating") {
    res
      .status(200)
      .send({ status: 200, data: movies.sort((a, b) => b.rating - a.rating) });
  } else if (req.params.content == "by-title") {
    res.status(200).send({
      status: 200,
      data: movies.sort((a, b) =>
        a.title > b.title ? 1 : b.title > a.title ? -1 : 0
      ),
    });
  }
});
app.get("/movies/read/id/:ID", (req, res) => {
  if (Number(req.params.ID) >= 0 && req.params.ID < movies.length) {
    res.status(200).send({
      status: 200,
      data: movies[req.params.ID],
    });
  } else {
    res.status(404).send({
      status: 404,
      error: true,
      message: `the movie ${req.params.ID} does not exist`,
    });
  }
});




app.patch("/movies/:ID", (req, res) => {
    let newTitle = req.body.newTitle;
    let newYear = req.body.newYear;
    let newRating = req.body.newRating;
    console.log(req.body);
  if (Number(req.params.ID) >= 0 && req.params.ID < movies.length) {
    if (newTitle) {
      movies[req.params.ID].title = newTitle;
    }
    if (newRating && !isNaN(newRating)) {
      movies[req.params.ID].rating = newRating;
    }
    if (
      newYear &&
      newYear &&
      newYear >= 1000 &&
      !isNaN(newYear)
    ) {
      movies[req.params.ID].year = newYear;
    }
    res.status(200).send({ status: 200, data: movies });
  }
});





app.delete("/movies/:ID", (req, res) => {
  if (Number(req.params.ID) >= 0 && req.params.ID < movies.length) {
    movies.splice(parseInt(req.params.ID), 1);
    res.send(movies);
  } else {
    res.status(404).send({
      status: 404,
      error: true,
      message: `the movie ${req.params.ID} does not exist`,
    });
  }
});

app.listen(port, console.log(`Connected to ${port}`));
