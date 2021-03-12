const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp',
  limits: { fileSize: 24 * 1024 * 1024 },
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

function uploader(req, res, next) {
  if (!req.files || Object.keys(req.files).length === 0) {
    req.files = [];
  } else {
    function fileHandle(file) {
      console.log(file.name);
      const foldr = `./media/${req.params.folder}`;
      file.path = `${foldr}/${file.name}`;
      if (!fs.existsSync(foldr)){
        fs.mkdirSync(foldr);
      }
      file.mv(file.path, function (err) {
        if (err) return console.error(err);
      });
      return file;
    }
    fileHandle(req.files.image);
  }
  next();
}

app.post('/save/:folder/:img', uploader, async (req, res) => {
  console.log(req.url);
  res.status(200).send('ok.');
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});