const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database');
const importRoute = require('./routes/import');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
const db = initDatabase();

// Pass db to routes by storing it in app.locals
app.locals.db = db;

// Routes
app.use('/admin/products/import-from-link', importRoute);

app.get('/', (req, res) => {
  res.send('OURGOODS Backend Server is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
