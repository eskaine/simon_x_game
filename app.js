const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
var source = "dist";

if(process.env.NODE_ENV === "development") {
    source = "src";
}

app.use(express.static(path.join(__dirname, source)));

app.get('/', (req, res) =>
  res.sendFile('index.html')
);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}...`);
});

