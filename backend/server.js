const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require('dotenv').config(); // Import dotenv to load environment variables

const app = express();
const PORT = 3000;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static("uploads")); 

// Endpoint to fetch the admin password from the server
app.get('/admin-password', (req, res) => {
  res.json({ password: process.env.serverPassword });
});

// Endpoint to upload a file
app.post("/upload", upload.single("file"), (req, res) => {
  const { title, author, description, category } = req.body;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  }

  const newFile = {
    id: Date.now(),
    title,
    author,
    description,
    category,
    url: `/uploads/${file.originalname}`,
  };

  fs.readFile("files.json", (err, data) => {
    if (err) throw err;

    let files = [];
    if (data.length > 0) {
      files = JSON.parse(data);
    }

    files.push(newFile);

    fs.writeFile("files.json", JSON.stringify(files, null, 2), (err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});

// Endpoint to fetch all files
try {
  app.get("/files", (req, res) => {
    fs.readFile("files.json", (err, data) => {
      if (err) throw err;
      res.json({ files: JSON.parse(data) });
    });
  });
} catch (error) {
  console.log(error);
}

// Endpoint to delete a file by id
app.delete("/delete/:id", (req, res) => {
  const fileId = parseInt(req.params.id);

  fs.readFile("files.json", (err, data) => {
    if (err) throw err;

    let files = JSON.parse(data);
    files = files.filter((file) => file.id !== fileId);

    fs.writeFile("files.json", JSON.stringify(files, null, 2), (err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
