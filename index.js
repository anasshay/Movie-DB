const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const url = require("./config/url").url;
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

Movies.find().then((item) => {
  if (item.length == 0) {
    Movies.create(
      { title: "Jaws", year: 1975, rating: 8 },
      { title: "Avatar", year: 2009, rating: 7.8 },
      { title: "Brazil", year: 1985, rating: 8 },
      { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 }
    )
      .then()
      .catch((err) => console.log(err));
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  Movies.find().then((item) => res.send(item));
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
      // movies.push(req.body);
      Movies.create(req.body).then(() => {
        Movies.find()
          .then((item) => res.send({ status: 200, data: item }))
          .catch((err) => {
            console.log(err);
          });
      });
      // res.send(movies);
    } else {
      Movies.create(req.body).then(() => {
        Movies.find()
          .then((item) => res.send({ status: 200, data: item }))
          .catch((err) => {
            console.log(err);
          });
      });
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
  Movies.find().then((items) =>
    res.status(200).send({ status: 200, data: items })
  );
});

app.get("/movies/read/:content", (req, res) => {
  if (req.params.content == "by-date") {
    Movies.find().then((items) =>
      res
        .status(200)
        .send({ status: 200, data: items.sort((a, b) => a.year - b.year) })
    );
  } else if (req.params.content == "by-rating") {
    Movies.find().then((items) =>
      res
        .status(200)
        .send({ status: 200, data: items.sort((a, b) => b.rating - a.rating) })
    );
  } else if (req.params.content == "by-title") {
    Movies.find().then((items) =>
      res.status(200).send({
        status: 200,
        data: items.sort((a, b) =>
          a.title > b.title ? 1 : b.title > a.title ? -1 : 0
        ),
      })
    );
  }
});

app.get("/movies/read/id/:ID", (req, res) => {
  Movies.find().then((items) => {
    if (Number(req.params.ID) >= 0 && req.params.ID < items.length) {
      res.status(200).send({
        status: 200,
        data: items[req.params.ID],
      });
    } else {
      res.status(404).send({
        status: 404,
        error: true,
        message: `the movie ${req.params.ID} does not exist`,
      });
    }
  });
});

app.put("/movies/:ID", (req, res) => {
  let newTitle = req.body.newTitle;
  let newYear = req.body.newYear;
  let newRating = req.body.newRating;
  Movies.find().then((items) => {
    if (Number(req.params.ID) >= 0 && req.params.ID < items.length) {
      if (newTitle) {
        Movies.updateOne(items[req.params.ID], { title: newTitle }).then(
          (items[req.params.ID].title = newTitle)
        );
      }
      if (newRating && !isNaN(newRating)) {
        Movies.updateOne(items[req.params.ID], { rating: newRating }).then(
          (items[req.params.ID].rating = newRating)
        );
      }
      if (newYear && newYear && newYear >= 1000 && !isNaN(newYear)) {
        Movies.updateOne(items[req.params.ID], { year: newYear }).then(
          (items[req.params.ID].year = newYear)
        );
      }
      res.status(200).send({ status: 200, data: items });
    }
  });
});

app.delete("/movies/:ID", (req, res) => {
  Movies.find().then((items) => {
    if (Number(req.params.ID) >= 0 && req.params.ID < items.length) {
      // Movies.deleteOne({title: "Jaws"})
      items.splice(parseInt(req.params.ID), 1);
      res.send(items);
    } else {
      res.status(404).send({
        status: 404,
        error: true,
        message: `the movie ${req.params.ID} does not exist`,
      });
    }
  });
});

app.listen(port, console.log(`Connected to ${port}`));
