const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

mongoose.connect('mongodb://localhost:27017/sahayog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => console.error(err));
