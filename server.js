const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload());

// ملف البيانات
const DATA_FILE = path.join(__dirname, 'restaurants.json');

// جلب البيانات
app.get('/api/restaurants', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// حفظ البيانات
app.post('/api/restaurants', (req, res) => {
  const data = req.body;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// رفع الصور
app.post('/api/upload', (req, res) => {
  if (!req.files || !req.files.image) return res.status(400).send('لا توجد صورة');
  let image = req.files.image;
  const uploadPath = path.join(__dirname, 'public/images', image.name);
  image.mv(uploadPath, err => {
    if (err) return res.status(500).send(err);
    res.json({ filename: image.name });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
