const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');
const app = express();
// require all needed necessary node based programs are connections
const PORT = 3001;

app.use(express.static('public'));
//allow path to be built relative within the public folder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve up html root route /notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});


//helper functions to parse, read and write notes...
const grabDbNoteInfo = util.promisify(fs.readFile);

const saveNotes = (notes, newNote) =>
  fs.writeFile(notes, JSON.stringify(newNote), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${notes}`)
  );
// takes notes and new notes from post request
const readAndAddNotes = (newNotes, notes) => {
  fs.readFile(notes, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      //take notes parse and push new notes into it
      const parsedInfo = JSON.parse(data);
      parsedInfo.push(newNotes);
      saveNotes(notes, parsedInfo);
    }
  });
};

app.get('/api/notes', (req, res) => {
  grabDbNoteInfo('./db/db.json').then((data) => res.json(JSON.parse(data)))
});
//post request that connects to line 36 on index.js
app.post('/api/notes', (req, res) => {
  req.body.id = uuid();
  const { title, text, id } = req.body;

  if (title && text) {
    const newNotes = {
      title,
      text,
      id,
    }
    readAndAddNotes(newNotes, './db/db.json');

    const response = {
      status: "success",
      body: newNotes,
    }
    res.json(response)
  } else {
    res.json('Error in posting review');
  }
});
//delete request using uuid
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  grabDbNoteInfo('./db/db.json').then((data) => {
    let notes = JSON.parse(data)
    for (let i = 0; i < notes.length; i++) {
      if (id === notes[i].id) {
        notes = notes.splice(i, 1);
      }
    }
    res.json(JSON.parse(data))
  })
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column
// ```