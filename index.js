const express = require("express");
const app = express();
const port = 3000;

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

app.listen(port, console.log(`Connected to ${port}`));
