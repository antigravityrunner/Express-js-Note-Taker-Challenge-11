const express = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static("public"));
app.use(express.json());

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("/api/notes", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json"));
  let newNote = req.body;
  newNote.id = uuidv4();
  notes.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.status(201).json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json"));
  let index = -1;
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].id == req.params.id) {
      index = i;
    }
  }
  if (index > -1) {
    notes.splice(index, 1);
  }
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.status(201).json(notes);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
