const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
// require all needed necessary node based programs are connections
const PORT = 3001;

app.use(express.static('public'));
//allow path to be built relative within the public folder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/notes', (req, res) => {})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
