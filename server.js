const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const notes = require('./db/db.json');
const app = express();
// require all needed necessary node based programs are connections
const PORT = 3001;

app.use(express.static('public'));
//allow path to be built relative within the public folder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const grabDbNoteInfo = util.promisify(fs.readFile);
const saveNotes = (notes, newNote) =>
        fs.writeFile(notes, JSON.stringify(newNote), (err) =>
         err ? console.error(err) : console.info(`\nData written to ${notes}`)
            );
        const readAndAddNotes = (newNotes, notes) => {
            fs.readFile(notes, 'utf8', (err, data) => {
              if (err) {
                console.error(err);
              } else {
                const parsedInfo = JSON.parse(data);
                parsedInfo.push(newNotes);
                saveNotes(notes, parsedInfo);
              }
            });
          };
app.get('/api/notes', (req, res) => {
    grabDbNoteInfo('/api/notes').then((data) => res.json(JSON.parse(data)))
});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if(title && text){
        const newNotes = {
            title,
            text,
        }
        readAndAddNotes(newNotes, './db/db.json');

        const response = {
            status: "success",
            body: notes,
        }
    console.log(response);
    res.json(response)
    }else{
        res.json('Error in posting review');
    }
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
